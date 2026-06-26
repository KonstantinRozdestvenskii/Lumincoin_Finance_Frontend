import config from "../config/config";

export class CommonUtils {
    static getHashParams() {
        const qs = window.location.hash.split('+').join(' ');

        let params = {},
            tokens,
            re = /[?&]([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }

    static getCategoryTypeHtml(type) {
        let typeHtml = null;
        switch (type) {
            case config.categoryType.expense:
                typeHtml = '<span class="text-danger">Расход</span>';
                break;
            case config.categoryType.income:
                typeHtml = '<span class="text-success">Доход</span>';
                break;
            default:
                typeHtml = '';
                break;
        }

        return typeHtml;
    }

    static initCalendar() {
        flatpickr('.date-input', {
            locale: 'ru',           // Русский язык
            dateFormat: 'Y.m.d',    // Формат гггг.мм.дд
            allowInput: false,      // Только через календарь
            position: 'auto',       // Автоматическое позиционирование
            static: false           // Позиционируется относительно input
        });
    }
}