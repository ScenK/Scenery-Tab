const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env) => merge(common(env, { mode: 'development' }), {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		static: './dist',
		hot: true, // Enable hot module replacement
		open: false, // Automatically open the browser
		devMiddleware: {
			writeToDisk: true, // Ensure files are written to disk
		},
	},
});
