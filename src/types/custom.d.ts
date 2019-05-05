interface EnvConfig {
    name: string;
    dbUrl: string;
    secret: string;
}

interface Config {
    dev: EnvConfig
    prod: EnvConfig
}

declare module NodeJS  {
    interface Global {
        config: any
    }
}