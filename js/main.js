$(function () {
    "use strict";
    var $deals,
        saleResource,
        detailsResource,
        tableData = [];
    
    // SETUP //
    function setUpRest() {
        var client = new $.RestClient('/steam-weeklong-deals/api/');
        
        saleResource = client.add('sale');
        
        detailsResource = client.add('details', {isSingle: true});
        detailsResource.add('app');
        detailsResource.add('sub');
    }
    
    /**
     * Remove query string and trailing slashes from URL
     * @see http://stackoverflow.com/a/5631434
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
     * Create an html link using jQuery
     * @see http://stackoverflow.com/a/4261894
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
    
    /**
     * Callback for loading the details for a single row in the table
     */
    function getDealsResults(idx, result) {
        var $result = $(result),
            url = trimUrl($result.find('a').attr('href')),
            urlIdx = url.lastIndexOf('/'),
            appId = url.substring(urlIdx + 1),
            appLink = createLink(url, appId),
            percent = $result.find('.info .percent').first().text(),
            priceWas = $result.find('.info .price span.was').first().text(),
            priceNow = $result.find('.info .price span').last().text(),
            page = url.substring(urlIdx - 3, urlIdx);

        detailsResource[page].read(appId).done(function (data) {
            var name = $(data.html).find('h4').first().text();
            tableData.push([appLink, name, percent, priceWas, priceNow, '']);
            $('#load-count').html('Loaded ' + tableData.length + ' of ' + $deals.length + ' entries...');
        });
    }
    
    /**
     * Retrieve the Steam Weeklong Deals
     */
    function getDeals() {
        saleResource.read('weeklongdeals').done(function (data) {
            $deals = $(data.html).find('.item');
            $deals.each(getDealsResults);
        });
    }
    
    /**
     * Load the table after all ajax calls are complete
     */
    function loadTable() {
        $(document).ajaxStop(function () {
            $('#ajax-loader').hide();
            $('#deals-table').dataTable({
                'data': tableData,
                'columns': [
                    {'title': 'App ID'},
                    {'title': 'Name'},
                    {'title': 'Discount'},
                    {'title': 'Was'},
                    {'title': 'Now'},
                    {'title': 'Rating*'}
                ]
            });
        
            $('.show-on-load').removeClass('hidden');
        });
    }
    
    /**
     * Run the application
     */
    function run() {
        setUpRest();
        getDeals();
        loadTable();
    }
    
    run();
});