export function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
}
export function isArray(obj) {
    return Array.isArray(obj);
}
export function isObject(obj) {
    typeof obj === "object" && !isArray(obj) && obj !== null;
}
export function isArrOrObj(obj) {
    return isArray(obj) || isObject(obj);
}
