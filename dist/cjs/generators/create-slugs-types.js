"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlugsTypes = void 0;
const fs = __importStar(require("fs"));
const prettier_1 = require("prettier");
function createSlugsTypes(basePath) {
    const contentEntriesPath = `${basePath}/contentEntries.json`;
    const contentTypesPath = `${basePath}/contentTypes.json`;
    const slugsTSPath = `${basePath}/slugs.ts`;
    const locales = JSON.parse(fs.readFileSync(basePath + "/locales.json").toString());
    const entries = JSON.parse(fs.readFileSync(contentEntriesPath).toString());
    const types = JSON.parse(fs.readFileSync(__dirname + contentTypesPath).toString());
    const defaultLocale = locales[0].code;
    const slugsTypes = `
        export type CTSlugs = ${entries.reduce((acc, cur, idx) => {
        return !cur.fields.slug
            ? acc
            : acc +
                `${idx > 0 ? " | " : ""}'${cur.fields.slug?.[defaultLocale] ??
                    cur.fields.title?.[defaultLocale]
                        ?.toLowerCase()
                        ?.replaceAll(/\'/gi, "")
                        ?.split(" ")
                        .join("-")}'`;
    }, "")}
    `;
    const slugsByTypes = `${types.reduce((typesAcc, type) => {
        const filteredEntries = entries.filter((entry) => entry.sys?.contentType?.sys?.id === type.contentTypeId);
        return (typesAcc +
            `\n\nexport type CT${type.name.replace(/\s/gi, "")}Slug = ${filteredEntries.length === 0
                ? `''`
                : filteredEntries.reduce((entriesAcc, entry, idx) => {
                    try {
                        return (entriesAcc +
                            `${idx > 0 ? " | " : ""}'${entry.fields.slug[defaultLocale]}'`);
                    }
                    catch (e) {
                        console.error("ERR WHILE SLUG TYPES GEN:", e, {
                            entry: JSON.stringify(entry, null, 2),
                            idx,
                        });
                    }
                }, "")};`);
    }, ``)}`;
    const slugsForAssets = () => {
        const assetsEntries = entries.filter((entry) => entry.sys?.type === "Asset");
        return `\n\nexport type CTAssetSlug = ${assetsEntries.length === 0
            ? `''`
            : `${assetsEntries.reduce((assetsAcc, asset, idx) => {
                return (assetsAcc +
                    `${idx > 0 ? " | " : ""}"${asset.fields.title[defaultLocale]}"`);
            }, ``)}`};`;
    };
    const filepath = __dirname + slugsTSPath;
    const prettified = (0, prettier_1.format)(slugsTypes + slugsByTypes + slugsForAssets(), {
        filepath,
    });
    fs.writeFileSync(filepath, prettified);
}
exports.createSlugsTypes = createSlugsTypes;
