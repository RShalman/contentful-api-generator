import * as fs from "fs";
import { isArray, isArrOrObj } from "../utils/commons.js";
export const findById = (arr, id) => arr.find((el) => el.sys.id === id) ?? null;
export function createEntries(basePath) {
    const exportFilePath = `${basePath}/data/contentful-export.json`;
    const contentEntriesPath = `${basePath}/contentEntries.json`;
    const { entries, assets } = JSON.parse(fs.readFileSync(exportFilePath).toString()) ?? {};
    const locales = JSON.parse(fs.readFileSync(basePath + "/locales.json").toString());
    const procAssets = assets
        ? JSON.parse(JSON.stringify(assets).replaceAll(/\/\/images/gi, "images"))
        : null;
    const comparableEntries = [...entries, ...procAssets];
    const findEntryById = (id) => findById(comparableEntries, id);
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
                    [key]: !fieldItem[language].sys && !isArray(fieldItem[language])
                        ? fieldItem
                        : isArray(fieldItem[language])
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
        if (isArrOrObj(fieldItem)) {
            if (isArray(fieldItem)) {
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
