import {CommonUtils} from "../../utils/common-utils.js";
import config from "../../config/config.js";
import {HttpUtils} from "../../utils/http-utils.js";

export class OperationsCreate {
    constructor() {
        this.typeSelectElement = document.getElementById("type");
        this.categorySelectElement = document.getElementById('category');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('date');
        this.commentInputElement = document.getElementById('comment');

        let target = CommonUtils.getHashParams().target;

        if (!target) {
            window.location.hash = '#/operations';
        }

        document.getElementById('create').addEventListener("click", e => {
            e.preventDefault();
            this.createOperation().then();
        });

        document.getElementById('cancel').addEventListener("click", e => {
            e.preventDefault();
            window.location.hash = '#/operations';
        });

        this.typeSelectElement.addEventListener("change", e => {
            target = e.target.value;
            this.getCategories(target).then();
        })

        CommonUtils.initCalendar();

        this.getCategories(target).then();
    }



    async getCategories(target) {
        let url = null;
        switch (target) {
            case config.categoryType.income:
                url = '/categories/income';
                break;
            case config.categoryType.expense:
                url = '/categories/expense';
                break;
            default:
                break;
        }

        if (url) {
            const result = await HttpUtils.request(url);

            if (!result || (result && result.error)) {
                return alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку');
            }

            this.categories = result;
            this.showForm(target);
        }
    }

    showForm(target) {
        switch (target) {
            case config.categoryType.income:
                this.typeSelectElement.value = config.categoryType.income;
                break;
            case config.categoryType.expense:
                this.typeSelectElement.value = config.categoryType.expense;
                break;
            default:
                break;
        }

        while (this.categorySelectElement.firstChild) {
            this.categorySelectElement.removeChild(this.categorySelectElement.firstChild);
        }

        for (const category of this.categories) {
            const option = document.createElement("option");
            option.innerText = category.title;
            option.value = category.id;
            this.categorySelectElement.appendChild(option);
        }

    }

    validateForm() {
        let isValid = true;

        if (this.amountInputElement.value) {
            this.amountInputElement.classList.remove('is-invalid');
        }
        else {
            this.amountInputElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.dateInputElement.value) {
            this.dateInputElement.classList.remove('is-invalid');
        }
        else {
            this.dateInputElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.commentInputElement.value) {
            this.commentInputElement.classList.remove('is-invalid');
        }
        else {
            this.commentInputElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async createOperation() {
        if (this.validateForm()) {
            const result = await HttpUtils.request('/operations', 'POST', true, {
                type: this.typeSelectElement.value,
                amount: this.amountInputElement.value,
                date: this.dateInputElement.value,
                comment: this.commentInputElement.value,
                category_id: parseInt(this.categorySelectElement.value)
            })

            if (!result || (result && result.error)) {
                return alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку');
            }

            return window.location.hash = '#/operations';
        }
    }
}