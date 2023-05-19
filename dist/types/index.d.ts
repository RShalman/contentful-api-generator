declare module "utils/commons" {
    export function capitalize(s: any): any;
    export function isArray(obj: any): boolean;
    export function isObject(obj: any): void;
    export function isArrOrObj(obj: any): true | void;
}
declare module "runners/import-contentful-data" {
    import { CAGOptions } from "@/types/typings";
    export function fetchContentfulSpaceData(options: any): Promise<void>;
    export function moveAssetsToPublicFolder(options: CAGOptions): void;
}
declare module "generators/create-entries" {
    import { CAGOptions } from "@/types/typings";
    export const findById: (arr: any, id: any) => any;
    export function createEntries(basePath: CAGOptions["basePath"]): void;
}
declare module "generators/create-models-and-types" {
    import { CAGOptions } from "@/types/typings";
    export function createTypesModels(basePath: CAGOptions["basePath"]): void;
    export function createTypesTS(basePath: CAGOptions["basePath"]): void;
}
declare module "generators/create-slugs-types" {
    import { CAGOptions } from "@/types/typings";
    export function createSlugsTypes(basePath: CAGOptions["basePath"]): void;
}
declare module "generators/create-api" {
    import { CAGOptions } from "@/types/typings";
    export default function createApi(options: CAGOptions): void;
}
declare module "runners/generate-contentful-api" {
    import { CAGOptions } from "@/types/typings";
    export function generateContentfulApi(args: CAGOptions): Promise<void>;
}
declare module "index" {
    import { generateContentfulApi } from "runners/generate-contentful-api";
    import { fetchContentfulSpaceData, moveAssetsToPublicFolder } from "runners/import-contentful-data";
    export { generateContentfulApi, fetchContentfulSpaceData, moveAssetsToPublicFolder, };
}
