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
        if (total === 0) {
            return '0%';
        }
        return Math.round((recommended / total) * 100) + '%';
    }
    
    /**
     * Return the supported OS's for a row
     */
    function getOS($result) {
        var $os = $result.find('div.OS'),
            row = [];
        if ($os.find('.win').length === 1) {
            row.push(' Windows');
        }
        if ($os.find('.mac').length === 1) {
            row.push(' Mac');
        }
        if ($os.find('.linux').length === 1) {
            row.push(' Linux');
        }
        return row;
    }
    
    /**
     * Callback for loading the details for a single row in the table
     */
    function getDealsResults(idx, result) {
        var $result = $(result),
            url = trimUrl($result.find('a').attr('href')),
            urlIdx = url.lastIndexOf('/'),
            appId = url.substring(urlIdx + 1),
            appLink = '<a href="' + url + '" target="_blank">' + appId + '</a>',
            percent = $result.find('.info .percent').first().text(),
            priceWas = $result.find('.info .price span.was').first().text(),
            priceNow = $result.find('.info .price span').last().text(),
            page = url.substring(urlIdx - 3, urlIdx),
            os = getOS($result);
        
        if (page === 'app') {
            $.when(
                detailsResource.app.read(appId),
                ratingsResource.app.read(appId)
            ).done(function (detailsRsp, ratingsRsp) {
                var name = $(detailsRsp[0].html).find('h4').first().text(),
                    rating = getRating(ratingsRsp[0].ratings);
                tableData.push([appLink, name, percent, priceWas, priceNow, rating, os]);
                updateLoadingStatus(detailsRsp[0].cached || ratingsRsp[0].cached);
            });
        } else if (page === 'sub') {
            detailsResource.sub.read(appId).done(function (detailsRsp) {
                var name = $(detailsRsp.html).find('h4').first().text();
                tableData.push([appLink, name, percent, priceWas, priceNow, '', os]);
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
            var $dealsTable = $('#deals-table').DataTable({
                'data': tableData,
                'columns': [
                    {'title': 'App ID', 'type': 'html-num-fmt'},
                    {'title': 'Name', 'type': 'string'},
                    {'title': 'Discount', 'type': 'num-fmt'},
                    {'title': 'Was', 'type': 'num-fmt'},
                    {'title': 'Now', 'type': 'num-fmt'},
                    {'title': 'Rating*', 'type': 'num-fmt'},
                    {'title': 'OS', 'type': 'string'}
                ]
            });
            
            $('#deals-table_filter input').attr('placeholder', 'Search All');
            
            $('#deals-table tfoot th.filter-text').each(function () {
                var title = $('#deals-table thead th').eq($(this).index()).text();
                $(this).html('<input type="text" class="form-control input-sm" placeholder="Search ' + title + '" />');
            });
            
            $('#deals-table tfoot th.filter-os').each(function () {
                $(this).html($('#components .select-os').clone().html());
            });
            
            $dealsTable.columns().eq(0).each(function (colIdx) {
                $('input', $dealsTable.column(colIdx).footer()).on('keyup change', function () {
                    $dealsTable.column(colIdx).search(this.value).draw();
                });
                $('select', $dealsTable.column(colIdx).footer()).on('change', function () {
                    $dealsTable.column(colIdx).search(this.value).draw();
                });
            });
            
            $('.hide-on-load').addClass('hidden');
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