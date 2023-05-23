import contentfulExport from "contentful-export";
import { capitalize } from "../utils/commons.js";
import * as fs from "fs";
import { CAGOptions } from "@/types/typings";

export async function fetchContentfulSpaceData(options) {
  await contentfulExport(options);
}

export function moveAssetsToPublicFolder(options: CAGOptions) {
  const assetsPath = options.assetsPath ?? options.basePath;
  const assetsPaths = [
    { name: "images", path: `${assetsPath}/images.ctfassets.net` },
    {
      name: "assets",
      path: `${assetsPath}/assets.ctfassets.net`,
    },
    { name: "downloads", path: `${assetsPath}/downloads.ctfassets.net` },
  ];
  const isPublicContentfulExists = (path) => fs.existsSync(path);
  const makeDir = (path) => {
    console.log(path);
    fs.mkdirSync(path, { recursive: true });
  };
  const removeDir = (path) => fs.rmSync(path, { recursive: true, force: true });

  assetsPaths.forEach((asset) => {
    if (!isPublicContentfulExists) {
      makeDir(asset.path);
    } else {
      removeDir(asset.path);
      makeDir(asset.path);
    }

    fs.rename(
      __dirname + `${options.basePath}/data/${asset.name}.ctfassets.net`,
      asset.path,
      (err) => {
        if (err) {
          console.error(`${capitalize(asset.name)}: ${err}`);
        } else {
          console.log(
            "\x1b[32m",
            `SUCCESS! ${capitalize(
              asset.name
            )} moved to public/contentful folder!`
          );
        }
      }
    );
  });
}
