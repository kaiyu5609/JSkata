var path = require('path')

var config = {
	entry: [
		path.resolve(__dirname, 'src/d3-selection/index.js')
	],
	output: {
		path: path.resolve(__dirname, 'dist/'),
		filename: 'd3-selection.js',
		publicPath: 'dist',
		library: 'd3'
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
				target: 'http://localhost:3000',
				secure: false
			}
		}
	},
}

module.exports = config;
