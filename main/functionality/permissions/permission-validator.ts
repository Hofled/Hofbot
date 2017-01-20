import { UserManager } from '../../management/users/user-manager';

export class PermissionValidator {
    private userManager: UserManager;

    constructor(userManager: UserManager) {
        this.userManager = userManager;
    }

    checkPermission(userName: string, channelName: string, requiredPermission: number) {
        let users = this.userManager.getLatestUsers(channelName);
        let user = this.userManager.getUser(userName, users);

        return user.data.permission >= requiredPermission;
    }
}