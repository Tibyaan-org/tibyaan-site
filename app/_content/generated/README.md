# Generated content (verbatim tool output)

Files here are byte-verbatim excerpts of real Tibyaan CLI output. They are read at build time
and rendered as escaped text inside `<pre><code>`, so pasting future real output here can never
break the page:

- The content is plain text in a `.txt` file, so there is no JavaScript string literal to escape.
  A backtick, a `${` , a `<`, a `>`, or an `&` in the output is just a byte in a text file.
- The page reads the file at build time (`fs.readFileSync`) and renders it as a React text node,
  which HTML-escapes it automatically. Escaping is a render concern only; the file content is
  never edited to fit.
- Long unbroken lines scroll horizontally inside the code panel (the panel is a min-width:0
  container with `overflow-x: auto`); they never stretch the page.

## Regeneration contract

To refresh `erp-survey.txt`:

1. Run the real scan against the public benchmark:
   `java -jar tibyan-cli-<version>-jar-with-dependencies.jar scan examples/erp-backend`
2. Paste output into `erp-survey.txt`. Keep every `Failed`, `List-refused`, and `Totals` line in
   full. Only the discovered lists may be shortened, and every cut must be marked in the text with
   a `... (+N more ...)` line. Refusals are never elided (site copy rule 8).
3. Rebuild. No code change is needed, and no character can break the layout.

The provenance shown in the caption lives in `../survey.ts`.

## mcp-handshake.txt

The four recorded lines of the out-of-process MCP handshake against the in-repo example app
(`examples/legacy-spring-app`), copied byte for byte from the main repository's
`docs/CONNECTING-AN-MCP-CLIENT.md` ("Verified end to end", recorded 2026-07-07). The only
editorial act is removing the two-space list indent the Markdown carries. The `sessionId` elision
(`e843ec10-...`) is in the source record itself. The `serverInfo` version reads `0.1.0` because
that is what the recorded run printed; the file is a record, so it is not updated to look current.
To refresh it, re-run `python scripts/verify-mcp-sse.py` against the example app, record the new
output in the main repository first, then copy it here. The provenance shown in the caption lives
in `../survey.ts`.
