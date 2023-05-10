import { fetchContentfulSpaceData } from "./import-contentful-data";
import { createTypesModels, createTypesTS } from "./create-models-and-types";
import { createEntries } from "./create-entries";
import { createSlugsTypes } from "./create-slugs-types";
import createApi from "./create-api";
import { CAGOptions } from "../../types";

function CreateOptions(args: CAGOptions): CAGOptions {
  this.options = {} as CAGOptions;
  this.options.basePath = args.basePath ?? "/api/contentful";
  this.options.contentFile = args.contentFile ?? "contentful-export.json";
  this.options.exportDir = args.exportDir ?? `${this.options.basePath}/data`;
  this.options.errorLogFile = args.errorLogFile ?? "error.log";
  this.options.downloadAssets = args.downloadAssets ?? true;
  this.options.contentEntriesJSONPath =
    args.contentEntriesJSONPath ??
    `${this.options.basePath}/contentEntries.json`;
  this.options.contentTypesJSONPath =
    args.contentTypesJSONPath ?? `${this.options.basePath}/contentTypes.json`;
  this.options.apiTSPath = args.apiTSPath ?? `${this.options.basePath}/api.ts`;

  Object.assign(this.options, args);

  return this.options;
}

export default async function generateContentfulApi(args: CAGOptions) {
  const options = CreateOptions(args);

  await fetchContentfulSpaceData(options);
  // if (options.downloadAssets) moveAssetsToPublicFolder();

  // Entrypoint for all generators in a certain order
  // Import made separately

  createTypesModels();
  createTypesTS();
  createEntries();
  createSlugsTypes();
  createApi(options);
}
