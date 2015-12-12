'use strict';

var assert = require('assert');
var sluka = require('./sluka');

describe('Sluka', function() {
    describe('consumeAnywhere', function () {
        it('Shall consume string if string exist in text', function () {
            var result = sluka.consumeAnywhere('Foobar', getTestData());
            assert.equal(result.consumed, 'Foobar');
        });
        it('Shall return null if string does not exist', function () {
            var result = sluka.consumeAnywhere('gfsa', getTestData());
            assert.equal(result.consumed, null);
        });
    });

    describe('consumeFirstMatchAnywhere', function () {
        it('Shall consume the string first occuring first in text', function () {
            var result = sluka.consumeFirstMatchAnywhere(['Foobar', 'class'], getTestData());
            assert.equal(result.consumed, 'class');
        });
        it('Shall consume the string first occuring first in text (order)', function () {
            var result = sluka.consumeFirstMatchAnywhere(['class', 'Foobar'], getTestData());
            assert.equal(result.consumed, 'class');
        });
        it('Shall consume the string first occuring first in text (3 strings)', function () {
            var result = sluka.consumeFirstMatchAnywhere(['class', 'aFoobar', 'fdsa'], getTestData());
            assert.equal(result.consumed, 'class');
        });
        it('Shall return null if string does not exist', function () {
            var result = sluka.consumeFirstMatchAnywhere(['gfsa','fdsafdas'], getTestData());
            assert.equal(result.consumed, null);
        });
    });

    describe('throwWhitespace', function () {
        it('Shall put everything from the first non whitespace in rest', function () {
            var result = sluka.throwWhitespace(' \n\t     Flora');
            assert.equal(result.rest.substring(0, 5), 'Flora');
        });
        it('Shall throw all whitespace until non whitespace', function () {
            var result = sluka.throwWhitespace(' \n\t     Flora');
            assert.equal(result.result, null);
        });
    });

    describe('consumeUntilClosed', function () {
        it('Shall consume everything from first open tag until end tag', function () {
            var result = sluka.consumeUntilClosed('(', ')', getTestData());
            assert.equal(result.consumed, '(method={HEAD, GET}, value = "foobar")');
        });
        it('Shall correctly match open and end tag', function () {
            var resultMapping = sluka.consumeUntilClosed('(', ')', getTestData());
            var result = sluka.consumeUntilClosed('{', '}', resultMapping.consumed);
            assert.equal(result.consumed, '{HEAD, GET}');
        });
    });

    describe('consumeUntil', function () {
        it('Shall consume everything until and including string', function () {
            var result = sluka.consumeUntil('{', getTestData());
            assert.equal(result.consumed.trim(), 'class Foobar {');
        });
        it('Shall consume nothing if string does not exist', function () {
            var result = sluka.consumeUntil('fdsa', getTestData());
            assert.equal(result.consumed, null);
        });
        it('Shall return everything as rest if string does not exist', function () {
            var result = sluka.consumeUntil('fdsa', getTestData());
            assert.equal(result.rest, getTestData());
        });
    });
});

function getTestData() {
    return `
    class Foobar {

        @RequestMapping(method={HEAD, GET}, value = "foobar")
        public List<String> getNames() {

        }

        @RequestMapping(
            method={HEAD, GET},
            value = "foobar")
        public Map<String, Int> getValues() {

        }

    }

    public class Fisk {

    }
    `;
}
