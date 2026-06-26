import {MainPage} from "./components/main.js";
import {Login} from "./components/auth/login.js";
import {FileUtils} from "./utils/file-utils.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Logout} from "./components/auth/logout.js";
import {CategoriesIncomeView} from "./components/categories/categories-income/categories-income-view.js";
import {CategoriesIncomeCreate} from "./components/categories/categories-income/categories-income-create.js";
import {CategoriesIncomeEdit} from "./components/categories/categories-income/categories-income-edit.js";
import {CategoriesExpenseView} from "./components/categories/categories-expense/categories-expense-view.js";
import {CategoriesExpenseCreate} from "./components/categories/categories-expense/categories-expense-create.js";
import {CategoriesExpenseEdit} from "./components/categories/categories-expense/categories-expense-edit.js";
import {CategoriesIncomeDelete} from "./components/categories/categories-income/categories-income-delete.js";
import {CategoriesExpenseDelete} from "./components/categories/categories-expense/categories-expense-delete.js";
import {OperationsView} from "./components/operations/operations-view.js";
import {OperationsCreate} from "./components/operations/operations-create.js";
import {OperationsEdit} from "./components/operations/operations-edit.js";
import {OperationsDelete} from "./components/operations/operations-delete.js";
import {AuthUtils} from "./utils/auth-utils.js";
import {HttpUtils} from "./utils/http-utils.js";
import {CommonUtils} from "./utils/common-utils.js";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.currentRoute = null;

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new MainPage();
                },
                styles: ['main.css'],
                libraryStyles: ['flatpickr.css'],
                scripts: ['chart.umd.js', 'flatpickr.min.js', 'flatpickr-ru.js']
            },
            {
                route: '#/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false
            },
            {
                route: '#/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    new Login();
                },
                styles: ['auth.css']
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/signup.html',
                useLayout: false,
                load: () => {
                    new SignUp();
                },
                styles: ['auth.css']
            },
            {
                route: '#/logout',
                load: () => {
                    new Logout();
                }
            },
            {
                route: '#/categories/income',
                title: 'Категории доходов',
                filePathTemplate: '/templates/pages/categories/categories-income/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoriesIncomeView();
                },
                styles: ['categories.css']
            },
            {
                route: '#/categories/income/create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/categories/categories-income/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoriesIncomeCreate();
                },
                styles: ['categories-create.css']
            },
            {
                route: '#/categories/income/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/categories/categories-income/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoriesIncomeEdit();
                },
                styles: ['categories-create.css']
            },
            {
                route: '#/categories/income/delete',
                load: () => {
                    new CategoriesIncomeDelete();
                }
            },
            {
                route: '#/categories/expense',
                title: 'Категории расходов',
                filePathTemplate: '/templates/pages/categories/categories-expense/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoriesExpenseView();
                },
                styles: ['categories.css']
            },
            {
                route: '#/categories/expense/create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/categories/categories-expense/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoriesExpenseCreate();
                },
                styles: ['categories-create.css']
            },
            {
                route: '#/categories/expense/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/categories/categories-expense/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoriesExpenseEdit();
                },
                styles: ['categories-create.css']
            },
            {
                route: '#/categories/expense/delete',
                load: () => {
                    new CategoriesExpenseDelete();
                }
            },
            {
                route: '#/operations',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/operations/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsView();
                },
                styles: ['operations.css'],
                libraryStyles: ['flatpickr.css'],
                scripts: ['flatpickr.min.js', 'flatpickr-ru.js']
            },
            {
                route: '#/operations/create',
                title: 'Создание операции',
                filePathTemplate: '/templates/pages/operations/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsCreate();
                },
                styles: ['operations-create.css'],
                libraryStyles: ['flatpickr.css'],
                scripts: ['flatpickr.min.js', 'flatpickr-ru.js']
            },
            {
                route: '#/operations/edit',
                title: 'Редактирование операции',
                filePathTemplate: '/templates/pages/operations/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsEdit();
                },
                styles: ['operations-create.css'],
                libraryStyles: ['flatpickr.css'],
                scripts: ['flatpickr.min.js', 'flatpickr-ru.js']
            },
            {
                route: '#/operations/delete',
                load: () => {
                    new OperationsDelete();
                }
            }
        ];

        // Устанавливаем хеш по умолчанию, если его нет

        const AuthInfo = AuthUtils.getAuthInfo();
        if (!window.location.hash) {
            if (!AuthInfo.accessToken || !AuthInfo.refreshToken || !AuthInfo.userInfo) {
                window.location.hash = '#/login';
            } else {
                window.location.hash = '#/';
            }
        }


    }

    async openRoute() {
        const oldRoute = this.currentRoute;
        const urlRoute = window.location.hash.split('?')[0];;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (!newRoute) {
            window.location.hash = '#/404';
            return;
        }

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) && newRoute.route !== '#/login' && newRoute.route !== '#/signup' && newRoute.route !== '#/logout') {
            window.location.hash = '#/login';
            return;
        }

        // 🔥 ОЧИСТКА BODY: удаляем всё, кроме div#content
        const contentElement = document.getElementById('content');
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach(child => {
            if (child !== contentElement) {
                child.remove();
            }
        });

        this.currentRoute = urlRoute;

        // Очистка предыдущего роута
        if (oldRoute) {
            const prevRoute = this.routes.find(item => item.route === oldRoute);
            if (prevRoute) {
                if (prevRoute.libraryStyles && prevRoute.libraryStyles.length > 0) {
                    prevRoute.libraryStyles.forEach(style => {
                        document.querySelector(`link[href='/css/${style}']`)?.remove();
                    });
                }
                if (prevRoute.styles && prevRoute.styles.length > 0) {
                    prevRoute.styles.forEach(style => {
                        document.querySelector(`link[href='/css/${style}']`)?.remove();
                    });
                }
                if (prevRoute.scripts && prevRoute.scripts.length > 0) {
                    prevRoute.scripts.forEach(script => {
                        document.querySelector(`script[src='/js/${script}']`)?.remove();
                    });
                }
                if (prevRoute.unload && typeof prevRoute.unload === 'function') {
                    prevRoute.unload();
                }
            }
        }

        // Загрузка стилей библиотек (перед common.css)
        if (newRoute.libraryStyles && newRoute.libraryStyles.length > 0) {
            newRoute.libraryStyles.forEach(style => {
                FileUtils.loadPageStyles('/css/' + style, 'before');
            });
        }

        // Загрузка стилей страницы (после common.css)
        if (newRoute.styles && newRoute.styles.length > 0) {
            newRoute.styles.forEach(style => {
                FileUtils.loadPageStyles('/css/' + style, 'after');
            });
        }

        // Загрузка скриптов
        if (newRoute.scripts && newRoute.scripts.length > 0) {
            for (const script of newRoute.scripts) {
                await FileUtils.loadPageScript('/js/' + script);
            }
        }

        // Обновление заголовка
        if (newRoute.title) {
            this.titlePageElement.innerText = newRoute.title + ' | Luminincoin Finance';
        }

        // Загрузка шаблонов
        if (newRoute.filePathTemplate) {
            if (newRoute.useLayout) {
                // 1. Вставляем layout (сайдбар + хедер) в content
                this.contentPageElement.innerHTML = await fetch(newRoute.useLayout)
                    .then(response => response.text());


                // 2. Добавляем шаблон страницы в конец блока content
                const templateHTML = await fetch(newRoute.filePathTemplate)
                    .then(response => response.text());
                this.contentPageElement.insertAdjacentHTML('beforeend', templateHTML);

                // 3. Заполняем информацию о пользователе
                const userNameElements = document.getElementsByClassName('user-name');
                let userName = null;
                if (AuthUtils.getAuthInfo(AuthUtils.userInfoKey)) {
                    const userInfoJson = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoKey));
                    userName = userInfoJson.name;
                }
                for (let i = 0; i < userNameElements.length; i++) {
                    userNameElements[i].innerText = userName;
                }

                // 4. Делаем активным текущий пункт меню
                this.activateMenuItem(newRoute);

                // 5. Обновляем баланс
                this.balanceElements = document.getElementsByClassName('balance');
                this.refreshBalance().then();

                // 6. Редактирование баланса
                this.balancePopupElement = document.getElementById('popup-balance');
                this.balancePopupElement.classList.add('d-none');
                this.balanceInputElement = document.getElementById('balance-value');

                for (const balanceElement of this.balanceElements) {
                    balanceElement.addEventListener('click', e => {
                        e.preventDefault();
                        this.showBalancePopup().then();
                    });
                }

                document.getElementById('balance-save').addEventListener('click', e => {
                    e.preventDefault();
                    this.editBalance().then();
                })

                document.getElementById('balance-cancel').addEventListener('click', e => {
                    e.preventDefault();
                    this.balancePopupElement.classList.add('d-none');
                })

            } else {
                // Если layout не используется — просто вставляем шаблон
                this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate)
                    .then(response => response.text());
            }
        }

        // Инициализация страницы
        if (newRoute.load && typeof newRoute.load === 'function') {
            newRoute.load();
        }
    }

    activateMenuItem(route) {
        let currentRoute = route.route;

        // Особый случай: для operations/create и operations/edit
        // нужно активировать соответствующий пункт в меню "Категории"
        const isOperationsSpecialCase = currentRoute.startsWith('#/operations/create') ||
            currentRoute.startsWith('#/operations/edit');

        if (isOperationsSpecialCase) {
            // Получаем параметры из хеша
            const params = CommonUtils.getHashParams();
            const target = params.target;

            // Меняем currentRoute на соответствующий categories роут
            if (target === 'income') {
                currentRoute = '#/categories/income';
            } else if (target === 'expense') {
                currentRoute = '#/categories/expense';
            }
        }

        // Сначала сбрасываем active у всех возможных элементов
        document.querySelectorAll('.nav-link, li.nav-item.rounded-2, a.btn-toggle')
            .forEach(el => el.classList.remove('active'));

        // Ищем подходящий nav-link
        document.querySelectorAll('.nav-link').forEach(item => {
            const href = item.getAttribute('href');

            // Пропускаем элементы без href (например, сам btn-toggle)
            if (!href) return;

            // Особый случай: не активируем #/operations для operations/create и operations/edit
            if (isOperationsSpecialCase && href === '#/operations') {
                return;
            }

            // Проверка совпадения для хеш-роутинга
            const isActive = (currentRoute.includes(href) && href !== '#/') ||
                (currentRoute === '#/' && href === '#/');

            if (isActive) {
                item.classList.add('active');

                // Проверяем, находится ли ссылка внутри раскрывающегося меню
                const collapse = item.closest('.collapse');
                if (collapse) {
                    // "Прапрадед" — li.nav-item.rounded-2
                    const topLevelItem = item.closest('li.nav-item.rounded-2');
                    if (topLevelItem) topLevelItem.classList.add('active');

                    // Элемент a.btn-toggle на одном уровне с div.collapse ("дедушкой")
                    const toggle = collapse.parentElement.querySelector('a.btn-toggle');
                    if (toggle) toggle.classList.add('active');

                    // Дополнительно: разворачиваем меню, если оно свёрнуто
                    if (!collapse.classList.contains('show')) {
                        new bootstrap.Collapse(collapse, { toggle: true });
                    }
                }
            }
        });
    }

    async getBalance() {
        const result = await HttpUtils.request('/balance', 'GET', true);

        let balance = 0;

        if (!result || (result && result.error)) {
            alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку');
            balance = 0;
        } else {
            balance = result.balance;
        }

        return balance;
    }

    async refreshBalance() {
        const balance = await this.getBalance();
        for (const balanceElement of this.balanceElements) {
            balanceElement.querySelector('span').innerText = balance + '$';
        }

    }

    async showBalancePopup() {
        this.balancePopupElement.classList.remove('d-none');
        this.balanceInputElement.value = await this.getBalance();
    }

    async editBalance() {
       if (this.balanceInputElement.value) {
           const result = await HttpUtils.request('/balance', 'PUT', true, {
               newBalance: this.balanceInputElement.value,
           })

           if (!result || (result && result.error)) {
               alert('Возникла ошибка при изменении баланса. Обратитесь в поддержку');
           }
       }

       this.balancePopupElement.classList.add('d-none');
       await this.refreshBalance();
    }
}