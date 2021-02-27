const webpack = require("webpack");
const path = require("path");

const config = {
    entry: {
        main: "./src/js/index.js",
    },
    output: {
        path: path.resolve(__dirname, "mongo_dash/public/js/modules/"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
};

module.exports = config;
