import Parser from "../src/Parser";


describe('simple parsing', function () {
    it('does not match', function () {
        expect(Parser.parse("xx")("xyz")).toBe(false)
    });
    it('exact match', function () {
        expect(Parser.parse("hello")("hello")).toBe(true)
    });
    it('match', function () {
        expect(Parser.parse("hello")("hmm, hello you?")).toBe(true)
    });
    // it('match with space', function () {
    //     expect(Parser.parse("hello you")("hmm, hello you?")).toBe(true)
    // });
});

describe('and parsing', function () {
    it('match both', function () {
        expect(Parser.parse("hello && world")("hmm, hello, world!")).toBe(true)
    });
    it('match only one', function () {
        expect(Parser.parse("hello && world")("hello guys!")).toBe(false)
    });
});

describe('or parsing', function () {
    it('match both', function () {
        expect(Parser.parse("hello || world")("hmm, hello, world!")).toBe(true)
    });
    it('match only first', function () {
        expect(Parser.parse("hello || world")("hello guys!")).toBe(true)
    });
    it('match only second', function () {
        expect(Parser.parse("hello || world")("my world")).toBe(true)
    });
    it('match none', function () {
        expect(Parser.parse("hello || world")("something else")).toBe(false)
    });
});

describe('not parsing', function () {
    it('match not', function () {
        expect(Parser.parse("! hello")("hmm, hello, world!")).toBe(false)
    });
    it('does not match', function () {
        expect(Parser.parse("! hello")("something else")).toBe(true)
    });
});

describe('quote parsing', function () {
    it('match', function () {
        expect(Parser.parse("\"hello && world\"")("hello && world")).toBe(true)
    });
    it('does not match', function () {
        expect(Parser.parse("\"hello && world\"")("hello world")).toBe(false)
    })
});

describe('priority from left to right', function () {
    it('and then or', function () {
        expect(Parser.parse("aaa && bbb || ccc")("aaa bbb")).toBe(true);
        expect(Parser.parse("aaa && bbb || ccc")("aaa ccc")).toBe(true);
        expect(Parser.parse("aaa && bbb || ccc")("aaa")).toBe(false);
        expect(Parser.parse("aaa && bbb || ccc")("ccc bbb")).toBe(false);
    });
    it('or then and', function () {
        expect(Parser.parse("aaa || bbb && ccc")("aaa")).toBe(true);
        expect(Parser.parse("aaa || bbb && ccc")("ccc bbb")).toBe(true);
        expect(Parser.parse("aaa || bbb && ccc")("bbb")).toBe(false);
        expect(Parser.parse("aaa || bbb && ccc")("ccc")).toBe(false);
    });
});

describe('complex', function () {
   it('multiple and', function () {
       expect(Parser.parse("aaa && bbb && ccc")("ccc aaa bbb")).toBe(true);
       expect(Parser.parse("aaa && bbb && ccc")("aaa bbb")).toBe(false);
       expect(Parser.parse("aaa && bbb && ccc")("ccc aaa")).toBe(false);
       expect(Parser.parse("aaa && bbb && ccc")("ccc bbb")).toBe(false);
   });
    it('multiple or', function () {
        expect(Parser.parse("aaa || bbb || ccc")("aaa")).toBe(true);
        expect(Parser.parse("aaa || bbb || ccc")("bbb")).toBe(true);
        expect(Parser.parse("aaa || bbb || ccc")("ccc")).toBe(true);
    });
    it('big one', function () {
        let pattern = "Maurice || you && \"hello world\" && ! idiot";
        expect(Parser.parse(pattern)("Salut Maurice")).toBe(true);
        expect(Parser.parse(pattern)("Hello you, hello world")).toBe(true);
        expect(Parser.parse(pattern)("hello world")).toBe(false);
        expect(Parser.parse(pattern)("hello you, hello world, hello idiot")).toBe(false);
    })
});

describe('tokenizer', function () {
    it('tokens are separated by space', function () {
        expect(Parser.token("aaa bbb ccc")).toStrictEqual(["aaa", "bbb", "ccc"]);
    });
    it('double quoted strings are unique token', function () {
        expect(Parser.token("aaa \"bbb ccc\"")).toStrictEqual(["aaa", "bbb ccc"]);
    });
});