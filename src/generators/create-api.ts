import fs from "node:fs";
import prettier from "prettier";
import { CAGOptions } from "../../types";

const UpperCasedTypeName = (type) => type.name.replace(/\s/gi, "");

export default function createApi(options: CAGOptions) {
  const types = JSON.parse(
    fs.readFileSync(__dirname + options.contentTypesJSONPath).toString()
  );
  const entries = JSON.parse(
    fs.readFileSync(__dirname + options.contentEntriesJSONPath).toString()
  );

  const hasEntriesOfType = (type) =>
    entries.filter(
      (entry) => entry.sys?.contentType?.sys?.id === type.contentTypeId
    ).length > 0;

  //TODO: add dynamic routes to imports
  const imports = `
    import { CContentTypes, CContentTypesKeys, CTEntryOfTypes, CTEntry, Asset } from '@api/contentful/contentTypes';
    import { CTLocales } from '@api/contentful/locales';
    import locales from '@api/contentful/locales.json';
    import entries from '@api/contentful/contentEntries.json';
    import { CTSlugs, CTAssetSlug, ${types.reduce(
      (typesAcc, type, idx) =>
        !hasEntriesOfType(type)
          ? typesAcc
          : typesAcc +
            `CT${UpperCasedTypeName(type)}Slug${
              idx < types.length - 1 ? ", " : ""
            }`,
      ""
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
  const prettified = prettier.format(imports + apiEndpoints, { filepath });

  fs.writeFileSync(filepath, prettified);
}
