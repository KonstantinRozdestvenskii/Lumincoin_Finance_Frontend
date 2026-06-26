import {HttpUtils} from "../../../utils/http-utils";

export class CategoriesExpenseCreate {
    constructor() {
        this.nameInputElement = document.getElementById("name");
        document.getElementById("create").addEventListener("click", this.createCategory.bind(this));
        document.getElementById("cancel").addEventListener("click", e => {
            e.preventDefault();
            return window.location.href = '#/categories/expense';
        });
    }

    validateForm() {
        let isValid = true;

        if (this.nameInputElement.value) {
            this.nameInputElement.classList.remove('is-invalid');
        }
        else {
            this.nameInputElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async createCategory(e) {
        e.preventDefault();
        if (this.validateForm()) {
            const result = await HttpUtils.request('/categories/expense', 'POST', true, {
                title: this.nameInputElement.value,
            })

            if (!result || (result && result.error)) {
                return alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку');
            }

            return window.location.hash = '#/categories/expense';
        }
    }
}