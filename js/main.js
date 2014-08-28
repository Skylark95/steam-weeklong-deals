$(function () {
    "use strict";
    var tableData = [];
    
    /**
     * http://stackoverflow.com/a/5631434
     */
    function trimUrl(url) {
        var n = url.indexOf('?'),
            trimmedUrl = url.substring(0, n !== -1 ? n : url.length);
        
        if (trimmedUrl.lastIndexOf('/') === trimmedUrl.length - 1) {
            trimmedUrl = trimmedUrl.substring(0, trimmedUrl.lastIndexOf('/'));
        }
        
        return trimmedUrl;
    }
    
    /**
     * http://stackoverflow.com/a/4261894
     */
    function createLink(url, text) {
        return $('<a>', {
            href: url,
            text: text,
            target: '_blank'
        }).wrapAll('<div>')
            .parent()
            .html();
    }
    
    $.get('api/', {page: 'weeklongdeals'}, function (data) {
        var $items = $(data.html).find('.item');
        
        $items.each(function (idx, item) {
            var $item = $(item),
                url = trimUrl($item.find('a').attr('href')),
                appId = url.substring(url.lastIndexOf('/') + 1),
                appLink = createLink(url, appId),
                percent = $item.find('.info .percent').first().text(),
                priceWas = $item.find('.info .price span.was').first().text(),
                priceNow = $item.find('.info .price span').last().text();
            
            $.get('api/', {page: 'apphover', app: appId}, function (data) {
                var name = $(data.html).find('h4').first().text();
                tableData.push([appLink, name, percent, priceWas, priceNow]);
                $('#load-count').html('Loaded ' + tableData.length + ' of ' + $items.length + ' entries...');
            });
        });
    });
    
    $(document).ajaxStop(function () {
        $('#ajax-loader').hide();
        $('#deals-table').dataTable({
            'data': tableData,
            'columns': [
                {'title': 'App ID'},
                {'title': 'Name'},
                {'title': 'Percent'},
                {'title': 'Was'},
                {'title': 'Now'}
            ]
        });
        
        $('.show-on-load').removeClass('hidden');
    });
});