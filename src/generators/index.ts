import { fetchContentfulSpaceData } from "./import-contentful-data";
import { createTypesModels, createTypesTS } from "./create-models-and-types";
import { createEntries } from "./create-entries";
import { createSlugsTypes } from "./create-slugs-types";
import createApi from "./create-api";
import { CAGOptions } from "../../types";

export default async function (args: CAGOptions) {
  const options = {
    basePath: args.basePath ?? "/api/contentful",
    contentFile: args.contentFile ?? "contentful-export.json",
    exportDir: args.exportDir ?? `${options.basePath}/data`,
    errorLogFile: args.errorLogFile ?? "error.log",
    downloadAssets: args.downloadAssets ?? true,
    contentEntriesJSONPath:
      args.contentEntriesJSONPath ?? `${options.basePath}/contentEntries.json`,
    contentTypesJSONPath:
      args.contentTypesJSONPath ?? `${options.basePath}/contentTypes.json`,
    apiTSPath: args.apiTSPath ?? `${options.basePath}/api.ts`,
    ...args,
  };

  await fetchContentfulSpaceData(options);
  // if (options.downloadAssets) moveAssetsToPublicFolder();

  // Entrypoint for all generators in a certain order
  // Import made separately

  createTypesModels();
  createTypesTS();
  createEntries();
  createSlugsTypes();
  createApi();
}
