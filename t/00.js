var test = require('tape')
var fire = require(resolve('..'))

test('load', function (t) {
    t.ok(fire, 'exists fire')
    t.end()
})

//    var res0 = fire(['--foo', 'bar'])
//
//    t.deepEqual(res0, {
//        _: []
//      , foo: 'bar'
//    }, JSON.stringify(res0))
//
//    var res1 = fire(['--foo', 'bar'], {
//        default: {
//            hoge: 'hage'
//        }
//    })
//
//    t.deepEqual(res1, {
//        _: []
//      , foo: 'bar'
//      , hoge: 'hage'
//    }, JSON.stringify(res1))
//
//    var res2 = fire(['--foo', 'bar'], {
//        default: {
//            hoge: ['ha', 'ge']
//        }
//    })
//
//    t.deepEqual(res2, {
//        _: []
//      , foo: 'bar'
//      , hoge: ['ha', 'ge']
//    }, JSON.stringify(res2))

test('validate', function (t) {
    var validateFoo = function (v, args) {
        if (! /bar/.test(v)) {
            throw new TypeError('"foo" must include "bar"')
        }
        return '"' + v + '"'
    }

    var res3 = fire(['--foo', 'bar'], {
        default: {
            hoge: 'hage'
        }
      , validate: {
            foo: validateFoo
        }
    })

    t.deepEqual(res3, {
        _: []
      , foo: '"bar"'
      , hoge: 'hage'
    }, JSON.stringify(res3))


    t.throws(function () {
        fire(['--foo', 'baa'], {
            validate: {foo: validateFoo}
        })
    }, /"foo" must include "bar"/, 'throw TypeError')


    var validateArgs = function (vals, args) {
        for (var i = 0, len = vals.length; i < len; i++) {
            if (vals[i] === 'hoge')
                throw new TypeError('can not use "hoge"')
        }
        return vals
    }


    var res4 = fire(['--foo', 'bar', 'pop', 'up'], {
        validate: {_: validateArgs}
    })

    t.deepEqual(res4, {
        foo: 'bar',
        _: ['pop', 'up']
    }, JSON.stringify(res4))

    t.throws(function () {
        var res = fire(['--foo', 'bar', 'hage', 'hoge', 'boke'], {
            validate: {_: validateArgs}
        })
    }, /hoge/, 'throw TypeError')


    var res5 = fire(['--foo', 'bar'], {
        validate: { foo: /^bar$/ }
    })

    t.deepEqual(res5, {
        foo: 'bar', _: []
    }, JSON.stringify(res5))

    t.throws(function () {
        var res = fire(['--foo', 'baa'], {
            validate: {foo: /^bar$/ }
        })
    }, /test failed/, 'throw TypeError')

    t.end()
})

//test('use usage', function (t) {
//    t.equal(fire(['--usage']), 'no usage')
//    t.end()
//})

test('required', function (t) {
	var res = fire(['--foo', 'bar'], {
		required: {
			foo: true
		}
	})

	t.deepEqual(res, {_: [], foo: 'bar'}, JSON.stringify(res))

	t.throws(function () {
		fire([], {
			required: ['foo']
		})
	}, /argument "foo" is required/, 'throw TypeError')

	t.throws(function () {
		fire([], {
			required: ['_']
		})
	}, /"_" does not have data/, 'throw TypeError')

	t.end()
})

function resolve (p) { return require('path').join(__dirname, p) }
