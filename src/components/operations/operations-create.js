export class OperationsCreate {
    constructor() {
        this.initCalendar();
    }

    initCalendar() {
        flatpickr('.date-input', {
            locale: 'ru',           // Русский язык
            dateFormat: 'd.m.Y',    // Формат дд.мм.гггг
            allowInput: false,      // Только через календарь
            position: 'auto',       // Автоматическое позиционирование
            static: false           // Позиционируется относительно input
        });
    }
}