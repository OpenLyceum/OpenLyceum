-- pandoc filter for the handouts:
--  * <br> (answer space) becomes a real line break, since raw HTML is dropped in .docx;
--  * screenshots fill the text width and diagrams 90 % of it.
function RawInline(el)
  if el.format == "html" and el.text:match("^<br%s*/?>$") then
    return pandoc.LineBreak()
  end
end

function Image(el)
  if not el.attributes.width then
    if el.src:match("^img/") then
      el.attributes.width = "100%"
    else
      el.attributes.width = "90%"
    end
  end
  return el
end
