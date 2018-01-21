var path = require('path')

var config = {
	entry: [
		path.resolve(__dirname, './index.js')
	],
	output: {
		path: path.resolve(__dirname, 'dist/'),
		filename: 'zrender.js',
		publicPath: 'dist',
		library: 'zrender'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{test: /\.css$/, use: 'style!css'}//,
			// {
			// 	test: /\.js$/,
			// 	exclude: [/node_modules/],
			// 	use: [{
			// 		loader: 'babel-loader',
			// 		options: {
			// 			presets: ['es2015']
			// 		}
			// 	}]
			// }
		]
	},
	resolve: {
		extensions: ['.js', '.css']
	},
	devServer: {
		proxy: {
			'/query/*': {
				target: 'http://localhost:3100',
				secure: false
			}
		}
	},
}

module.exports = config;
