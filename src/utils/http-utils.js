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
                params.headers['authorization'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response;
        try {
            response = await fetch(config.api + url, params);
        } catch (e) {
            // Сетевая ошибка
            return null;
        }

        // Успех (2xx)
        if (response.status >= 200 && response.status < 300) {
            return await response.json();
        }

        // Ошибка авторизации (401)
        if (response.status === 401 && useAuth) {
            if (!token) {
                // 1. Токена нет — сразу на логин
                window.location.hash = '#/login';
                return null;
            }

            // 2. Токен устарел — пробуем обновить
            const updateTokenResult = await AuthUtils.updateRefreshToken();
            if (updateTokenResult) {
                // Повторяем запрос с новым токеном
                return this.request(url, method, useAuth, body);
            } else {
                // Не удалось обновить — на логин
                window.location.hash = '#/login';
                return null;
            }
        }

        // Другие ошибки (400, 403, 500 и т.д.)
        return null;
    }
}