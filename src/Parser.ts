export default class Parser {
    static parse(pattern: string) : (x :string) => boolean {
      let tokens = this.token(pattern);
      let p = Parser.build(tokens);
      return p;
    }


    static token(text: string) : string[] {
        let splitByQuote = text.split("\"");
        return splitByQuote
            .flatMap((v, i) => i % 2 == 0 ? v.split(" ") : [v])
            .map(x => x.trim())
            .filter(x => x.length != 0);
    }

    static build(tokens: string[]) : (x :string) => boolean {
        if(tokens.length == 0) {
            throw "Expected token";
        } else if(tokens.length == 1) {
            let string1 = tokens[0];
            return x => x.includes(string1);
        } else {
            let t0 = tokens[0];
            if(t0 == "!") {
                tokens.splice(0,1);
                let exp = this.build(tokens);
                return x => !exp(x);
            } else {
                let lhs = x => x.includes(t0);
                let operator = tokens[1];
                tokens.splice(0, 2);
                let rhs = this.build(tokens);
                switch (operator) {
                    case "&&":
                        return x => lhs(x) && rhs(x);
                    case "||":
                        return x => lhs(x) || rhs(x);
                    default:
                        throw "Unsupported operator " + operator;

                }
            }
        }
    }
}