"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveAssetsToPublicFolder = exports.fetchContentfulSpaceData = void 0;
const contentful_export_1 = require("contentful-export");
const commons_1 = require("../utils/commons");
const fs = require("fs");
async function fetchContentfulSpaceData(options) {
    await (0, contentful_export_1.default)(options);
}
exports.fetchContentfulSpaceData = fetchContentfulSpaceData;
function moveAssetsToPublicFolder(options) {
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
        }
        else {
            removeDir(asset.path);
            makeDir(asset.path);
        }
        fs.rename(__dirname + `${options.basePath}/data/${asset.name}.ctfassets.net`, asset.path, (err) => {
            if (err) {
                console.error(`${(0, commons_1.capitalize)(asset.name)}: ${err}`);
            }
            else {
                console.log("\x1b[32m", `SUCCESS! ${(0, commons_1.capitalize)(asset.name)} moved to public/contentful folder!`);
            }
        });
    });
}
exports.moveAssetsToPublicFolder = moveAssetsToPublicFolder;
