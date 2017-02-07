import { UserManager } from '../../management/users/user-manager';

export class PermissionValidator {
    private userManager: UserManager;

    constructor(userManager: UserManager) {
        this.userManager = userManager;
    }

    checkPermission(userName: string, requiredPermission: number) {
        let userData = this.userManager.getUserData(userName);
        return userData.permission >= requiredPermission;
    }
}