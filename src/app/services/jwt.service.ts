const crypto = require('crypto');

export class JwtService {

    private static base64encode(string: string) {
        return Buffer.from(string).toString('base64');
    }

    private static base64decode(string: string) {
        return Buffer.from(string, 'base64').toString();
    }

    private static sign(string: string, key: string) {
        return crypto.createHmac('sha256', key).update(string).digest('base64');
    }

    private static verifySignature(raw: string, secret: string, signature: string) {
        return signature === JwtService.sign(raw, secret);
    }

    static encode(payload: any, secret: string) {
        const algorithm = 'HS256';

        const header = {
            type: 'JWT',
            alg: algorithm
        };

        let jwt = `${JwtService.base64encode(JSON.stringify(header))}.${JwtService.base64encode(JSON.stringify(payload))}`;

        return `${jwt}.${JwtService.sign(jwt, secret)}`;
    }

    static decode(token: string, secret: string) {
        const tokenSegments = token.split('.');
        if(tokenSegments.length !== 3) { throw new Error("Token structure incorrect")}

        const header = JSON.parse(JwtService.base64decode(tokenSegments[0]));
        const payload = JSON.parse(JwtService.base64decode(tokenSegments[1]));
        const rawSignature = `${tokenSegments[0]}.${tokenSegments[1]}`;

        if(!JwtService.verifySignature(rawSignature, global.config.secret, tokenSegments[2])) {
            throw new Error("Verification failed");
        }

        return payload;
    }

}
