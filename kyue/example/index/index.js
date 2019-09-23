import './index.css'
import Kyue from 'Kyue'

console.log('-------------------------------------example-------------------------------------')
console.log('Kyue:', Kyue)

var vm = new Kyue({
    el: '#app',
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

console.log('vm:', vm)
console.log('message:', vm.message)

var time = 1
setInterval(() => {
    time++
    vm.message = 'Hello dhuang' + time
    // vm.updateComponent()
}, 1000)