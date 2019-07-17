
class Dept {
    n: number = 0;

    inc() {
        this.n++;
        return this;
    }

    dec() {
        this.n--;
        return this;
    }

    getDept() : number {
        return this.n;
    }
}

export default class Parser {

    static parse(tokens: string[]) : Expression{
        let lhs = Parser.consumeLit(tokens);
        let dept = new Dept();
        let r = Parser.internalParse(tokens, lhs, 0, dept);
        if(dept.getDept() != 0) {
            throw new Error("Expected )");
        }
        return r;
    }



    private static internalParse(tokens: string[], lhs: Expression | null, minPrecedence: number, dept: Dept) : Expression {
        let lookahead = Parser.lookForOperatorAhead(tokens);

        if(lookahead == null && tokens.length !== 0) {
            throw new Error("Operator expected");
        }

        while (lookahead != null && lookahead.precedence >= minPrecedence) {
            let op = Parser.consumeOperator(tokens);
            let rhs;
            if(op.tag == "SP") {
                let x = Parser.consumeLit(tokens);
                lhs = Parser.internalParse(tokens, x, 0, dept.inc());
                lookahead = Parser.lookForOperatorAhead(tokens);
            } else if(op.tag == "NOT") {
                let x = Parser.consumeLit(tokens);
                lhs = new UnaryExpression(op.tag, this.internalParse(tokens, x, op.precedence, dept));
                lookahead = Parser.lookForOperatorAhead(tokens);
            } else if (op.tag == "EP") {
                if(dept.getDept() <= 0) {
                    throw new Error("unexpected )");
                }
                dept.dec();
                if(lhs == null) {
                    throw new Error("lhs cannot be null");
                }
                return lhs;
            } else {
                rhs = Parser.consumeLit(tokens);

                lookahead = Parser.lookForOperatorAhead(tokens);
                if(lookahead != null) {
                    if (lookahead.tag == "SP") {
                        Parser.consumeOperator(tokens);
                        let x = Parser.consumeLit(tokens);
                        rhs = Parser.internalParse(tokens, x, 0, dept.inc());
                        lookahead = Parser.lookForOperatorAhead(tokens);
                        //---
                        while (lookahead != null && lookahead.precedence > op.precedence) {
                            rhs = Parser.internalParse(tokens, rhs, lookahead.precedence, dept);
                            lookahead = Parser.lookForOperatorAhead(tokens);
                        }
                    } else if (lookahead.tag == "EP") {
                        if(dept.getDept() <= 0) {
                            throw new Error("unexpected )");
                        }
                        dept.dec();
                        Parser.consumeOperator(tokens);
                        if(lhs == null) {
                            throw new Error("lhs cannot be null");
                        }
                        if(rhs == null) {
                            throw new Error("rhs cannot be null");
                        }
                        return new BinaryExpression(op.tag, lhs, rhs);
                    } else {
                        //---
                        while (lookahead != null && lookahead.precedence > op.precedence) {
                            rhs = Parser.internalParse(tokens, rhs, lookahead.precedence, dept);
                            lookahead = Parser.lookForOperatorAhead(tokens);
                        }
                    }
                }
                if(lhs == null) {
                    throw new Error("lhs cannot be null");
                }
                if(rhs == null) {
                    throw new Error("rhs cannot be null");
                }
                lhs = new BinaryExpression(op.tag, lhs, rhs);
            }
        }
        if(lhs == null) {
            throw new Error("lhs cannot be null");
        }

        return lhs;
    }

    private static consumeLit(tokens: string[]) : Expression | null {
        if(tokens.length === 0) {
            return null;
        }

        let op = Parser.parseOperator(tokens[0]);
        if(op !== null) {
            return null;
        } else {
            let token = tokens.splice(0, 1)[0];
            return Parser.parseLit(token);
        }
    }

    private static parseLit(token: string) : Expression {
        return new Literal(token);
    }

    private static consumeOperator(tokens: string[]) : Operator  {
        let token = tokens.splice(0, 1)[0];
        let op = Parser.parseOperator(token);
        if(op == null) {
            throw new Error("op cannot be null");
        }
        return op;
    }

    private static lookForOperatorAhead(tokens: string[]) : Operator | null {
        for (const token of tokens) {
            let op = Parser.parseOperator(token);
            if(op !== null) return op;
        }
        return null;
    }

    private static parseOperator(token: string) : Operator | null {
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
                return new Operator("EP", 0);
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

export type Expression = BinaryExpression | UnaryExpression | Literal;

export class UnaryExpression {
    tag: string;
    exp: Expression;

    constructor(tag: string, exp: Expression) {
        this.tag = tag;
        this.exp = exp;
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
