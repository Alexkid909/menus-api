import {Collection, ObjectID} from "mongodb";
import { User } from "../classes/user";
import {AuthService} from "./auth.service";
import {JwtService} from "./jwt.service";



export class UsersService {
    usersCollection: Collection;
    authService: AuthService;


    constructor(db: any) {
        this.usersCollection = db.collection('users');
        this.usersCollection.createIndex({ 'email': 1, 'username': 1 },{ unique: true, sparse: true });
        this.authService = new AuthService(db);

    }

    getAllUsers() {
        return this.usersCollection.find({}).toArray()
    }

    getUserByName(username: string) {
        return this.usersCollection.findOne({'username' : username});
    }

    getUserByEmail(email: string) {
        return this.usersCollection.findOne({'email' : email});
    }

    getUserById(id: ObjectID) {
        return this.usersCollection.findOne({'_id': id});
    }

    createUser(user: User) {
        return this.usersCollection.insert(user);
    }

}