import {HttpUtils} from "../../../utils/http-utils";
import {CommonUtils} from "../../../utils/common-utils";

export class CategoriesIncomeEdit {
    constructor() {

        const urlParams = CommonUtils.getHashParams();

        const id = urlParams.id;

        if (!id) {
            return window.location.hash = '#/categories/income';
        }

        this.nameInputElement = document.getElementById("name");
        document.getElementById("save").addEventListener("click", this.saveIncomeCategory.bind(this));
        document.getElementById("cancel").addEventListener("click", e => {
            e.preventDefault();
            window.location.hash = '#/categories/income';
        });

        this.getCategory(id).then();

    }

    async getCategory(id) {
        const result = await HttpUtils.request('/categories/income/' + id);

        if (!result) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }

        if (result.error) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }

        this.nameInputElement.value = result.title;
        this.originalCategory = result
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

    async saveIncomeCategory(e) {
        e.preventDefault();
        if (this.validateForm()) {

            if (this.originalCategory.title !== this.nameInputElement.value) {
                const result = await HttpUtils.request('/categories/income/' + this.originalCategory.id, 'PUT', true, {
                    title: this.nameInputElement.value,
                })

                if (!result) {
                    return alert('Возникла ошибка при изменении категории. Обратитесь в поддержку');
                }

                if (result.error) {
                    return alert('Возникла ошибка при изменении категории. Обратитесь в поддержку');
                }
            }
            return window.location.hash = '#/categories/income';
        }



    }
}