const bcrypt = require('bcrypt');

export class User {
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    hashedPassword: string;
    token?: string;
    constructor(firstName: string, lastName: string, email: string, hashedPassword: string, username?: string, token?: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = (!username) ? email : username;
        this.hashedPassword = hashedPassword;
        this.token = token;
    }
}