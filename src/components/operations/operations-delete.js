import {CommonUtils} from "../../utils/common-utils";
import {HttpUtils} from "../../utils/http-utils";

export class OperationsDelete {
    constructor() {

        const urlParams = CommonUtils.getHashParams();

        const id = urlParams.id;

        if (!id) {
            return window.location.hash = '#/operations';
        }

        this.deleteOperations(id).then();

    }

    async deleteOperations(id) {
        const result = await HttpUtils.request('/operations/' + id, 'DELETE', true);

        if (!result || (result && result.error)) {
            return alert('Возникла ошибка при удалении операции. Обратитесь в поддержку');
        }

        return window.location.hash = '#/operations';
    }
}