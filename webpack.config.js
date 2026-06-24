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
        publicPath: "/",
        clean: true
    },

    devServer: {
        static: {
            directory: '.dist',
        },
        compress: true,
        port: 9000
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/templates", to: "templates" },
                {from: "./src/styles", to: "css"},
                { from: "./src/static/images", to: "images" },
                { from: "./src/static/fonts", to: "fonts" },
                { from: "./node_modules/chart.js/dist/chart.umd.js", to: "js" },
                { from: "./node_modules/flatpickr/dist/flatpickr.css", to: "css" },
                { from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "js" },
                { from: "./node_modules/bootstrap/dist/css/bootstrap.css", to: "css" },
                { from: "./node_modules/flatpickr/dist/flatpickr.min.js", to: "js" },
                { from: "./node_modules/flatpickr/dist/l10n/ru.js", to: "js/flatpickr-ru.js" },
            ],
        })
    ],
};