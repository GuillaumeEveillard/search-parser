import {BinaryExpression, Expression, Literal, UnaryExpression} from "./Parser";

export class SearchPredicateBuilder {

    static buildPredicate(exp: Expression) : ((s : string[]) => boolean) {

        if(exp instanceof Literal) {
            return (s : string[]) => {
                for (const string of s) {
                    if(string.includes(exp.lit)) {
                        return true;
                    }
                }

                return false;
            };
        }

        if(exp instanceof UnaryExpression) {
            if(exp.tag === "NOT") {
                return (x : string[]) => !this.buildPredicate(exp.exp)(x);
            }
        }

        if(exp instanceof BinaryExpression) {
            if(exp.tag === "AND") {
                return (x : string[]) =>  this.buildPredicate(exp.lhs)(x) && this.buildPredicate(exp.rhs)(x);
            }
            if(exp.tag === "OR") {
                return (x : string[]) =>  this.buildPredicate(exp.lhs)(x) || this.buildPredicate(exp.rhs)(x);
            }
        }

        return (x : string[])=> true;
    }


}

