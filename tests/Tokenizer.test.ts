import {Tokenizer} from "../src/Tokenizer";

describe('tokenize valid strings', function () {
    it('tokens are separated by space', function () {
        expect(Tokenizer.token("a b c")).toStrictEqual(["a", "b", "c"])
    });
    it('multiple spaces are ignored', function () {
        expect(Tokenizer.token("a     b")).toStrictEqual(["a", "b"])
    });
    it('multiple spaces are ignored', function () {
        expect(Tokenizer.token("a     b")).toStrictEqual(["a", "b"])
    });
    it('double quote can be used to create token with space', function () {
        expect(Tokenizer.token("\"token 1\" \"token 2\" z")).toStrictEqual(["token 1", "token 2", "z"])
    });
});