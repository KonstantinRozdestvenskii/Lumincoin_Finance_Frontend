import {CommonUtils} from "../../../utils/common-utils";
import {HttpUtils} from "../../../utils/http-utils";

export class CategoriesExpenseDelete {
    constructor() {

        const urlParams = CommonUtils.getHashParams();

        const id = urlParams.id;

        if (!id) {
            return window.location.hash = '#/categories/expense';
        }

        this.deleteCategory(id).then();

    }

    async deleteCategory(id) {
        const result = await HttpUtils.request('/categories/expense/' + id, 'DELETE', true);

        if (!result || (result && result.error)) {
            return alert('Возникла ошибка при удалении категории. Обратитесь в поддержку');
        }

        return window.location.hash = '#/categories/expense';
    }
}