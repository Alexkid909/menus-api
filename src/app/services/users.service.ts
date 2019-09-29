import {Collection, ObjectID} from "mongodb";
import { User } from "../classes/user";
import {AuthService} from "./auth.service";
import {JwtService} from "./jwt.service";



export class UsersService {
    usersCollection: Collection;
    authService: AuthService;
    jwtService: JwtService;


    constructor(db: any) {
        this.usersCollection = db.collection('users');
        this.usersCollection.createIndex({ 'email': 1, 'userName': 1 },{ unique: true, sparse: true });
        this.authService = new AuthService(db);
        this.jwtService = new JwtService();
    }

    getAllUsers() {
        return this.usersCollection.find({}).toArray()
    }

    getUserByName(userName: string) {
        return this.usersCollection.findOne({'userName' : userName});
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

    getUserIdFromAuth(auth: string) {
        const token = auth.split(' ')[1];
        // @ts-ignore
        return this.jwtService.decode(token, global.config.secret).sub;
    }

}