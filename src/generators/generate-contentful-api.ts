import fs from "fs";
import {createTypesModels, createTypesTS} from "./create-models-and-types";
import {createEntries} from "./create-entries";
import {createSlugsTypes} from "./create-slugs-types";

//TODO: dynamic path
const basePath = "/api/contentful";
const exportFilePath = `${basePath}/data/contentful-export.json`;
const contentfulExportFile = JSON.parse(
  fs.readFileSync(__dirname + exportFilePath).toString()
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
// createApi();
