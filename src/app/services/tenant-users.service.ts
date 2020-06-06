import { Collection, ObjectID } from "mongodb";
import { DatabaseError } from "../classes/internalErrors/databaseError";
import { JwtService } from "./jwt.service";
import { CustomRequest } from "../classes/request/customRequest";
import {TenantUserLink} from "../classes/joins/tenantUserLink";
import { KeyValuePair } from "./cache.service";
import emitter from "./events.service";
import { EventEmitter } from "events";

export class TenantUsersService {
    tenantUsersCollection: Collection;
    emitter: EventEmitter;

    constructor(db: any) {
        this.tenantUsersCollection = db.collection('tenantUsers');
        this.emitter = emitter;
    }

    getTenantUsers(tenantId: string) {
        return this.tenantUsersCollection.find({'tenantId': new ObjectID(tenantId)}).toArray()
    }

    getUserTenants(userId: string) {
        const query = { userId: new ObjectID(userId) };
        return this.tenantUsersCollection.find(query).toArray();
    }

    userHasTenantAccess(req: CustomRequest) {
        const tenantId = req.headers['tenant-id'];
        // @ts-ignore
        const userId = JwtService.decode(req.headers.authorization.replace('Bearer ', ''), global.config.secret).sub;
        const query = { userId: new ObjectID(userId), tenantId: new ObjectID(tenantId) };
        return this.tenantUsersCollection.find(query).toArray().then((success: any) => {
            if(success.length > 0) {
                return Promise.resolve('User has access')
            }
            const errorData = {userId, tenantId};
            return Promise.reject(new DatabaseError('No tenant access', ['This user does not have access to this tenant'], errorData));
        });
    }

    addUserToTenant(userId: string, tenantId: string) {
        const tenantUser = new TenantUserLink(new ObjectID(userId), new ObjectID(tenantId));
        const cachePrefix = new KeyValuePair('user', userId);
        this.emitter.emit('user-routes:bust-route', '/user/tenants', [cachePrefix]);
        return this.tenantUsersCollection.insert(tenantUser)
    }

    removeUserFromTenant(userId: string, tenantId: string) {
        const tenantUser = new TenantUserLink(new ObjectID(userId), new ObjectID(tenantId));
        const cachePrefix = new KeyValuePair('user', userId);
        this.emitter.emit('user-routes:bust-route', '/user/tenants', [cachePrefix]);
        return this.tenantUsersCollection.findOneAndDelete(tenantUser)
    }
}
