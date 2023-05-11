import * as fs from "fs";
import { format } from "prettier";
import { CAGOptions } from "../../types";

export function createSlugsTypes(basePath: CAGOptions["basePath"]) {
  const contentEntriesPath = `${basePath}/contentEntries.json`;
  const contentTypesPath = `${basePath}/contentTypes.json`;
  const slugsTSPath = `${basePath}/slugs.ts`;

  const locales = JSON.parse(
    fs.readFileSync(basePath + "/locales.json").toString()
  );
  const entries = JSON.parse(fs.readFileSync(contentEntriesPath).toString());
  const types = JSON.parse(
    fs.readFileSync(__dirname + contentTypesPath).toString()
  );
  const defaultLocale = locales[0].code;

  const slugsTypes = `
        export type CTSlugs = ${entries.reduce((acc, cur, idx) => {
          return !cur.fields.slug
            ? acc
            : acc +
                `${idx > 0 ? " | " : ""}'${
                  cur.fields.slug?.[defaultLocale] ??
                  cur.fields.title?.[defaultLocale]
                    ?.toLowerCase()
                    ?.replaceAll(/\'/gi, "")
                    ?.split(" ")
                    .join("-")
                }'`;
        }, "")}
    `;

  const slugsByTypes = `${types.reduce((typesAcc, type) => {
    const filteredEntries = entries.filter(
      (entry) => entry.sys?.contentType?.sys?.id === type.contentTypeId
    );
    return (
      typesAcc +
      `\n\nexport type CT${type.name.replace(/\s/gi, "")}Slug = ${
        filteredEntries.length === 0
          ? `''`
          : filteredEntries.reduce((entriesAcc, entry, idx) => {
              try {
                return (
                  entriesAcc +
                  `${idx > 0 ? " | " : ""}'${entry.fields.slug[defaultLocale]}'`
                );
              } catch (e) {
                console.error("ERR WHILE SLUG TYPES GEN:", e, {
                  entry: JSON.stringify(entry, null, 2),
                  idx,
                });
              }
            }, "")
      };`
    );
  }, ``)}`;

  const slugsForAssets = () => {
    const assetsEntries = entries.filter(
      (entry) => entry.sys?.type === "Asset"
    );

    return `\n\nexport type CTAssetSlug = ${
      assetsEntries.length === 0
        ? `''`
        : `${assetsEntries.reduce((assetsAcc, asset, idx) => {
            return (
              assetsAcc +
              `${idx > 0 ? " | " : ""}"${asset.fields.title[defaultLocale]}"`
            );
          }, ``)}`
    };`;
  };

  const filepath = __dirname + slugsTSPath;
  const prettified = format(slugsTypes + slugsByTypes + slugsForAssets(), {
    filepath,
  });

  fs.writeFileSync(filepath, prettified);
}
