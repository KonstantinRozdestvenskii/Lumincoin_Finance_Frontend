import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";

export class Login {
    constructor(openNewRoute) {

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            window.location.href = '/#'
        }


        this.emailElement = document.getElementById("email");
        this.passwordElement = document.getElementById("password");
        this.rememberMeElement = document.getElementById("remember-me");
        this.commonErrorElement = document.getElementById("common-error");

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));

    }

    validateForm() {

        let isValid = true;

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async login() {

        this.commonErrorElement.classList.add('d-none');

        if (this.validateForm()) {
            // request

            const result = await HttpUtils.request('/login', 'POST', false, {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked
            })

            if (result.error || !result.tokens || (result.tokens && (!result.tokens.accessToken || !result.tokens.refreshToken))
                || !result.user || (result.user && (!result.user.name || !result.user.lastName || !result.user.id))) {
                this.commonErrorElement.classList.remove('d-none');
                return;
            }

            AuthUtils.setAuthInfo(result.tokens.accessToken, result.tokens.refreshToken, {
                id: result.user.id,
                name: result.user.name + ' ' + result.user.lastName
            });

            window.location.hash = '#/';
        }
    }
}