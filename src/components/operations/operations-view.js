import {HttpUtils} from "../../utils/http-utils.js";
import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";


export class OperationsView {
    constructor() {
        this.dateFromInputElements = document.getElementById('dateFrom');
        this.dateToInputElements = document.getElementById('dateTo');
        this.filterButtonElements = document.querySelectorAll('.form .btn');
        this.tableBodyElement = document.getElementById('table-body');
        this.filterParams = {
            period: 'all'
        };
        for (const button of this.filterButtonElements) {
            button.addEventListener('click', e => {
                this.dateToInputElements.value = '';
                this.dateFromInputElements.value = '';
                e.preventDefault();

                // Снимаем active со всех кнопок фильтра
                for (const btn of this.filterButtonElements) {
                    btn.classList.remove('active');
                }
                e.target.classList.add('active');

                this.filterParams.period = button.getAttribute('period');

                if (this.filterParams.period === 'interval') {
                    const dateFrom = this.dateFromInputElements.value;
                    const dateTo = this.dateToInputElements.value;

                    // Если обе даты уже заполнены - сразу делаем запрос
                    if (dateFrom && dateTo) {
                        this.filterParams.dateFrom = dateFrom;
                        this.filterParams.dateTo = dateTo;
                        this.getOperations(this.filterParams).then();
                    }
                    // Иначе ждём ввода дат (запрос сработает через обработчик change)
                } else {
                    // Для других периодов сразу делаем запрос
                    this.getOperations(this.filterParams).then();
                }
            });
        }

        // Обработчик изменения дат для периода interval
        this.dateFromInputElements.addEventListener('change', this.handleDateChange.bind(this));
        this.dateToInputElements.addEventListener('change', this.handleDateChange.bind(this));

        this.popupElement = document.getElementById('popup');

        this.popupElement.classList.add('d-none');


        CommonUtils.initCalendar();

        this.getOperations(this.filterParams).then();
    }

    handleDateChange() {
        const activeButton = document.querySelector('.btn.active[period="interval"]');
        if (!activeButton) return;

        const dateFrom = this.dateFromInputElements.value;
        const dateTo = this.dateToInputElements.value;

        // Делаем запрос только когда обе даты заполнены
        if (dateFrom && dateTo) {
            this.filterParams.dateFrom = dateFrom;
            this.filterParams.dateTo = dateTo;
            this.getOperations(this.filterParams).then();
        }
    }


    async getOperations(){
        let url = '';
        if (this.filterParams.period === 'today') {
            url = '/operations'
        } else {
            url = '/operations?period=' + this.filterParams.period;
            if (this.filterParams.period === 'interval') {
                url += '&dateFrom=' + this.filterParams.dateFrom + '&dateTo=' + this.filterParams.dateTo;
            }
        }

        const result = await HttpUtils.request(url);

        if (!result) {
            return alert('Возникла ошибка при запросе операций. Обратитесь в поддержку');
        }

        if (result.error) {
            return alert('Возникла ошибка при запросе операций. Обратитесь в поддержку');
        }

        this.showTable(result);
    }

    showTable(operations) {
        // Очистка таблицы
        while (this.tableBodyElement.firstChild) {
            this.tableBodyElement.removeChild(this.tableBodyElement.firstChild);
        }

        for (let i = 0; i < operations.length; i++) {
            const trElement = document.createElement('tr');

            // Номер строки
            const thElement = document.createElement('th');
            thElement.setAttribute('scope', 'row');
            thElement.innerText = i + 1;
            trElement.appendChild(thElement);

            // Тип операции
            trElement.insertCell().innerHTML = CommonUtils.getCategoryTypeHtml(operations[i].type);

            // Категория
            trElement.insertCell().innerText = operations[i].category;

            // Сумма
            trElement.insertCell().innerText = operations[i].amount;

            // Дата
            trElement.insertCell().innerText = operations[i].date;

            // Комментарий
            trElement.insertCell().innerText = operations[i].comment;

            // Колонка действий
            const tableActive = trElement.insertCell();
            tableActive.classList.add('operation-column');

            // Создаём контейнер для кнопок
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('d-flex', 'align-items-center', 'flex-nowrap');

            // Ссылка удаления
            const deleteLink = document.createElement('a');
            deleteLink.href = `#/operations/delete?id=${operations[i].id}`;
            deleteLink.classList.add('text-decoration-none', 'cursor-pointer');
            deleteLink.innerHTML = `
            <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
                <path d="M4 5.5C4.27614 5.5 4.5 5.72386 4.5 6V12C4.5 12.2761 4.27614 12.5 4 12.5C3.72386 12.5 3.5 12.2761 3.5 12V6C3.5 5.72386 3.72386 5.5 4 5.5Z" fill="black"/>
                <path d="M6.5 5.5C6.77614 5.5 7 5.72386 7 6V12C7 12.2761 6.77614 12.5 6.5 12.5C6.22386 12.5 6 12.2761 6 12V6C6 5.72386 6.22386 5.5 6.5 5.5Z" fill="black"/>
                <path d="M9.5 6C9.5 5.72386 9.27614 5.5 9 5.5C8.72386 5.5 8.5 5.72386 8.5 6V12C8.5 12.2761 8.72386 12.5 9 12.5C9.27614 12.5 9.5 12.2761 9.5 12V6Z" fill="black"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13 3C13 3.55228 12.5523 4 12 4H11.5V13C11.5 14.1046 10.6046 15 9.5 15H3.5C2.39543 15 1.5 14.1046 1.5 13V4H1C0.447715 4 0 3.55228 0 3V2C0 1.44772 0.447715 1 1 1H4.5C4.5 0.447715 4.94772 0 5.5 0H7.5C8.05229 0 8.5 0.447715 8.5 1H12C12.5523 1 13 1.44772 13 2V3ZM2.61803 4L2.5 4.05902V13C2.5 13.5523 2.94772 14 3.5 14H9.5C10.0523 14 10.5 13.5523 10.5 13V4.05902L10.382 4H2.61803ZM1 3V2H12V3H1Z" fill="black"/>
            </svg>
        `;

            // Обработчик клика для удаления
            deleteLink.addEventListener('click', e => {
                e.preventDefault();
                this.popupElement.classList.remove('d-none');
                this.popupInitEvents(operations[i].id);
            });

            actionsDiv.appendChild(deleteLink);

            // Ссылка редактирования
            const editLink = document.createElement('a');
            editLink.href = `#/operations/edit?id=${operations[i].id}`;
            editLink.classList.add('text-decoration-none', 'cursor-pointer');
            editLink.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z" fill="black"/>
                                  </svg>`;

            actionsDiv.appendChild(editLink);
            tableActive.appendChild(actionsDiv);

            this.tableBodyElement.appendChild(trElement);
        }
    }

    popupInitEvents(id) {
        document.getElementById('delete-confirmation').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#/operations/delete?id=' + id;
        });

        document.getElementById('delete-cancel').addEventListener('click', e => {
            e.preventDefault();
            this.popupElement.classList.add('d-none');
            window.location.hash = '#/operations';
        })
    }


}