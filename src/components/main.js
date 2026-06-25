import {HttpUtils} from "../utils/http-utils";
import {CommonUtils} from "../utils/common-utils";

export class MainPage {
    constructor() {
        this.dateFromInputElements = document.getElementById('dateFrom');
        this.dateToInputElements = document.getElementById('dateTo');
        this.filterButtonElements = document.querySelectorAll('.form .btn');

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


        CommonUtils.initCalendar();

        this.getOperations().then;
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

        this.operations = result;
        this.prepareChartData();
    }

    prepareChartData() {
        // Функция для генерации массива уникальных цветов
        const generateColors = (count) => {
            const colors = [];
            for (let i = 0; i < count; i++) {
                const hue = Math.round((i * (360 / count)) % 360);
                colors.push(`hsl(${hue}, 70%, 60%)`);
            }
            return colors;
        };

        // Функция для агрегации данных
        const aggregateByCategory = (ops) => {
            const categoryMap = {};

            ops.forEach(op => {
                if (!categoryMap[op.category]) {
                    categoryMap[op.category] = 0;
                }
                categoryMap[op.category] += op.amount;
            });

            // Опциональная сортировка по убыванию суммы (от большего к меньшему)
            const sortedEntries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
            const labels = sortedEntries.map(entry => entry[0]);
            const data = sortedEntries.map(entry => entry[1]);

            return {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: generateColors(labels.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            };
        };

        // Разделяем операции на доходы и расходы
        const incomeOps = this.operations.filter(op => op.type === 'income');
        const expenseOps = this.operations.filter(op => op.type === 'expense');

        // Присваиваем данные свойствам объекта
        this.incomeData = aggregateByCategory(incomeOps);
        this.expenseData = aggregateByCategory(expenseOps);

        // Сразу вызываем отрисовку графиков
        this.initCharts();
    }

    initCharts() {
        // Уничтожаем старые графики, если они уже существуют
        // (чтобы при перерисовке не накладывались друг на друга на canvas)
        if (this.incomeChart) {
            this.incomeChart.destroy();
        }
        if (this.expenseChart) {
            this.expenseChart.destroy();
        }

        // Плагин для добавления отступа под легендой
        const legendSpacingPlugin = {
            id: 'legendSpacingPlugin',
            beforeInit(chart) {
                const originalFit = chart.legend.fit;
                chart.legend.fit = function fit() {
                    originalFit.bind(chart.legend)();
                    this.height += 40;
                }
            }
        };

        // Функция для определения размеров в зависимости от ширины экрана
        const getChartSize = () => {
            if (window.innerWidth < 576) {
                return {width: 337, height: 367};
            }
            return {width: 437, height: 467};
        };

        // Плагин для адаптивного изменения размера графиков
        const resizePlugin = {
            id: 'resizePlugin',
            afterInit(chart) {
                const updateSize = () => {
                    const size = getChartSize();
                    chart.resize(size.width, size.height);
                };

                updateSize();
                window.addEventListener('resize', updateSize);
                chart._resizeUpdate = updateSize;
            },
            beforeDestroy(chart) {
                if (chart._resizeUpdate) {
                    window.removeEventListener('resize', chart._resizeUpdate);
                }
            }
        };

        // Общие настройки с заголовком
        const createOptions = (titleText) => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 35,
                        boxHeight: 10,
                        padding: 10,
                        font: {
                            family: "'roboto-medium', sans-serif",
                            size: 12,
                        },
                        color: '#000000',
                    }
                },
                title: {
                    display: true,
                    text: titleText,
                    font: {
                        family: "'roboto-medium', sans-serif",
                        size: 28
                    },
                    color: '#4c1d95',
                    padding: {
                        bottom: 20
                    }
                }
            }
        });

        // Создаём графики и сохраняем ссылки на них
        this.incomeChart = new Chart(document.getElementById('income-chart'), {
            type: 'pie',
            data: this.incomeData,
            options: createOptions('Доходы'),
            plugins: [legendSpacingPlugin, resizePlugin]
        });

        this.expenseChart = new Chart(document.getElementById('expense-chart'), {
            type: 'pie',
            data: this.expenseData,
            options: createOptions('Расходы'),
            plugins: [legendSpacingPlugin, resizePlugin]
        });
    }
}