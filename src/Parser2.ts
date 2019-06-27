
export default class Parser2 {


    parseOk(tokens: string[]) : Expression{
        let lhs = this.consumeLit(tokens);
        return this.parse_2(tokens, lhs, 0);
    }

    parse_2(tokens: string[], lhs: Expression, minPrecedence: number) : Expression {
        let lookahead = this.lookForOperatorAhead(tokens);
        while (lookahead != null && lookahead.precedence >= minPrecedence) {
            let op = this.consumeOperator(tokens);
            let rhs;
            if(op.tag == "SP") {
                let x = this.consumeLit(tokens);
                lhs = this.parse_2(tokens, x, 0);
                lookahead = this.lookForOperatorAhead(tokens);
            } else if(op.tag == "NOT") {
                let x = this.consumeLit(tokens);
                lhs = new UnaryExpression(op.tag, this.parse_2(tokens, x, op.precedence));
                lookahead = this.lookForOperatorAhead(tokens);
            } else {
                rhs = this.consumeLit(tokens);

                lookahead = this.lookForOperatorAhead(tokens);
                if(lookahead != null) {
                    if (lookahead.tag == "SP") {
                        this.consumeOperator(tokens);
                        let x = this.consumeLit(tokens);
                        rhs = this.parse_2(tokens, x, 0);
                        lookahead = this.lookForOperatorAhead(tokens);
                        //---
                        while (lookahead != null && lookahead.precedence > op.precedence) {
                            rhs = this.parse_2(tokens, rhs, lookahead.precedence);
                            lookahead = this.lookForOperatorAhead(tokens);
                        }
                    } else if (lookahead.tag == "EP") {
                        this.consumeOperator(tokens);
                        return new BinaryExpression(op.tag, lhs, rhs);
                    } else {
                        //---
                        while (lookahead != null && lookahead.precedence > op.precedence) {
                            rhs = this.parse_2(tokens, rhs, lookahead.precedence);
                            lookahead = this.lookForOperatorAhead(tokens);
                        }
                    }
                }
                    lhs = new BinaryExpression(op.tag, lhs, rhs);
            }
        }
        return lhs;
    }

    consumeLit(tokens: string[]) : Expression | null {
        let op = this.parseOperator(tokens[0])
        if(op !== null) {
            return null;
        } else {
            let token = tokens.splice(0, 1)[0];
            return this.parseLit(token);
        }
    }

    parseLit(token: string) : Expression {
        return new Literal(token);
    }

    consumeOperator(tokens: string[]) : Operator | null {
        let token = tokens.splice(0, 1)[0];
        return this.parseOperator(token);
    }

    lookForOperatorAhead(tokens: string[]) : Operator | null {
        for (const token of tokens) {
            let op = this.parseOperator(token);
            if(op !== null) return op;
        }
        return null;
    }

    parseOperator(token: string) : Operator {
        switch (token) {
            case "&&":
                return new Operator("AND", 2);
            case "||":
                return new Operator("OR", 1);
            case "!":
                return new Operator("NOT", 3);
             case "(":
                return new Operator("SP", 4);
            case ")":
                return new Operator("EP", 4);
            default:
                return null;
        }
    }
}

class Operator {
    tag: string;
    precedence: number;

    constructor(tag: string, precedence: number) {
        this.tag = tag;
        this.precedence = precedence;
    }
}

type Expression = BinaryExpression | UnaryExpression | Literal;

export class UnaryExpression {
    tag: string;
    rhs: Expression;

    constructor(tag: string, rhs: Expression) {
        this.tag = tag;
        this.rhs = rhs;
    }
}

export class BinaryExpression {
    tag: string;
    lhs: Expression;
    rhs: Expression;


    constructor(tag: string, lhs: Expression, rhs: Expression) {
        this.tag = tag;
        this.lhs = lhs;
        this.rhs = rhs;
    }
}

export class Literal {
    lit: string;

    constructor(lit: string) {
        this.lit = lit;
    }
}

// type Expression = And | Or | Not | Literal;
//
// interface And {
//     tag: "AND";
//     precedence: 2;
//     lhs: Expression;
//     rhs: Expression;
// }
//
// interface Or {
//     tag: "OR";
//     precedence: 1;
//     lhs: Expression;
//     rhs: Expression;
// }
//
// interface Not {
//     tag: "NOT";
//     precedence: 3;
//     exp: Expression;
// }
//
// interface Literal {
//     tag: "LIT";
//     precedence: 0;
//     s: string;
// }