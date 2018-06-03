;(function($) {

    class Slider {
        constructor(settings) {
            var defaults = {};
            var options = this.options = $.extend({}, defaults, settings);
            
            this._activeIndex = 1;
            this._slideSize = 3;

            this.bindHtml(options.container);
            this.initElements();
        }

        _getLayoutStyle() {
            return _.range(3).map(function(item, index) {
                return {
                    left: 150 * index + 50,
                    top: index % 2 == 0 ? 60 : 50,
                    width: index % 2 == 0 ? (100 - 20) : 100,
                    height: index % 2 == 0 ? (100 - 20) : 100,
                    lineHeight: index % 2 == 0 ? (100 - 20) + 'px' : '100px',
                };
            });
        }

        bindHtml(container) {
            var containerWidth = container.width();
            var containerHeight = container.height();

            var $list = $('<ul class="slide-list"></ul>').css({
                position: 'relative',
                width: containerWidth,
                height: containerHeight
            });

            this._layoutStyle = this._getLayoutStyle();

            this._layoutStyle.map(function(item) {
                var $li = $('<li>').css({
                    position: 'absolute',
                    left: item.left,
                    top: item.top,
                    width: item.width,
                    height: item.height,
                    background: '#ffae00',
                    textAlign: 'center',
                    lineHeight: item.lineHeight,
                    fontSize: '24px'
                });
                $list.append($li);
            });

            container.append($list);

            this.container = container;
        }

        renderTpl() {
            var self = this;
            var _layoutStyle = this._layoutStyle;
            this.elements.slideItems.each(function(index, item) {
                $(item).css({
                    left: _layoutStyle[index].left,
                    top: _layoutStyle[index].top,
                    width: _layoutStyle[index].width,
                    height: _layoutStyle[index].height,
                    lineHeight: _layoutStyle[index].lineHeight
                })
                .text(function() {
                    return self._displayData[index].join(',');
                })
            })
        }

        initElements() {
            this.elements = {
                origin: this.options.container,
                slideList: $('.slide-list', this.container),
                slideItems: $('li', this.container)
            };
        }
        
        render(data) {
            var self = this;
            var _layoutStyle = this._layoutStyle;

            console.log(data)
            this._displayData = data.slice(0, 3);
            this._slideData = data.slice(3);

            this.renderTpl();
            
        }

        prev() {
            var self = this;
            var _layoutStyle = this._layoutStyle;

            _layoutStyle.push(_layoutStyle.shift());

            this._activeIndex--;

            this._slideIndex = this._activeIndex + 2;

            this._slideIndex = this._slideIndex % 3;

            this._activeIndex = this._activeIndex < 0 ? 2 : this._activeIndex;

            console.log(this._activeIndex, this._slideIndex);

            var lastSlideItem = this._slideData.pop();
            var firstDisplayItem = this._displayData.splice(this._slideIndex, 1, lastSlideItem).pop();

            this._slideData.unshift(firstDisplayItem);

            this.renderTpl();
            
        }

        next() {
            var self = this;
            var _layoutStyle = this._layoutStyle;

            _layoutStyle.unshift(_layoutStyle.pop());

            this._activeIndex++;

            this._slideIndex = this._activeIndex - 2;

            this._slideIndex = this._slideIndex < 0 ? 2 : this._slideIndex;

            this._activeIndex = this._activeIndex % 3;

            console.log(this._activeIndex, this._slideIndex);

            var firstSlideItem = this._slideData.shift();
            var lastDisplayItem = this._displayData.splice(this._slideIndex, 1, firstSlideItem).pop();

            this._slideData.push(lastDisplayItem);

            this.renderTpl();
        }
    }



    $.fn.slider = function(settings) {

        return this.each(function(index, domEl) {

            var dataset = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

            var datas = _.chunk(dataset, 5);

            datas.unshift(datas.pop())

            var slider = new Slider({
                container: $(this),
            });

            slider.render(datas);
            setInterval(function() {
                slider.prev();
            }, 3500);

        });
    };


})(jQuery);


;(function() {

    $('.container').slider({

    });

})();