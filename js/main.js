$(function () {
    "use strict";
    var $deals,
        saleResource,
        detailsResource,
        ratingsResource,
        tableData = [];
    
    /**
     * Setup jQuery Rest
     */
    function setUpRest() {
        var client = new $.RestClient('/steam-weeklong-deals/api/');
        
        saleResource = client.add('sale');
        
        detailsResource = client.add('details', {isSingle: true});
        detailsResource.add('app');
        detailsResource.add('sub');
        
        ratingsResource = client.add('ratings', {isSingle: true});
        ratingsResource.add('app');
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
     * Updates the count for the number of records loaded
     */
    function updateLoadingStatus(cached) {
        $('#load-count').html('Loaded ' + tableData.length + ' of ' + $deals.length + ' entries...');
        if (!cached) {
            $('#cache-warning').removeClass('hidden');
        }
    }
    
    /**
     * Parse and calculate user rating
     */
    function getRating(ratings) {
        var total = 0,
            recommended = 0;
        $.each(ratings, function (idx, data) {
            var $data = $(data.html),
                count = $data.find('div.title').length;
            total += count;
            recommended += count - $data.find('div.title:contains(\'Not Recommended\')').length;
        });
        return Math.round((recommended / total) * 100) + '%';
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

        if (page === 'app') {
            $.when(
                detailsResource.app.read(appId),
                ratingsResource.app.read(appId)
            ).done(function (detailsRsp, ratingsRsp) {
                var name = $(detailsRsp[0].html).find('h4').first().text(),
                    rating = getRating(ratingsRsp[0].ratings);
                tableData.push([appLink, name, percent, priceWas, priceNow, rating]);
                updateLoadingStatus(detailsRsp[0].cached || ratingsRsp[0].cached);
            });
        } else if (page === 'sub') {
            detailsResource.sub.read(appId).done(function (detailsRsp) {
                var name = $(detailsRsp.html).find('h4').first().text();
                tableData.push([appLink, name, percent, priceWas, priceNow, '']);
                updateLoadingStatus(detailsRsp.cached);
            });
        }
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
                    {'title': 'App ID', 'type': 'html-num-fmt'},
                    {'title': 'Name', 'type': 'string'},
                    {'title': 'Discount', 'type': 'num-fmt'},
                    {'title': 'Was', 'type': 'num-fmt'},
                    {'title': 'Now', 'type': 'num-fmt'},
                    {'title': 'Rating*', 'type': 'num-fmt'}
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