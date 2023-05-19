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
exports.createEntries = exports.findById = void 0;
const fs = __importStar(require("fs"));
const commons_1 = require("../utils/commons");
const findById = (arr, id) => arr.find((el) => el.sys.id === id) ?? null;
exports.findById = findById;
function createEntries(basePath) {
    const exportFilePath = `${basePath}/data/contentful-export.json`;
    const contentEntriesPath = `${basePath}/contentEntries.json`;
    const { entries, assets } = JSON.parse(fs.readFileSync(exportFilePath).toString()) ?? {};
    const locales = JSON.parse(fs.readFileSync(basePath + "/locales.json").toString());
    const procAssets = assets
        ? JSON.parse(JSON.stringify(assets).replaceAll(/\/\/images/gi, "images"))
        : null;
    const comparableEntries = [...entries, ...procAssets];
    const findEntryById = (id) => (0, exports.findById)(comparableEntries, id);
    const findDeepEntriesRecursively = (id, language) => {
        const entry = findEntryById(id);
        // Entry may be a DRAFT
        if (!entry)
            return null;
        const entriesKeys = Object.keys(entry.fields);
        return {
            ...entry,
            fields: entriesKeys.reduce((entriesAcc, key) => {
                const fieldItem = entry.fields[key];
                return {
                    ...entriesAcc,
                    [key]: !fieldItem[language].sys && !(0, commons_1.isArray)(fieldItem[language])
                        ? fieldItem
                        : (0, commons_1.isArray)(fieldItem[language])
                            ? fieldItem[language].map((item) => item.sys
                                ? findDeepEntriesRecursively(item.sys.id, language)?.fields
                                : item)
                            : fieldItem[language].sys
                                ? findDeepEntriesRecursively(fieldItem[language].sys.id, language)
                                    .fields
                                : fieldItem[language],
                };
            }, {}),
        };
    };
    const fieldEntryLinkToExactData = (fieldItem, withFields = false, language) => {
        let fieldData = fieldItem;
        if ((0, commons_1.isArrOrObj)(fieldItem)) {
            if ((0, commons_1.isArray)(fieldItem)) {
                fieldData = fieldItem
                    .map((item) => {
                    const { sys } = item;
                    const entry = sys
                        ? findDeepEntriesRecursively(sys.id, language)
                        : item;
                    //May be a DRAFT
                    if (!entry)
                        return null;
                    return withFields && sys ? entry.fields : entry;
                })
                    .filter(Boolean);
            }
            else {
                if (fieldItem.sys) {
                    const entry = findDeepEntriesRecursively(fieldItem.sys.id, language);
                    //May be a DRAFT
                    if (!entry) {
                        fieldData = null;
                    }
                    else {
                        fieldData = withFields ? entry.fields : entry;
                    }
                }
            }
        }
        return fieldData;
    };
    if (comparableEntries) {
        const procEntries = comparableEntries.map(({ fields, ...entry }) => {
            const procFields = Object.keys(fields).reduce((acc, field) => {
                return {
                    ...acc,
                    [field]: locales.reduce((localesAcc, { code }) => {
                        const fieldItem = fields[field][code];
                        return {
                            ...localesAcc,
                            [code]: fieldEntryLinkToExactData(fieldItem, true, code),
                        };
                    }, {}),
                };
            }, {});
            return { ...entry, fields: procFields };
        });
        fs.writeFileSync(__dirname + contentEntriesPath, JSON.stringify(procEntries, null, 2));
    }
}
exports.createEntries = createEntries;
