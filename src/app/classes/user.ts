const bcrypt = require('bcrypt');

export class User {
    firstName: string;
    lastName: string;
    email: string;
    userName?: string;
    hashedPassword: string;
    constructor(firstName: string, lastName: string, email: string, hashedPassword: string, userName?: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userName = (!userName) ? email : userName;
        this.hashedPassword = hashedPassword;
    }
}