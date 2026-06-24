export class MainPage {
    constructor() {
        this.initCalendar();
        this.initCharts();
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

    initCharts() {
        const colors = {
            red: '#E0435E',
            orange: '#F59E32',
            yellow: '#FACC15',
            green: '#2DD4BF',
            blue: '#2563EB'
        };

        const legendSpacingPlugin = {
            id: 'legendSpacingPlugin',
            beforeInit(chart) {
                // Сохраняем оригинальную функцию fit
                const originalFit = chart.legend.fit;

                // Переопределяем её
                chart.legend.fit = function fit() {
                    // Вызываем оригинальную функцию
                    originalFit.bind(chart.legend)();
                    // Добавляем нужный отступ (40px)
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

        const resizePlugin = {
            id: 'resizePlugin',
            afterInit(chart) {
                const updateSize = () => {
                    const size = getChartSize();
                    chart.resize(size.width, size.height);
                };

                // Инициализация размера
                updateSize();

                // Слушатель изменения размера окна
                window.addEventListener('resize', updateSize);

                // Сохраняем ссылку на функцию для удаления
                chart._resizeUpdate = updateSize;
            },
            beforeDestroy(chart) {
                // Удаляем слушатель при уничтожении графика
                if (chart._resizeUpdate) {
                    window.removeEventListener('resize', chart._resizeUpdate);
                }
            }
        };

        const incomeData = {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
            datasets: [{
                data: [30, 40, 15, 10, 5],
                backgroundColor: Object.values(colors),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        };

        const expenseData = {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
            datasets: [{
                data: [5, 10, 30, 30, 25],
                backgroundColor: Object.values(colors),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
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

        // Создаем графики с разными заголовками
        new Chart(document.getElementById('income-chart'), {
            type: 'pie',
            data: incomeData,
            options: createOptions('Доходы'),
            plugins: [legendSpacingPlugin, resizePlugin]
        });

        new Chart(document.getElementById('expense-chart'), {
            type: 'pie',
            data: expenseData,
            options: createOptions('Расходы'),
            plugins: [legendSpacingPlugin, resizePlugin]
        });
    }
}