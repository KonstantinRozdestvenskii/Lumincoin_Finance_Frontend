const colors = {
    red: '#E0435E',
    orange: '#F59E32',
    yellow: '#FACC15',
    green: '#2DD4BF',
    blue: '#2563EB'
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

const createOptions = (titleText) => ({
    responsive: true,
    maintainAspectRatio: false,
    //radius: 180, // Радиус диаграммы 180px (половина от 360px)

});

new Chart(document.getElementById('income-chart'), {
    type: 'pie',
    data: incomeData,
    options: createOptions('Доходы')
});

new Chart(document.getElementById('expense-chart'), {
    type: 'pie',
    data: expenseData,
    options: createOptions('Расходы')
});