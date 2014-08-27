$(function() {
    
    // FUNCTIONS
    
    /**
     * http://stackoverflow.com/a/5631434
     */
    function trimUrl(url) {
        var n = url.indexOf('?'),
            trimmedUrl = url.substring(0, n !== -1 ? n : url.length);
        
        if(trimmedUrl.lastIndexOf('/') === trimmedUrl.length - 1) {
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
            text: text
        }).wrapAll('<div>').parent().html();
    }
    
    // MAIN
    var tableData = [];
    
    $.get('api/', {page: 'weeklongdeals'}, function(data) {
        var $items = $(data).find('.item');
        
        $items.each(function(idx, item) {
                var url = trimUrl($(item).find('a').attr('href')),
                    appId = url.substring(url.lastIndexOf('/') + 1),
                    app = createLink(url, appId);
            
            $.get('api/', {page: 'apphover', app: appId}, function(data) {
                var name = $(data).find('h4').first().text();
                tableData.push([app, name]);
                $('#load-count').html('Loaded ' + tableData.length + ' of ' + $items.length +' entries...');
            });
        })
    });
    
    $(document).ajaxStop(function() {
        $('#ajax-loader').hide();
        $('#deals-table').dataTable({
            'data': tableData,
            'columns': [
                {'title': 'App ID'},
                {'title': 'Name'}
            ]
        }).removeClass('hidden');
    });
});