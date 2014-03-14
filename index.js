module.exports = function (argv, opts) {
    opts || (opts = {})

    var usage    = opts.usage || 'no usage'; delete opts.usage
    var required = opts.required || [];      delete opts.required
    var validate = opts.validate || {};      delete opts.validate

    if (typeIs(required, 'Object')) {
        required = Object.keys(required).map(function (key) { return key })
    }

    if (! opts.alias) opts.alias = {}
    opts.alias.u = 'usage'

    var args = require('minimist')(argv, opts)

    if (args.usage) return console.log(usage)

    if (required) {
        for (var i = 0, len = required.length; i < len; i++) {
            var key = required[i]

            if ('_' === key && ! args._.length) {
                throw new TypeError('"_" does not have data')
            }

            else if (!(key in args)) {
                var mes = 'argument "' + key + '" is required'
                throw new TypeError(mes)
            }
        }
    }

    if (validate) {
        for (var prop in validate) {
            var valid = validate[prop]

            if (typeIs(valid, 'RegExp')) valid = wrapValid(valid)
            if (typeIs(valid, 'Function'))
                args[prop] = valid(args[prop], args)
        }
    }

    return args

    function typeIs (w, type) {
        return Object.prototype.toString.apply(w) === '[object ' + type + ']'
    }

    function wrapValid (valid) {
        return function (val) {
            if (! valid.test(val)) {
                throw new TypeError(
                  '"' + valid.toString() + '" test failed')
            }
            return val
        }
    }
}
