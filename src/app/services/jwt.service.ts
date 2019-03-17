const crypto = require('crypto');


export class JwtService {

    private btoa(string: string) {
        return Buffer.from(string).toString('base64');
    }

    private sign(string: string, key: string) {
        return crypto.createHmac('sha256', key).update(string).digest('base64');
    }

    encode(payload: any, secret: any) {
        const algorithm = 'HS256';

        const header = {
          type: 'JWT',
          alg: algorithm
        };

        let jwt = `${this.btoa(JSON.stringify(header))}.${this.btoa(JSON.stringify(payload))}`;
        return `${jwt}${this.sign(jwt, secret)}`;
    }
}