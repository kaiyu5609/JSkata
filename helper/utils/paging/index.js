(function($) {

    $.fn.extend({
        paging: function(opts) {
            var defaults = {
                current: 1,
                total: 5,
                page: 5,
                handler: function() {}
            };
            var options = $.extend({}, defaults, opts)
            // console.log(options, Math.ceil(options.page / 2));

            var self = $(this);


            if (options.current >= options.page - 1 && options.total >= options.page + 1) {
                var $a = $('<a>');
                $a.attr('href', '#1').text('首页');
                $(this).append($a);
            }

            if (options.current >= 2) {
                var $a = $('<a>');
                $a.attr('href', '#' + (options.current - 1)).text('上一页');
                $(this).append($a);
            }

            if (options.total <= options.page) {
                for (var i = 1; i <= options.total; i++) {
                    var $a = $('<a>');
                    $a.attr('href', '#' + i);
                    if (options.current == i) {
                        $a.text(i);
                    } else {
                        $a.text('[' + i + ']');
                    }
                    $(this).append($a);
                }
            } else {
                for (var i = 1; i <= options.page; i++) {
                    var $a = $('<a>');
                    if (options.current === 1 || options.current === 2) {
                        $a.attr('href', '#' + i);
                        if (options.current === i) {
                            $a.text(i);
                        } else {
                            $a.text('[' + i + ']');
                        }
                    } else if (options.total - options.current === 0 || options.total - options.current === 1) {
                        $a.attr('href', '#' + (options.total - options.page + i));
                        if (options.total - options.current === 0 && i === options.page) {
                            $a.text(options.total - options.page + i);
                        } else if (options.total - options.current === 1 && i === options.page - 1) {
                            $a.text(options.total - options.page + i);
                        } else {
                            $a.text('[' + (options.total - options.page + i) + ']');
                        }
                    } else {
                        $a.attr('href', '#' + (options.current - Math.ceil(options.page / 2) + i));
                        if (Math.ceil(options.page / 2) === i) {
                            $a.text(options.current - Math.ceil(options.page / 2) + i);
                        } else {
                            $a.text('[' + (options.current - Math.ceil(options.page / 2) + i) + ']');
                        }
                    }

                    
                    $(this).append($a);
                }
            }

            if (options.total - options.current >= 1) {
                var $a = $('<a>');
                $a.attr('href', '#' + (options.current + 1)).text('下一页');
                $(this).append($a);
            }

            if (options.total - options.current >= Math.ceil(options.page / 2) && options.total >= options.page + 1) {
                var $a = $('<a>');
                $a.attr('href', '#' + options.total).text('尾页');
                $(this).append($a);
            }

            options.handler(options.current, options.total);

            var pages = $(this).find('a');

            pages.on('click', function() {
                var current = parseInt($(this).attr('href').substring(1));
                // console.log(current, $(this).attr('href'));
                self.empty();
                self.paging({
                    current: current,
                    total: options.total,
                    page: options.page,
                    handler: options.handler
                });
                return false;
            });

        }
    });





})(jQuery);


(function() {

    $('.container').paging({
        current: 7,
        total: 10,
        page: 5,
        handler: function(i, t) {
            console.log(i, t);
        }
    });


})();