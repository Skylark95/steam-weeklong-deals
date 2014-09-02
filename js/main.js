$(function () {
    "use strict";
    var $deals,
        tableData = [];
    
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
    
    function getDealsResults(idx, result) {
        var $result = $(result),
            url = trimUrl($result.find('a').attr('href')),
            urlIdx = url.lastIndexOf('/'),
            appId = url.substring(urlIdx + 1),
            appLink = createLink(url, appId),
            percent = $result.find('.info .percent').first().text(),
            priceWas = $result.find('.info .price span.was').first().text(),
            priceNow = $result.find('.info .price span').last().text(),
            page = url.substring(urlIdx - 3, urlIdx),
            apiParams = {'page': page + 'hover'};

        apiParams[page] = appId;
        $.get('api/', apiParams, function (data) {
            var name = $(data.html).find('h4').first().text();
            tableData.push([appLink, name, percent, priceWas, priceNow]);
            $('#load-count').html('Loaded ' + tableData.length + ' of ' + $deals.length + ' entries...');
        });
    }
    
    function getDeals() {
        $.get('api/', {page: 'weeklongdeals'}, function (data) {
            $deals = $(data.html).find('.item');
            $deals.each(getDealsResults);
        });
    }
    
    function loadTable() {
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
    }
    
    getDeals();
    loadTable();
});