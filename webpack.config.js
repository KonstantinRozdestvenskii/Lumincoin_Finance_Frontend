const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    // Точка входа
    entry: "./src/app.js",
    mode: "development",

    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/#", // Важно для SPA и Vercel
        clean: true      // Очищает папку dist перед каждой сборкой
    },

    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        compress: true,
        port: 9000
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html", // Убедитесь, что index.html лежит в корне проекта
            // baseUrl удален, так как не является стандартной опцией плагина
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/templates", to: "templates" },
                {from: "./src/styles", to: "css"},
                { from: "./src/static/images", to: "images" },
                { from: "./src/static/fonts", to: "fonts" },
                { from: "./node_modules/chart.js/dist/chart.umd.js", to: "js" },
                { from: "./node_modules/flatpickr/dist/flatpickr.css", to: "css" },
                { from: "./node_modules/flatpickr/dist/flatpickr.min.js", to: "js" },
                { from: "./node_modules/flatpickr/dist/l10n/ru.js", to: "js/flatpickr-ru.js" },
            ],
        })
    ],
};