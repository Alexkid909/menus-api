const configData = require('./config.json');

export class Config {
    private _env: string;
    private _data: any;
    constructor(env: string) {
        this._env = env;
        this._data = configData[this._env];
        global.config = this._data;
    }
}