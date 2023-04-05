import contentfulExport from "contentful-export";

export async function fetchContentfulSpaceData(options) {
  await contentfulExport(options);
}

//TODO: make dynamic paths
// export function moveAssetsToPublicFolder() {
//   const publicContentfulImagesPath =
//     __dirname + "/public/contentful/images.ctfassets.net";
//   const publicContentfulAssetsPath =
//     __dirname + "/public/contentful/assets.ctfassets.net";
//   const publicContentfulADownloadsPath =
//     __dirname + "/public/contentful/downloads.ctfassets.net";
//   const assetsPaths = [
//     { name: "images", path: publicContentfulImagesPath },
//     {
//       name: "assets",
//       path: publicContentfulAssetsPath,
//     },
//     { name: "downloads", path: publicContentfulADownloadsPath },
//   ];
//   const isPublicContentfulExists = (path) => fs.existsSync(path);
//   const makeDir = (path) => {
//     console.log(path);
//     fs.mkdirSync(path, { recursive: true });
//   };
//   const removeDir = (path) => fs.rmSync(path, { recursive: true, force: true });
//
//   assetsPaths.forEach((asset) => {
//     if (!isPublicContentfulExists) {
//       makeDir(asset.path);
//     } else {
//       removeDir(asset.path);
//       makeDir(asset.path);
//     }
//
//     //TODO: make dynamic path
//     fs.rename(
//       __dirname + `/api/contentful/data/${asset.name}.ctfassets.net`,
//       asset.path,
//       (err) => {
//         if (err) {
//           console.error(`${capitalize(asset.name)}: ${err}`);
//         } else {
//           console.log(
//             "\x1b[32m",
//             `SUCCESS! ${capitalize(
//               asset.name
//             )} moved to public/contentful folder!`
//           );
//         }
//       }
//     );
//   });
// }
