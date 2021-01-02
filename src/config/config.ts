export class Config {
    [key: string]: string;
    constructor() {

        const snakeToCamel = (str: string) => str.replace(/([-_]\w)/g, g => g[1].toUpperCase())

        const _regex = new RegExp('^MEALS_');
        const configKeys: Array<string> = Object.keys(process.env).filter((key: string) => _regex.test(key));
        configKeys.forEach((key:string) => {
            const newKey = snakeToCamel(key.replace(_regex,'').toLowerCase());
            this[newKey] = process.env[key];
        });
    }
}
