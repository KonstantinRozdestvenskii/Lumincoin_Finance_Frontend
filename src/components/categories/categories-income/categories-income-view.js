import {HttpUtils} from "../../../utils/http-utils.js";

export class CategoriesIncomeView {
    constructor() {

        this.addButtonElement = document.getElementById("add-btn");
        this.popupElement = document.getElementById('popup');

        this.popupElement.classList.add('d-none');


        this.getCategories().then();
    }

    async getCategories() {
        const result = await HttpUtils.request('/categories/income');

        if (!result) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }

        if (result.error) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }

        this.showCards(result);

    }

    showCards(categoriesList) {

        categoriesList.forEach(category => {
            const cardColumn = document.createElement('div');
            cardColumn.classList.add('col');

            const card = document.createElement('div');
            card.classList.add('categories');
            card.classList.add('p-3');
            card.classList.add('border');
            card.classList.add('rounded-3');

            const cardTitle = document.createElement('h2');
            cardTitle.classList.add('mb-2');
            cardTitle.classList.add('fs-3');
            cardTitle.innerText = category.title;

            const cardAction = document.createElement('div');
            cardAction.classList.add('d-flex');
            cardAction.classList.add('flex-wrap');
            cardAction.classList.add('flex-sm-nowrap');
            cardAction.classList.add('gap-2');

            const editButton = document.createElement('a');
            editButton.classList.add('btn');
            editButton.classList.add('btn-primary');
            editButton.classList.add('me-2');
            editButton.classList.add('text-decoration-none');
            editButton.href = '#/categories/income/edit?id=' + category.id;
            editButton.innerText = "Редактировать"

            const deleteButton = document.createElement('a');
            deleteButton.classList.add('btn');
            deleteButton.classList.add('btn-danger');
            deleteButton.classList.add('me-2');
            deleteButton.classList.add('text-decoration-none');
            deleteButton.href = 'javascript:void(0)'
            deleteButton.innerText = "Удалить"
            deleteButton.addEventListener('click', e => {
                this.popupElement.classList.remove('d-none');
                this.popupInitEvents(category.id);
            });

            cardAction.appendChild(editButton);
            cardAction.appendChild(deleteButton);

            card.appendChild(cardTitle);
            card.appendChild(cardAction);

            cardColumn.appendChild(card);

            this.addButtonElement.parentNode.insertBefore(cardColumn, this.addButtonElement);
        })

    }

    popupInitEvents(id) {
        document.getElementById('delete-confirmation').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#/categories/income/delete?id=' + id;
        });

        document.getElementById('delete-cancel').addEventListener('click', e => {
            window.location.hash = '#/categories/income';
        })
    }
}