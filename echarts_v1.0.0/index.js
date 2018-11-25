const Echarts = require('./src/echarts')

var init = function(dom, libOption) {
    libOption = libOption || { type: 'canvas' }

    if (libOption.type == 'canvas') {
        return Echarts(dom)
    } else if (libOption.type == 'flash') {
        console.log('未配置')
    }
}


exports.init = init