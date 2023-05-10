declare module "generators/create-api" {
    import { CAGOptions } from "../../types";
    export default function createApi(options: CAGOptions): void;
}
declare module "utils/commons" {
    export function capitalize(s: any): any;
    export function isArray(obj: any): boolean;
    export function isObject(obj: any): void;
    export function isArrOrObj(obj: any): true | void;
}
declare module "generators/create-entries" {
    export const findById: (arr: any, id: any) => any;
    export function createEntries(): void;
}
declare module "generators/create-models-and-types" {
    export function createTypesModels(): void;
    export function createTypesTS(): void;
}
declare module "generators/create-slugs-types" {
    export function createSlugsTypes(): void;
}
declare module "generators/generate-contentful-api" { }
declare module "generators/import-contentful-data" {
    export function fetchContentfulSpaceData(options: any): Promise<void>;
}
declare module "generators/index" {
    import { CAGOptions } from "../../types";
    export default function generateContentfulApi(args: CAGOptions): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map