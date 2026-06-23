import {AuthUtils} from "./auth-utils.js";
import config from "../config/config.js";

export class HttpUtils {
    static async request(url, method = 'GET', useAuth = true, body = null) {
        const params = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        };

        let token = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        const response = await fetch(config.api + url, params);

        if (response.status < 200 || response.status >= 300) {
            if (useAuth && response.status === 401) {
                // 1 - токена нет
                if (!token) {
                    window.location.hash = '#/login';
                    return null
                } else {
                    // 2 - токен устарел/невалидный (надо обновить)
                    const updateTokenResult = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        // Запрос повторно
                        return this.request(url, method, useAuth, body);
                    } else {
                        window.location.hash = '#/login';
                        return null
                    }
                }

            }
            return null;
        }

        return response.json();
    }
}