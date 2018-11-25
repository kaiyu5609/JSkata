var zrender = require('zrender')
var zrUtil = require('zrender/tool/util')
var zrEvent = require('zrender/tool/event')
var ecConfig = require('./config')


class Echarts {
    constructor(dom, options) {
        
        this._zr = zrender.init(dom)
        this.options = zrUtil.clone(options || {})
        this._chartList = []
        this._messageCenter = {}
        

    }
}