require.config({
    baseUrl: './js/lib',
});


define(function (require) {
    var zrender = require('zrender/zrender');
    var zr = zrender.init(document.getElementById('main'));
    console.log(zrender);



    var CircleShape = require('zrender/shape/Circle');
    zr.addShape(
        new CircleShape({
            style : {
                x : 100,
                y : 100,
                r : 50,
                color : 'green'
            },
            // 图形元素上绑定事件
            onmouseover : function(params) {
                console.log('catch you!');
            },
            draggable: true
        })
    );

    // 全局事件
    zr.on('click', function(params) {
        console.log('Hello, zrender!', params)
    });






});
