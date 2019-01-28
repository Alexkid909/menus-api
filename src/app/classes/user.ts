export class User {
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    password: string;
    constructor(firstName: string, lastName: string, email: string, password: string, username?: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = (!username) ? email : username;
        this.password = password;
    }
}