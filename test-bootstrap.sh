#!/usr/bin/env bash
# Run with: bash test-bootstrap.sh
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fixture="$(mktemp -d)"
trap 'rm -rf "$fixture"' EXIT

mkdir "$fixture/bin"
cp "$root/bootstrap.sh" "$fixture/"
export GIT_CALLS="$fixture/git-calls"
export PATH="$fixture/bin:$PATH"
cat >"$fixture/bin/git" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$GIT_CALLS"
exit 1
EOF
chmod +x "$fixture/bin/git"

if fresh_output="$("$fixture/bootstrap.sh" --dry-run 2>&1)"; then
  echo "Expected a fresh dry run to fail without a local Baton checkout" >&2
  exit 1
fi
[[ "$fresh_output" == *"requires a local Baton checkout"* ]]
[[ ! -e "$fixture/Baton" && ! -e "$GIT_CALLS" ]]

mkdir -p "$fixture/Baton/.git" "$fixture/Baton/scripts"
cat >"$fixture/Baton/scripts/clone-fleet.sh" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$@"
EOF
chmod +x "$fixture/Baton/scripts/clone-fleet.sh"

for dry_run in --dry-run -n; do
  existing_output="$("$fixture/bootstrap.sh" --update "$dry_run" --only ExampleSim)"
  [[ "$existing_output" == "$(printf '%s\n' --update "$dry_run" --only ExampleSim)" ]]
  [[ ! -e "$GIT_CALLS" ]]
done

echo "Bootstrap dry-run tests passed."
