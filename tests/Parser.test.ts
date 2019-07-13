import Parser, {BinaryExpression, Literal, UnaryExpression} from "../src/Parser";


describe('simple parsing', function () {
    it('A && B', function () {
        expect(Parser.parse(["A", "&&", "B"]))
            .toStrictEqual(new BinaryExpression("AND", new Literal("A"), new Literal("B")))
    });
    it('A && B && C', function () {
        expect(Parser.parse(["A", "&&", "B", "&&", "C"]))
            .toStrictEqual(
                new BinaryExpression("AND",
                    new BinaryExpression("AND", new Literal("A"), new Literal("B")),
                    new Literal("C")));
    });
    it('A || B', function () {
        expect(Parser.parse(["A", "||", "B"]))
            .toStrictEqual(new BinaryExpression("OR", new Literal("A"), new Literal("B")))
    });
    it('A || B && C || D', function () {
        expect(Parser.parse(["A", "||", "B", "&&", "C", "||", "D"]))
            .toStrictEqual(
                new BinaryExpression("OR",
                    new BinaryExpression("OR",
                        new Literal("A"),
                        new BinaryExpression("AND", new Literal("B"), new Literal("C"))),
                new Literal("D")))
    });
    it('A && B || C && D', function () {
        expect(Parser.parse(["A", "&&", "B", "||", "C", "&&", "D"]))
            .toStrictEqual(
                new BinaryExpression("OR",
                    new BinaryExpression("AND", new Literal("A"), new Literal("B")),
                    new BinaryExpression("AND", new Literal("C"), new Literal("D"))))
    });
    it('A && ( B || C )', function () {
        expect(Parser.parse(["A", "&&", "(", "B", "||", "C", ")"]))
            .toStrictEqual(
                new BinaryExpression("AND",
                    new Literal("A"),
                    new BinaryExpression("OR", new Literal("B"), new Literal("C"))))
    });

    it('A || ( B || C ) && D )', function () {
        expect(Parser.parse(["A", "||", "(", "B", "||", "C", ")", "&&", "D"]))
            .toStrictEqual(
                new BinaryExpression("OR",
                    new Literal("A"),
                    new BinaryExpression("AND",
                        new BinaryExpression("OR", new Literal("B"), new Literal("C")),
                        new Literal("D"))));

    });

    it('( A || B ) && C ', function () {
        expect(Parser.parse(["(", "A", "||", "B", ")", "&&", "C"]))
            .toStrictEqual(
                new BinaryExpression("AND",
                    new BinaryExpression("OR", new Literal("A"), new Literal("B")),
                    new Literal("C")));

    });

    it('( B || C )', function () {
        expect(Parser.parse(["(", "B", "||", "C", ")"]))
            .toStrictEqual(
                new BinaryExpression("OR", new Literal("B"), new Literal("C")));

    });

    it('B || ( C )', function () {
        expect(Parser.parse(["B", "||", "(", "C", ")"]))
            .toStrictEqual(
                new BinaryExpression("OR", new Literal("B"), new Literal("C")));

    });

    it(' !A', function() {
        expect(Parser.parse(["!", "A"]))
            .toStrictEqual(
                new UnaryExpression("NOT", new Literal("A")));
    });

    it(' A && ! B', function() {
        expect(Parser.parse(["A", "&&", "!", "B"]))
            .toStrictEqual(
                new BinaryExpression(
                    "AND",
                    new Literal("A"),
                    new UnaryExpression("NOT", new Literal("B"))));
    });

    it('( A && ! B )', function() {
        expect(Parser.parse(["(", "A", "&&", "!", "B", ")"]))
            .toStrictEqual(
                new BinaryExpression(
                    "AND",
                    new Literal("A"),
                    new UnaryExpression("NOT", new Literal("B"))));
    });

    it('! A && B', function() {
        expect(Parser.parse(["!", "A", "&&", "B"]))
            .toStrictEqual(
                new BinaryExpression(
                    "AND",
                    new UnaryExpression("NOT", new Literal("A")),
                    new Literal("B")));
    });

    it('! ( A && B )', function() {
        expect(Parser.parse(["!", "(", "A", "&&", "B", ")"]))
            .toStrictEqual(
                new UnaryExpression("NOT",
                new BinaryExpression(
                    "AND",
                    new Literal("A"),
                    new Literal("B"))));
    });

    it('( A || ! B ) && C ', function () {
        expect(Parser.parse(["(", "A", "||", "!", "B", ")", "&&", "C"]))
            .toStrictEqual(
                new BinaryExpression("AND",
                    new BinaryExpression("OR",
                        new Literal("A"),
                        new UnaryExpression("NOT", new Literal("B"))),
                    new Literal("C")));

    });

    it('! ( A && ! B ) && C', function() {
        expect(Parser.parse(["!", "(", "A", "&&", "!", "B", ")", "&&", "C"]))
            .toStrictEqual(
                new BinaryExpression("AND",
                    new UnaryExpression("NOT",
                        new BinaryExpression(
                            "AND",
                            new Literal("A"),
                            new UnaryExpression("NOT", new Literal("B")))),
                    new Literal("C")));
    });


    it('A || ! ( B && ! C ) && ! ( D )', function() {
        expect(Parser.parse(["A", "||", "!", "(", "B", "&&", "!", "C", ")", "&&", "!", "(", "D", ")"]))
            .toStrictEqual(
                new BinaryExpression("OR",
                    new Literal("A"),
                    new BinaryExpression("AND",
                        new UnaryExpression("NOT",
                            new BinaryExpression("AND",
                                new Literal("B"),
                                new UnaryExpression("NOT", new Literal("C")))),
                        new UnaryExpression("NOT", new Literal("D")))));
    });

    it('A && ((B || C) && D)', function () {
        expect(Parser.parse(["A", "&&", "(", "(", "B", "||", "C", ")", "&&", "D", ")"]))
            .toStrictEqual(
                new BinaryExpression("AND",
                    new Literal("A"),
                    new BinaryExpression("AND",
                        new BinaryExpression("OR",
                            new Literal("B"),
                            new Literal("C")),
                        new Literal("D"))));
    });
});