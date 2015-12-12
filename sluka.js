'use strict';

var _ = require('kling/kling.js');

module.exports = {
    consumeAnywhere: _.curry(consumeAnywhere),
    consumeWithRegexp: _.curry(consumeWithRegexp),
    consumeFirstMatch: _.curry(consumeFirstMatch),
    consumeUntilClosed: _.curry(consumeUntilClosed),
    consumeUntil: _.curry(consumeUntil),
    consumeRegexp: _.curry(consumeRegexp),
    throwWhitespace: _.curry(throwWhitespace),
    throwInit: _.curry(throwInit)
};

function consumeAnywhere(string, text) {
    let i = text.indexOf(string);
    return consumeFromIndex(i, string, text);
}

function consumeWithRegexp(string, text) {
    let i = text.search(string);
    return consumeFromIndex(i, string, text);
}

function consumeFromIndex(index, string, text) {
    if (index === -1) {
        return result(null, text);
    } else {
        const consumed = text.substring(index, index + string.length);
        const rest = text.substring(index + string.length);
        return result(consumed, rest, index);
    }
}

function consumeFirstMatch(stringArray, text) {
    const cConsume = _.curry(consumeAnywhere);
    const matchers = stringArray.map((x) => cConsume(x));
    const results = matchers.map((m) => m(text));
    return results.sort(offsetComparator)[0];
}

function offsetComparator(a, b) {
    let aOffset = (a.offset === -1) ? Number.MAX_SAFE_INTEGER : a.offset;
    let bOffset = (b.offset === -1) ? Number.MAX_SAFE_INTEGER : b.offset;;
    return aOffset - bOffset;
}

function throwWhitespace(text) {
    for (var i = 0; i < text.length && isWhitespace(text[i]); i++) {}
    return result(null, text.substring(i), i);
}

function throwInit(string, text) {
    var i = text.indexOf(string);
    if (i === 0) {
        return result(null, text.substring(string.length), string.length);
    } else {
        return result(null, text, -1);
    }
}

function consumeUntilClosed(openTag, closeTag, text) {
    const openTagParse = consumeAnywhere(openTag, text);
    const textRest = openTagParse.rest;

    let nrOpen = 1;
    for (var i = 0; nrOpen > 0 && i < textRest.length; i++) {
        if (textRest[i] === closeTag) {
            nrOpen--;
        } else if (textRest[i] === openTag) {
            nrOpen++;
        }
    }

    const consumed = openTagParse.consumed + textRest.substring(0, i);
    const rest = textRest.substring(i)
    return result(consumed, rest, i)
}

function consumeUntil(string, text) {
    const i = text.indexOf(string);

    if (i === -1) {
        return result(null, text);
    } else {
        const consumed = text.substring(0, i+1);
        const rest = text.substring(i+1);
        return result(consumed, rest, i);
    }
}

function consumeRegexp(regexp, text) {
    var matched = text.match(regexp);

    if (matched === null || matched.index !== 0) {
        return result(null, text);
    } else {
        const consumed = matched[0];
        const rest = text.substring(matched.index + consumed.length);
        return result(consumed, rest, matched.index);
    }
}

function result(consumed, rest, offset) {
    return {
        consumed: consumed,
        rest: rest,
        offset: offset || -1
    };
}

function isWhitespace(character) {
    return character === ' '
        || character === '\t'
        || character === '\n'
        || character === '\r';
}
