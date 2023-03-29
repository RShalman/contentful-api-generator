const fs = require("fs");
const {
  createTypesModels,
  createTypesTS,
} = require("./create-models-and-types.js");
const { createEntries } = require("./create-entries.js");
const { createSlugsTypes } = require("./create-slugs-types.js");
const { createApi } = require("./create-api.js");

//TODO: dynamic path
const basePath = "/api/contentful";
const exportFilePath = `${basePath}/data/contentful-export.json`;
const contentfulExportFile = JSON.parse(
  fs.readFileSync(__dirname + exportFilePath)
);

if (!contentfulExportFile) {
  throw new Error(
    "Seems like you have no imported contentful data! Make an import first!"
  );
}

// Entrypoint for all generators in a certain order
// Import made separately

createTypesModels();
createTypesTS();
createEntries();
createSlugsTypes();
createApi();
