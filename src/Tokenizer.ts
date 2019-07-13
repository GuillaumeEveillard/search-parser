export class Tokenizer {

    static token(text: string) : string[] {
        let splitByQuote = text.split("\"");
        return splitByQuote
            .flatMap((v, i) => i % 2 == 0 ? v.split(" ") : [v])
            .map(x => x.trim())
            .filter(x => x.length != 0);
    }
    
}