;(function($) {
    var defaults = {

    };

    function render(container, itemStyles) {
        var items = container.find('li');

        items.each(function(index, item) {
            $(item).css({
                left: itemStyles[index].left,
                top: itemStyles[index].top,
                width: itemStyles[index].width,
                height: itemStyles[index].height,
                lineHeight: itemStyles[index].lineHeight
            })
        })
    }

    $.fn.slider = function(customOptions) {
        var options = $.extend({}, defaults, customOptions);

        return this.each(function(index, domEl) {
            var $this = $(this);
            var containerWidth = $this.width();
            var containerHeight = $this.height();

            var items = [
                1, 2, 3
            ];

            var $list = $('<ul>').css({
                position: 'relative',
                width: containerWidth,
                height: containerHeight
            });

            var itemStyles = items.map(function(item, index) {
                var $li = $('<li>').css({
                    position: 'absolute',
                    left: 150 * index + 50,
                    top: index % 2 == 0 ? 60 : 50,
                    width: index % 2 == 0 ? (100 - 20) : 100,
                    height: index % 2 == 0 ? (100 - 20) : 100,
                    background: '#ffae00',
                    textAlign: 'center',
                    lineHeight: index % 2 == 0 ? (100 - 20) + 'px' : '100px',
                    fontSize: '24px'
                })
                .text(function() {
                    return index + 1;
                });
                $list.append($li);

                return {
                    left: 150 * index + 50,
                    top: index % 2 == 0 ? 60 : 50,
                    width: index % 2 == 0 ? (100 - 20) : 100,
                    height: index % 2 == 0 ? (100 - 20) : 100,
                    lineHeight: index % 2 == 0 ? (100 - 20) + 'px' : '100px',
                };

            });
            
            $this.append($list);
            
            setInterval(function() {
                itemStyles.push(itemStyles.shift());
                render($list, itemStyles)
            }, 1500);

        });
    };


})(jQuery);


;(function() {

    $('.container').slider({

    });

})();