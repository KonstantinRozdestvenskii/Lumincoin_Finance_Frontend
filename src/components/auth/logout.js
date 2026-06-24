import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";

export class Logout {
    constructor() {

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            window.location.hash = '#/login';
            return
        }

        this.logout().then();

    }

    async logout() {

        await HttpUtils.request('/logout', 'POST', false, {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        });

        AuthUtils.removeAuthInfo();

        window.location.hash = '#/login';
    }
}