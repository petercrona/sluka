'use strict';

var _ = require('kling/kling.js');

module.exports = {
    consume: _.curry(consume),
    consumeFirstMatch: _.curry(consumeFirstMatch),
    throwWhitespace: _.curry(throwWhitespace),
    consumeUntilClosed: _.curry(consumeUntilClosed),
    consumeUntil: _.curry(consumeUntil)
};

function consume(string, text) {
    let i = text.indexOf(string);
    if (i === -1) {
        return result(null, text);
    } else {
        const consumed = text.substring(i, i + string.length);
        const rest = text.substring(i + string.length);
        return result(consumed, rest, i);
    }
}

function consumeFirstMatch(stringArray, text) {
    const cConsume = _.curry(consume);
    const matchers = stringArray.map((x) => cConsume(x));
    const results = matchers.map((m) => m(text));
    return results.sort((a,b) => a.offset - b.offset)[0];
}

function throwWhitespace(text) {
    for (var i = 0; i < text.length && isWhitespace(text[i]); i++) {}
    return result(null, text.substring(i), i);
}

function consumeUntilClosed(openTag, closeTag, text) {
    const openTagParse = consume(openTag, text);
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
