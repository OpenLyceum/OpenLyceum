// Checks every handout folder: image links resolve, each SVG parses and has <title> and <desc>,
// and bold words in "**…**" that look like control names exist in the sim's English strings.
//   node handouts/tools/check.mjs [Sim ...]
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sims = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(root).filter((d) => existsSync(`${root}/${d}/handout.md`));
let problems = 0;
const flat = (o, out = []) => { for (const v of Object.values(o)) typeof v === "string" ? out.push(v) : flat(v, out); return out; };
for (const sim of sims) {
  const strings = flat(JSON.parse(readFileSync(`${root}/../${sim}/src/i18n/strings_en.json`, "utf8"))).map((s) => s.replace(/<[^>]+>/g, ""));
  for (const file of ["handout.md", "answers.md"]) {
    const path = `${root}/${sim}/${file}`;
    if (!existsSync(path)) { console.log(`${sim}/${file}: missing`); problems++; continue; }
    const md = readFileSync(path, "utf8");
    for (const [, src] of md.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
      if (!existsSync(`${root}/${sim}/${src}`)) { console.log(`${sim}/${file}: missing image ${src}`); problems++; }
    }
    if (file === "handout.md") {
      const unknown = new Set();
      for (const [, b] of md.matchAll(/\*\*([^*]+)\*\*/g)) {
        const name = b.trim();
        if (/^(P?\d+[a-z]?\.|Part|Hint|before|we never|minimum|one thing)/i.test(name) || /[=÷]/.test(name)) continue;
        if (!strings.some((s) => s.includes(name))) unknown.add(name);
      }
      if (unknown.size) console.log(`${sim}/handout.md: bold names not in strings_en.json (check by eye): ${[...unknown].join(" | ")}`);
    }
  }
  const svgDir = `${root}/${sim}/svg`;
  for (const f of existsSync(svgDir) ? readdirSync(svgDir).filter((f) => f.endsWith(".svg")) : []) {
    const s = readFileSync(`${svgDir}/${f}`, "utf8");
    if (!/<title>[^<]+<\/title>/.test(s) || !/<desc>[^<]+<\/desc>/.test(s)) { console.log(`${sim}/svg/${f}: missing title/desc`); problems++; }
    const opens = (s.match(/<(?!\/|\?|!)[a-zA-Z]+[^>]*[^/]>/g) || []).length, closes = (s.match(/<\/[a-zA-Z]+>/g) || []).length;
    if (opens !== closes) { console.log(`${sim}/svg/${f}: unbalanced tags (${opens} open, ${closes} close)`); problems++; }
  }
}
console.log(problems ? `${problems} problem(s)` : "all checks passed");
process.exit(problems ? 1 : 0);
