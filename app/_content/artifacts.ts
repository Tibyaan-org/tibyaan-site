/*
  Verbatim generated-output snippets. NOT retyped and NOT reformatted inside a line:
  every character and line break below is copied from files the tool really generated
  during the build session, from the commands in each `provenance`. The only editorial
  acts are (1) a uniform dedent of the extracted fragment and (2) whole-line omission,
  always marked. No line's content is altered.

  These are the artifact the product's honesty is legible in: the tool writes its own
  limits into the output ("the total count and page envelope are not modeled",
  "Partial model: 4 field(s) ... are not represented").

  Source app is examples/erp-backend, a benchmark whose capabilities and entity names
  are already public in docs/experiments/third-app-trial.md and the README (the app
  source itself is gitignored). The private enterprise benchmark never appears here.
*/

export const MCP_PROVENANCE = {
  command: "tibyan generate --backend mcp (file: tibyan/capabilities.json)",
  tool: "tibyan CLI 0.2.0-SNAPSHOT (current build)",
  date: "2026-07-17",
} as const;

// Two of the 25 entries in the manifest's "tools" array, shown together. The second
// description is the tool disclosing what it does not model.
export const MCP_SNIPPET = `{
  "name": "getProduct",
  "description": "Read Product by id.",
  "binding": "ProductServiceImpl#findById",
  "output": "ENTITY_REF(Product)",
  "inputs": [
    {
      "name": "id",
      "type": "UUID"
    }
  ]
},
{
  "name": "listContact",
  "description": "List all Contact. Returns a page of results; the total count and page envelope are not modeled.",
  "binding": "ContactServiceImpl#findAll",
  "output": "ENTITY_REF(Contact)",
  "outputMultiple": true,
  "paged": true,
  "inputs": []
}`;

export const OPENAPI_PROVENANCE = {
  command: "tibyan generate --backend openapi (file: openapi.json)",
  tool: "tibyan CLI 0.2.0-SNAPSHOT (current build)",
  date: "2026-07-17",
} as const;

// The Product component schema from the real OpenAPI document. The description states,
// in the artifact itself, exactly which source fields are not represented. Properties
// after the third are omitted (marked); the honest description line is shown in full.
export const OPENAPI_SNIPPET = `"Product": {
  "type": "object",
  "description": "Entity Product as modeled by Tibyaan. Partial model: 4 field(s) of the source entity are not represented: suppliers, images, documents, pricings.",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "barcodeType": {
      "$ref": "#/components/schemas/BarcodeType"
    },
    "unit": {
      "$ref": "#/components/schemas/Unit"
    }
    ... (22 more properties)
  }
  ... ("required" array of the 25 modeled property names, omitted for length)
}`;
