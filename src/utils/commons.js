module.exports = {
    capitalize: function (s) {
        return s && (s[0].toUpperCase() + s.slice(1))
    },
    isArray: function (obj) {
        return Array.isArray(obj)
    },
    isObject: function (obj) {
        typeof obj === 'object' && !this.isArray(obj) && obj !== null
    }.bind(this),
    isArrOrObj: function (obj) {
        return this.isArray(obj) || this.isObject(obj)
    }.bind(this)
}