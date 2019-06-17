import Parser2, {BinaryExpression, Literal} from "../src/Parser2";


describe('simple parsing', function () {
    it('A && B', function () {
        expect(new Parser2().parseOk(["A", "&&", "B"]))
            .toStrictEqual(new BinaryExpression("AND", new Literal("A"), new Literal("B")))
    });
    it('A || B', function () {
        expect(new Parser2().parseOk(["A", "||", "B"]))
            .toStrictEqual(new BinaryExpression("OR", new Literal("A"), new Literal("B")))
    });
    it('A || B && C || D', function () {
        expect(new Parser2().parseOk(["A", "||", "B", "&&", "C", "||", "D"]))
            .toStrictEqual(
                new BinaryExpression("OR",
                    new BinaryExpression("OR",
                        new Literal("A"),
                        new BinaryExpression("AND", new Literal("B"), new Literal("C"))),
                new Literal("D")))
    });
    it('A && B || C && D', function () {
        expect(new Parser2().parseOk(["A", "&&", "B", "||", "C", "&&", "D"]))
            .toStrictEqual(
                new BinaryExpression("OR",
                    new BinaryExpression("AND", new Literal("A"), new Literal("B")),
                    new BinaryExpression("AND", new Literal("C"), new Literal("D"))))
    });
    // it('A && ( B || C )', function () {
    //     expect(new Parser2().parseOk(["A", "&&", "(", "B", "||", "C", ")"]))
    //         .toStrictEqual(
    //             new BinaryExpression("AND",
    //                 new Literal("A"),
    //                 new BinaryExpression("||", new Literal("B"), new Literal("C"))))
    // });
});