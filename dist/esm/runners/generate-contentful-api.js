import { fetchContentfulSpaceData, moveAssetsToPublicFolder, } from "./import-contentful-data.js";
import { createTypesModels, createTypesTS, } from "../generators/create-models-and-types.js";
import { createSlugsTypes } from "../generators/create-slugs-types.js";
import createApi from "../generators/create-api.js";
import { createEntries } from "../generators/create-entries.js";
function CreateOptions(args) {
    this.options = {};
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
export async function generateContentfulApi(args) {
    const options = CreateOptions(args);
    await fetchContentfulSpaceData(options);
    if (options.downloadAssets)
        moveAssetsToPublicFolder(options);
    // Entrypoint for all generators in a certain order
    // Import made separately
    createTypesModels(options.basePath);
    createTypesTS(options.basePath);
    createEntries(options.basePath);
    createSlugsTypes(options.basePath);
    createApi(options);
}
