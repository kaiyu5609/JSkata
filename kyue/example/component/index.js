import './index.css'
import Kyue from 'Kyue'

function logger (module) {
    // getStackTrace()
    var log = console.log
    var data = []

    function defer(fn) {
        return Promise.resolve().then(fn)
    }

    function flush() {
        let args
        log(`------------------------------------start ${module}--------------------------------------`)
        while (args = data.shift()) {
            log.apply(log, args)
        }
        log(`------------------------------------ end  ${module}--------------------------------------`)
    }
    
    return function() {
        if (data.length === 0) {
            defer(flush)
        }
        data.push(arguments)
    }
}

var App =  new Kyue({
    data() {
        return {
            message: 'Hello Kyue!'
        }
    },
    render(createElement) {
        return createElement('div', {
            attrs: {
                id: 'app'
            }
        }, this.message)
    }
})


var vm = new Kyue({
    el: '#app',
    render(createElement) {
        return createElement(App)
    }
})

var log = logger('example')

log('Kyue:', Kyue)
log('vm:', vm)


var time = 1
setInterval(() => {
    time++
    vm.message = 'Hello dhuang' + time
    // vm.updateComponent()
}, 1000)