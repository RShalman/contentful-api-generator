"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const prettier_1 = require("prettier");
const UpperCasedTypeName = (type) => type.name.replace(/\s/gi, "");
function createApi(options) {
    const types = JSON.parse(fs.readFileSync(options.contentTypesJSONPath).toString());
    const entries = JSON.parse(fs.readFileSync(options.contentEntriesJSONPath).toString());
    const hasEntriesOfType = (type) => entries.filter((entry) => entry.sys?.contentType?.sys?.id === type.contentTypeId).length > 0;
    const imports = `
    import { CContentTypes, CContentTypesKeys, CTEntryOfTypes, CTEntry, Asset } from '${options.basePath}/contentTypes';
    import { CTLocales } from '${options.basePath}/locales';
    import locales from '${options.basePath}/locales.json';
    import entries from '${options.basePath}/contentEntries.json';
    import { CTSlugs, CTAssetSlug, ${types.reduce((typesAcc, type, idx) => !hasEntriesOfType(type)
        ? typesAcc
        : typesAcc +
            `CT${UpperCasedTypeName(type)}Slug${idx < types.length - 1 ? ", " : ""}`, "")} } from '${options.basePath}/slugs';
  `;
    const apiEndpoints = `
    export const CTGetLocales = () => locales as Array<Omit<typeof locales[0], 'code'> & { code: CTLocales }>;

    export const CTGetEntryBySlug = <E extends CTEntryOfTypes<typeof entries[0]>, C extends CContentTypesKeys>(
      slug: CTSlugs,
      locale: CTLocales,
      contentType?: C,
    ) =>
      (entries as (E & CTEntry<E, CContentTypes<CTLocales>[C]>)[]).find((entry) => {
        return (contentType ? entry?.sys?.contentType?.sys?.id === contentType : true) && entry?.fields?.slug?.[locale] === slug;
      });
      
    export const CTGetAsset = (slug: CTAssetSlug, locale: CTLocales) =>
      (entries as unknown as CTEntry<{}, Asset<CTLocales>>[]).find((entry) => entry?.fields?.title?.[locale] === slug);
      
    const CTGetAllEntriesByContentType = <E extends CTEntryOfTypes<typeof entries[0]>, C extends CContentTypesKeys>(
      contentType: C,
    ) =>
      (entries as (E & CTEntry<E, CContentTypes<CTLocales>[C]>)[]).filter(
        (entry) => entry?.sys?.contentType?.sys?.id === contentType,
      );
    
    export type IGetEntries = ReturnType<typeof CTGetEntries>;
    ${types.reduce((typesAcc, type) => {
        const UCasedName = UpperCasedTypeName(type);
        return !hasEntriesOfType(type)
            ? typesAcc
            : typesAcc +
                `export type IGet${UCasedName}s = ReturnType<IGetEntries['get${UCasedName}s']>; \n`;
    }, "")}
   
      
    export const CTGetEntries = (locale?: CTLocales) => ({
      ${types.reduce((typesAcc, type) => {
        const typeName = type.contentTypeId;
        const UCasedName = UpperCasedTypeName(type);
        return !hasEntriesOfType(type)
            ? typesAcc
            : typesAcc +
                `get${UCasedName}s: (${typeName}s?: CT${UCasedName}Slug[]) => !${typeName}s
      ? CTGetAllEntriesByContentType('${typeName}')
      : ${typeName}s?.map((${typeName}) => CTGetEntryBySlug(${typeName}, locale ?? null, '${typeName}')), \n`;
    }, "")}
    });
  `;
    const filepath = __dirname + options.apiTSPath;
    const prettified = (0, prettier_1.format)(imports + apiEndpoints, { filepath });
    fs.writeFileSync(filepath, prettified);
}
exports.default = createApi;
