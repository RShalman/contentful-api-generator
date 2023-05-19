"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrOrObj = exports.isObject = exports.isArray = exports.capitalize = void 0;
function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
}
exports.capitalize = capitalize;
function isArray(obj) {
    return Array.isArray(obj);
}
exports.isArray = isArray;
function isObject(obj) {
    typeof obj === "object" && !isArray(obj) && obj !== null;
}
exports.isObject = isObject;
function isArrOrObj(obj) {
    return isArray(obj) || isObject(obj);
}
exports.isArrOrObj = isArrOrObj;
