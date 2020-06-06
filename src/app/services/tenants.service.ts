import { Collection, ObjectID } from "mongodb";
import { UsersService } from "./users.service";
import { TenantUsersService } from "./tenant-users.service";

export class TenantsService {
    tenantsCollection: Collection;
    tenantUsersCollection: Collection;
    usersService: UsersService;
    tenantUsersService: TenantUsersService;

    constructor(db: any) {
        this.tenantsCollection = db.collection('tenants');
        this.tenantUsersCollection = db.collection('tenantUsers');
        this.usersService = new UsersService(db);
        this.tenantUsersService = new TenantUsersService(db);
    }

    getTenants(tenantIds: Array<ObjectID>) {
        const query = { _id: { $in: tenantIds } };
        return this.tenantsCollection.find(query).toArray();
    }

    getTenant(tenantId: string) {
        return this.tenantsCollection.findOne({'_id' : new ObjectID(tenantId)});
    }
}
