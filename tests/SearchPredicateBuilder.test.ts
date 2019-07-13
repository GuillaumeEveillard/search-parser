import {SearchPredicateBuilder} from "../src/SearchPredicate";
import {BinaryExpression, Literal, UnaryExpression} from "../src/Parser";

it('simple literal', function () {
    let exp = new Literal("A");
    expect(SearchPredicateBuilder.buildPredicate(exp)(["ABC"])).toBeTruthy();
    expect(SearchPredicateBuilder.buildPredicate(exp)(["X", "A", "Z"])).toBeTruthy();
    expect(SearchPredicateBuilder.buildPredicate(exp)(["BCD"])).toBeFalsy();
});

it('not expression', function () {
    let exp = new UnaryExpression("NOT", new Literal("A"));
    expect(SearchPredicateBuilder.buildPredicate(exp)(["BCD"])).toBeTruthy();
    expect(SearchPredicateBuilder.buildPredicate(exp)(["ABC"])).toBeFalsy();
    expect(SearchPredicateBuilder.buildPredicate(exp)(["X", "A", "Z"])).toBeFalsy();
});

it('and expression', function () {
    let exp = new BinaryExpression("AND", new Literal("A"), new Literal("B"));
    expect(SearchPredicateBuilder.buildPredicate(exp)(["ABC"])).toBeTruthy();
    expect(SearchPredicateBuilder.buildPredicate(exp)(["A", "B", "Z"])).toBeTruthy();
    expect(SearchPredicateBuilder.buildPredicate(exp)(["BCD"])).toBeFalsy();
    expect(SearchPredicateBuilder.buildPredicate(exp)(["CD"])).toBeFalsy();
});

it('or expression', function () {
    let exp = new BinaryExpression("OR", new Literal("A"), new Literal("B"));
    expect(SearchPredicateBuilder.buildPredicate(exp)(["ABC"])).toBeTruthy();
    expect(SearchPredicateBuilder.buildPredicate(exp)(["A", "B", "Z"])).toBeTruthy();
    expect(SearchPredicateBuilder.buildPredicate(exp)(["BCD"])).toBeTruthy();
    expect(SearchPredicateBuilder.buildPredicate(exp)(["B", "Z"])).toBeTruthy();
    expect(SearchPredicateBuilder.buildPredicate(exp)(["CD"])).toBeFalsy();
});