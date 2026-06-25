import fs from "node:fs/promises";
import vm from "node:vm";
import { pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const appSource = await fs.readFile(new URL("src/app.js", root), "utf8");
const { taxonomy, literatureNotes } = await import(pathToFileURL(new URL("src/taxonomy.js", root).pathname));

function extractConst(name) {
  const marker = `const ${name} = `;
  const start = appSource.indexOf(marker);
  if (start < 0) throw new Error(`Could not find ${name}`);

  const valueStart = start + marker.length;
  let quote = "";
  let escaped = false;
  let depth = 0;

  for (let index = valueStart; index < appSource.length; index += 1) {
    const character = appSource[index];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = "";
      }
      continue;
    }
    if (character === "\"" || character === "'" || character === "`") {
      quote = character;
      continue;
    }
    if (character === "[" || character === "{" || character === "(") depth += 1;
    if (character === "]" || character === "}" || character === ")") depth -= 1;
    if (character === ";" && depth === 0) {
      return vm.runInNewContext(`(${appSource.slice(valueStart, index)})`);
    }
  }
  throw new Error(`Could not parse ${name}`);
}

const output = {
  generatedAt: new Date().toISOString(),
  taxonomy,
  literatureNotes,
  featuresActivated: extractConst("signalAttributes"),
  emotionFamilies: extractConst("emotionFamilies"),
  whatJustHappenedDimensions: extractConst("whatJustHappenedDimensions"),
  emotionFamilyAliases: extractConst("emotionFamilyAliases"),
  workflowModules: extractConst("modules").map(({ id, label }) => ({ id, label })),
  interpretationFields: [
    {
      name: "Expression name",
      purpose: "A concise interpretive label for the complete expression."
    },
    {
      name: "Subtext",
      purpose: "A first-person statement of the implied internal or relational message."
    },
    {
      name: "Evidence",
      purpose: "Observed features and contextual reasoning supporting the interpretation."
    }
  ],
  assignmentBins: [
    {
      name: "External",
      purpose: "What the face or body communicates, manages, performs, or offers outwardly."
    },
    {
      name: "Internal",
      purpose: "What the person may be feeling, processing, remembering, or protecting inwardly."
    }
  ]
};

const destination = process.argv[2] || new URL("../docs/taxonomy-data.json", import.meta.url).pathname;
await fs.mkdir(new URL("../docs/", import.meta.url), { recursive: true });
await fs.writeFile(destination, `${JSON.stringify(output, null, 2)}\n`);
console.log(destination);
