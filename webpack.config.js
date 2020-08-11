const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let filesMap = [];

function ReadDir(dir) {
	fs.readdirSync(dir, { withFileTypes: true }).map((file) => {
		let fileName = path.resolve(dir + "/" + file.name);
		if (file && !file.isDirectory()) {
			filesMap.push(fileName);
		} else {
			ReadDir(fileName);
		}
	});
}
ReadDir(path.resolve("./src"));
console.log(filesMap);

module.exports = {
	mode: "development",
	entry: filesMap,
	output: {
		path: path.resolve(__dirname, "build"),
		filename: "[name].bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"],
						plugins: [
							[
								"@babel/plugin-proposal-class-properties",
								{ loose: true },
							],
							[
								"@babel/plugin-transform-runtime",
								{ regenerator: true },
							],
						],
						cacheDirectory: true,
					},
				},
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: "./build",
						},
					},
					"css-loader",
					"less-loader",
				],
			},
			{
				test: /\.(png|jp(e*)g|svg)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							limit: 25000,
							name: "images/[hash]-[name].[ext]",
						},
					},
				],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							limit: 8000,
							name: "fonts/[hash]-[name].[ext]",
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: [".js", ".jsx"],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "stylesheets/[name].css",
			chunkFilename: "stylesheets/[id].css",
		}),
		new HtmlWebpackPlugin({
			title: "Infinity",
			inject: false,
			templateContent: ({ htmlWebpackPlugin }) =>
				`<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>${htmlWebpackPlugin.options.title}</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		${htmlWebpackPlugin.tags.headTags}
	</head>
	<body>
		<div id="warpper"><div>
		${htmlWebpackPlugin.tags.bodyTags}
	<body>
</html>`,
		}),
	],
};
