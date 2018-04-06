"use strict"
{
    const path = require('path');
    const outputFolder = "wwwroot/dist/";

    const ExtractTextPlugin = require("extract-text-webpack-plugin");
    const CleanWebpackPlugin = require('clean-webpack-plugin');

    let extractLess = new ExtractTextPlugin({
        filename: "[name].css"
    });

    let pathsToClean = [
        'wwwroot/dist/*.*'
    ];

    module.exports = {
        "mode": "production",
        "entry": {
            "styles": "./Styles/main.less",
            "scripts": "./Scripts/main.ts",
        },
        "output": {
            "path": path.resolve(__dirname, outputFolder),
            "filename": "[name].js",
        },
        "resolve": {
            "extensions": ['.ts', '.tsx', '.js', '.less']
        },
        "devtool": "source-map",
        "module": {
            "rules": [
                {
                    test: /\.less$/,
                    use: extractLess.extract({
                        use: [{
                            loader: "css-loader"
                        }, {
                            loader: "less-loader"
                        }],
                        fallback: "style-loader"
                    })
                },
                {
                    "test": /\.tsx?$/,
                    "loader": 'awesome-typescript-loader',
                    "exclude": /node_modules/,
                },
                {
                    "test": /\.vue$/,
                    "loader": "vue-loader",
                    "options": { "esModule": true }
                }
            ]
        },
        "plugins": [
            extractLess,
            new CleanWebpackPlugin(pathsToClean)
        ]
    };
}