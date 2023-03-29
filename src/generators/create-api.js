const fs = require('fs');
const prettier = require('prettier');

//TODO: add custom basePath
const basePath = '/api/contentful';
const contentEntriesPath = `${basePath}/contentEntries.json`;
const contentTypesPath = `${basePath}/contentTypes.json`;
// TODO: add custom file naming
const apiTSPath = `${basePath}/api.ts`;

const UCasedTypeName = (type) => type.name.replace(/\s/gi, '');

module.exports = function createApi() {
    const types = JSON.parse(fs.readFileSync(__dirname + contentTypesPath));
    const entries = JSON.parse(fs.readFileSync(__dirname + contentEntriesPath));

    const hasEntriesOfType = (type) => entries.filter((entry) => entry.sys?.contentType?.sys?.id === type.contentTypeId).length > 0;

    //TODO: add dynamic routes to imports
    const imports = `
    import { CContentTypes, CContentTypesKeys, CTEntryOfTypes, CTEntry, Asset } from '@api/contentful/contentTypes';
    import { CTLocales } from '@api/contentful/locales';
    import locales from '@api/contentful/locales.json';
    import entries from '@api/contentful/contentEntries.json';
    import { CTSlugs, CTAssetSlug, ${types.reduce(
        (typesAcc, type, idx) => !hasEntriesOfType(type) ? typesAcc : typesAcc + `CT${UCasedTypeName(type)}Slug${idx < types.length - 1 ? ', ' : ''}`,
        '',
    )} } from '@api/contentful/slugs';
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
        const UCasedName = UCasedTypeName(type);
        return (
            !hasEntriesOfType(type) ? typesAcc : typesAcc + `export type IGet${UCasedName}s = ReturnType<IGetEntries['get${UCasedName}s']>; \n`
        );
    }, '')}
   
      
    export const CTGetEntries = (locale?: CTLocales) => ({
      ${types.reduce((typesAcc, type) => {
        const typeName = type.contentTypeId;
        const UCasedName = UCasedTypeName(type);
        return (
            !hasEntriesOfType(type) ? typesAcc : typesAcc +
                `get${UCasedName}s: (${typeName}s?: CT${UCasedName}Slug[]) => !${typeName}s
      ? CTGetAllEntriesByContentType('${typeName}')
      : ${typeName}s?.map((${typeName}) => CTGetEntryBySlug(${typeName}, locale ?? null, '${typeName}')), \n`
        );
    }, '')}
    });
  `;

    const filepath = __dirname + apiTSPath;
    const prettified = prettier.format(imports + apiEndpoints, {filepath});

    fs.writeFileSync(filepath, prettified);
}
