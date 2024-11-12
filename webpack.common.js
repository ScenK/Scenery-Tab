require('dotenv').config();

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = (env) => {
	const storeUrls = {
		chrome: process.env.CHROME_STORE_URL,
		edge: process.env.EDGE_STORE_URL
	};

	const storeUrl = storeUrls[env.store];
	if (!storeUrl) {
		throw new Error(`Store URL not found for ${env.store}. Please check your .env file.`);
	}
	const openWeatherMapKey = process.env.OPENWEATHERMAP_API_KEY;
	if (!openWeatherMapKey) {
		throw new Error('OPENWEATHERMAP_API_KEY not found. Please check your .env file.');
	}

	return {
		entry: './src/background.js',
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist'),
		},
		module: {
			rules: [
				{
					test: /\.less$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						'less-loader',
					],
				},
			],
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'styles.css',
			}),
			new CopyWebpackPlugin({
				patterns: [
					{ from: 'src/manifest.json', to: 'manifest.json' },
					{ from: 'src/privacy.md', to: 'privacy.md' },
					{ from: 'src/tab.html', to: 'tab.html' },
					{ from: 'public', to: 'public' },
				],
			}),
			new webpack.DefinePlugin({
				'STORE_URL': JSON.stringify(storeUrl),
				'OPENWEATHERMAP_API_KEY': JSON.stringify(openWeatherMapKey),
			}),
		],
	};
};
