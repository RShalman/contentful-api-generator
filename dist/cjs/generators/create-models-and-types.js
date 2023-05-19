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
exports.createTypesTS = exports.createTypesModels = void 0;
const fs = __importStar(require("fs"));
const prettier_1 = require("prettier");
const commons_js_1 = require("../utils/commons.js");
const create_entries_js_1 = require("./create-entries.js");
const onError = (err) => {
    throw new Error(`Seems like file is empty or doesnt exist: ${err}`);
};
function typeAdapter(fieldName, type, field) {
    const arrOfItems = field.arrayTypeItems
        ? field?.arrayTypeItems?.reduce((acc, cur, i, arr) => acc +
            (cur === "string"
                ? cur
                : `CContentTypes<L>['${cur}']${i !== arr.length - 1 ? " | " : ""}\n`), "")
        : false;
    const arrOfValidationTypes = field.validationTypes
        ? field?.validationTypes?.reduce((acc, cur, i, arr) => acc +
            (cur === "string"
                ? cur
                : `CContentTypes<L>['${cur}']${i !== arr.length - 1 ? " | " : ""}\n`), "")
        : false;
    return ({
        Array: arrOfItems ? `Array<${arrOfItems}>` : type,
        Link: field.linkType === "Entry"
            ? arrOfValidationTypes || `CT${(0, commons_js_1.capitalize)(fieldName)}<L>`
            : `${field.linkType}<L>`,
        Integer: "number",
    }[type] ?? type);
}
function typeTemplate(name, fields) {
    return `
      export type CT${name.split(" ").join("")}<L extends CTLocales> = {
        ${Object.keys(fields).reduce((typeAcc, typeCur) => {
        const field = fields[typeCur];
        const withAsset = field.linkType === "Asset"
            ? typeAdapter(typeCur, field.type, field)
            : `Record<L, ${typeAdapter(typeCur, field.type, field)}>`;
        return (typeAcc + `${typeCur}${field.required ? "" : "?"}: ${withAsset};`);
    }, "")}
          }

          \n
          `;
}
function typesReferenceType(typesModel) {
    return `
      export type CContentTypesKeys = keyof CContentTypes<CTLocales>\n
      export type CContentTypes<L extends CTLocales> = {${typesModel.reduce((acc, cur) => acc + `${cur.contentTypeId}: CT${cur.name.split(" ").join("")}<L>;`, ``)}}
      
      \n
    `;
}
function createTypesModels(basePath) {
    const exportFilePath = `${basePath}/data/contentful-export.json`;
    const typesModelPath = `${basePath}/contentTypes.json`;
    const localesModelPath = `${basePath}/locales.json`;
    const localesTSPath = `${basePath}/locales.ts`;
    const contentfulExportFile = JSON.parse(fs.readFileSync(exportFilePath).toString());
    const { contentTypes, locales } = contentfulExportFile ?? {};
    if (locales) {
        const procLocales = locales.map(({ name, code }) => ({ name, code }));
        const localesToTS = `export type CTLocales = ${procLocales.reduce((acc, cur, idx) => acc + (idx === 0 ? `'${cur.code}'` : ` | '${cur.code}'`), "")}`;
        fs.writeFileSync(__dirname + localesModelPath, JSON.stringify(procLocales, null, 2));
        fs.writeFileSync(__dirname + localesTSPath, localesToTS);
    }
    else {
        onError("No locales provided");
    }
    if (contentTypes) {
        const procContentTypes = contentTypes.map(({ sys, name, fields }) => ({
            contentTypeId: sys.id,
            name,
            fields: fields
                .filter((f) => !f.disabled)
                .reduce((acc, { id, type, linkType, required, items, validations }) => {
                return {
                    ...acc,
                    [id]: {
                        type: type === "Symbol" ? "string" : type,
                        required,
                        linkType,
                        validationTypes: (0, create_entries_js_1.findById)(contentTypes, id) !== null
                            ? false
                            : validations?.[0]?.linkContentType,
                        arrayTypeItems: (type === "Array" &&
                            items.validations?.[0]?.linkContentType) ?? [
                            items?.type === "Symbol" ? "string" : items?.type,
                        ],
                    },
                };
            }, {}),
        }));
        fs.writeFileSync(__dirname + typesModelPath, JSON.stringify(procContentTypes, null, 2));
    }
    else {
        onError("No content types provided");
    }
}
exports.createTypesModels = createTypesModels;
function createTypesTS(basePath) {
    const typesModelPath = `${basePath}/contentTypes.json`;
    const typesTSPath = `${basePath}/contentTypes.ts`;
    const typesModel = JSON.parse(fs.readFileSync(__dirname + typesModelPath).toString());
    if (typesModel) {
        const notification = `// WARNING! Bear in mind this file is automatically generated.\n // DO NOT make any changes manually\n\n`;
        const imports = `import { EntryFields, Sys } from 'contentful';
                     import RichText = EntryFields.RichText;
                     import Link = EntryFields.Link;
                     import { CTLocales } from '@api/contentful/locales';
                     \n`;
        const entryType = `
          export type CTEntryOfTypes<E> = CTEntry<E, CContentTypes<CTLocales>[CContentTypesKeys]>;
          export type CTEntry<E, F> = Omit<E, 'fields'> & { metadata: Record<string, unknown>, fields: F, sys: Sys };\n
    `;
        const assetType = `
      export type Asset<L extends CTLocales> =  {
        title: Record<L, string>
        description: Record<L, string>
        file: Record<L, {
          url: string,
          details: {
            size: number,
            image: {
              width: number,
              height: number
            }
          },
          fileName: string,
          contentType: string
        }>
      }
    `;
        const contentTypes = `${typesModel.reduce((acc, typeObj) => {
            const { name, fields } = typeObj;
            const type = typeTemplate(name, fields);
            return acc + type;
        }, "")}`;
        const filepath = __dirname + typesTSPath;
        const validContent = (0, prettier_1.format)(notification +
            imports +
            assetType +
            entryType +
            typesReferenceType(typesModel) +
            contentTypes, { filepath });
        fs.writeFileSync(filepath, validContent);
    }
    else {
        onError("No model types provided");
    }
}
exports.createTypesTS = createTypesTS;
