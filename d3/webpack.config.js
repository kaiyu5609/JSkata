var path = require('path')

var config = {
	entry: {
		'd3-selection': path.resolve(__dirname, 'src/d3-selection/index.js'),
		'd3-collection': path.resolve(__dirname, 'src/d3-collection/index.js'),
		'd3-scale': path.resolve(__dirname, 'src/d3-scale/index.js')
	},
	output: {
		path: path.resolve(__dirname, 'dist/'),
		filename: '[name].js',
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
