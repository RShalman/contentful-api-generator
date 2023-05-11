declare module "utils/commons" {
    export function capitalize(s: any): any;
    export function isArray(obj: any): boolean;
    export function isObject(obj: any): void;
    export function isArrOrObj(obj: any): true | void;
}
declare module "generators/import-contentful-data" {
    import { CAGOptions } from "../../types";
    export function fetchContentfulSpaceData(options: any): Promise<void>;
    export function moveAssetsToPublicFolder(options: CAGOptions): void;
}
declare module "generators/create-entries" {
    import { CAGOptions } from "../../types";
    export const findById: (arr: any, id: any) => any;
    export function createEntries(basePath: CAGOptions["basePath"]): void;
}
declare module "generators/create-models-and-types" {
    import { CAGOptions } from "../../types";
    export function createTypesModels(basePath: CAGOptions["basePath"]): void;
    export function createTypesTS(basePath: CAGOptions["basePath"]): void;
}
declare module "generators/create-slugs-types" {
    import { CAGOptions } from "../../types";
    export function createSlugsTypes(basePath: CAGOptions["basePath"]): void;
}
declare module "generators/create-api" {
    import { CAGOptions } from "../../types";
    export default function createApi(options: CAGOptions): void;
}
declare module "generators/generate-contentful-api" {
    import { CAGOptions } from "../../types";
    export default function generateContentfulApi(args: CAGOptions): Promise<void>;
}
declare module "index" {
    export * from "generators/import-contentful-data";
    export * as default from "generators/generate-contentful-api";
}
//# sourceMappingURL=index.d.ts.map