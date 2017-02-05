import { UserManager } from '../../management/users/user-manager';

export class PermissionValidator {
    private userManager: UserManager;

    constructor(userManager: UserManager) {
        this.userManager = userManager;
    }

    checkPermission(userName: string, requiredPermission: number) {
        let user = this.userManager.getUser(userName);

        return user.data.permission >= requiredPermission;
    }
}