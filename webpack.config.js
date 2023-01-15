const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const I18nPlugin = require("i18n-webpack-plugin");
const isProduction = process.env.NODE_ENV === "production";

let languages = {
	"en-US": require("./lang/en-US.json"),
	"pt-BR": require("./lang/pt-BR.json")
};

function pluginsInit(lang) {
	let plugins = [
		new I18nPlugin(lang),
		new webpack.ExternalsPlugin("commonjs", ["electron"])
	];

	isProduction ? plugins.push(new MiniCssExtractPlugin()) : null;

	return plugins;
}

module.exports = Object.keys(languages).map(function(language) {
	return {
		name: language,
		mode: "development",
		entry: "./src/index.js",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: language + ".bundle.js"
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: require.resolve("babel-loader")
				},
				{
					test: /\.(le|c)ss$/,
					use: [
						isProduction ? MiniCssExtractPlugin.loader : "style-loader",
						"css-loader",
						"less-loader"
					]
				}
			]
		},
		plugins: pluginsInit(languages[language])
	};
});
