import {CommonUtils} from "../../../utils/common-utils.js";
import {HttpUtils} from "../../../utils/http-utils.js";

export class CategoriesIncomeDelete {
    constructor() {

        const urlParams = CommonUtils.getHashParams();

        const id = urlParams.id;

        if (!id) {
            return window.location.hash = '#/categories/income';
        }

        this.deleteCategory(id).then();

    }

    async deleteCategory(id) {
        const result = await HttpUtils.request('/categories/income/' + id, 'DELETE', true);

        if (!result) {
            return alert('Возникла ошибка при удалении категории. Обратитесь в поддержку');
        }

        if (result.error) {
            return alert('Возникла ошибка при удалении категории. Обратитесь в поддержку');
        }

        return window.location.hash = '#/categories/income';
    }
}