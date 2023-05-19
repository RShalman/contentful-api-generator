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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveAssetsToPublicFolder = exports.fetchContentfulSpaceData = void 0;
const contentful_export_1 = __importDefault(require("contentful-export"));
const commons_1 = require("../utils/commons");
const fs = __importStar(require("fs"));
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
