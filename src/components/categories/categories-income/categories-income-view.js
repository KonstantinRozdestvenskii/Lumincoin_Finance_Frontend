import {HttpUtils} from "../../../utils/http-utils.js";

export class CategoriesIncomeView {
    constructor() {
        this.getCategories().then();
    }

    async getCategories() {
        const result = await HttpUtils.request('/categories/income');

        if (!result) {
            return alert('Возникла ошибка при запросе фрилансеров. Обратитесь в поддержку');
        }

        this.showCards(result);

    }

    showCards(categoriesList) {

    }
}