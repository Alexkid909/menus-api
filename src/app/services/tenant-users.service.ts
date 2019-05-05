import { Collection, ObjectID } from "mongodb";
import { DatabaseError } from "../classes/internalErrors/databaseError";
import { JwtService } from "./jwt.service";
import { CustomRequest } from "../classes/request/customRequest";


export class TenantUsersService {
    tenantUsersCollection: Collection;

    constructor(db: any) {
        this.tenantUsersCollection = db.collection('tenantUsers');
    }

    getTenantUsers(tenantId: string) {
        return this.tenantUsersCollection.find({'tenantId': new ObjectID(tenantId)}).toArray()
    }

    getUserTenants(userId: string) {
        const query = { userId: new ObjectID(userId) };
        return this.tenantUsersCollection.find(query).toArray();
    }

    hasTenantAccess(req: CustomRequest) {
        const tenantId = req.headers['tenant-id'];
        const jwtService = new JwtService();
        // @ts-ignore
        const userId = jwtService.decode(req.headers.authorization, global.config.secret).sub;
        const query = { userId: new ObjectID(userId), tenantId: new ObjectID(tenantId) };
        return this.tenantUsersCollection.find(query).toArray().then((success: any) => {
            if(success.length > 0) {
                return Promise.resolve('User has access')
            }
            const errorData = {userId, tenantId};
            return Promise.reject(new DatabaseError('No tenant access', ['This user does not have access to this tenant'], errorData));
        });
    }

}