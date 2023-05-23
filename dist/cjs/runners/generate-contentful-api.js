"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContentfulApi = void 0;
const import_contentful_data_js_1 = require("./import-contentful-data.js");
const create_models_and_types_js_1 = require("../generators/create-models-and-types.js");
const create_slugs_types_js_1 = require("../generators/create-slugs-types.js");
const create_api_js_1 = require("../generators/create-api.js");
const create_entries_js_1 = require("@/src/generators/create-entries.js");
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
async function generateContentfulApi(args) {
    const options = CreateOptions(args);
    await (0, import_contentful_data_js_1.fetchContentfulSpaceData)(options);
    if (options.downloadAssets)
        (0, import_contentful_data_js_1.moveAssetsToPublicFolder)(options);
    // Entrypoint for all generators in a certain order
    // Import made separately
    (0, create_models_and_types_js_1.createTypesModels)(options.basePath);
    (0, create_models_and_types_js_1.createTypesTS)(options.basePath);
    (0, create_entries_js_1.createEntries)(options.basePath);
    (0, create_slugs_types_js_1.createSlugsTypes)(options.basePath);
    (0, create_api_js_1.default)(options);
}
exports.generateContentfulApi = generateContentfulApi;
