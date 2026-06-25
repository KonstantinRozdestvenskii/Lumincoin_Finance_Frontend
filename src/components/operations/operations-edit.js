import {CommonUtils} from "../../utils/common-utils.js";
import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";

export class OperationsEdit {
    constructor() {
        this.typeSelectElement = document.getElementById("type");
        this.categorySelectElement = document.getElementById('category');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('date');
        this.commentInputElement = document.getElementById('comment');

        const id = CommonUtils.getHashParams().id;

        if (!id) {
            window.location.hash = '#/operations';
        }

        document.getElementById('save').addEventListener("click", e => {
            e.preventDefault();
            this.editOperation().then();
        });

        document.getElementById('cancel').addEventListener("click", e => {
            e.preventDefault();
            window.location.hash = '#/operations';
        });

        CommonUtils.initCalendar();

        this.getOperation(id).then();
    }

    async getOperation(id) {
        const result = await HttpUtils.request('/operations/' + id);

        if (!result || (result && result.error)) {
            return alert('Возникла ошибка при запросе операции. Обратитесь в поддержку');
        }

        this.originalOperation = result;
        this.getCategories(this.originalOperation.type).then();

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

        this.typeSelectElement.disabled = true;

        while (this.categorySelectElement.firstChild) {
            this.categorySelectElement.removeChild(this.categorySelectElement.firstChild);
        }

        for (const category of this.categories) {
            const option = document.createElement("option");
            option.innerText = category.title;
            option.value = category.id;
            if (category.title === this.originalOperation.category) {
                option.selected = true;
            }
            this.categorySelectElement.appendChild(option);
        }

        this.amountInputElement.value = this.originalOperation.amount;
        this.dateInputElement.value = this.originalOperation.date;
        this.commentInputElement.value = this.originalOperation.comment;

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

    async editOperation() {
        if (this.validateForm()) {

            const result = await HttpUtils.request('/operations/' + this.originalOperation.id, 'PUT', true, {
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