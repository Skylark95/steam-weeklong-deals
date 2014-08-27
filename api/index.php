<?php
    require 'vendor/autoload.php';
    require 'functions.php';
    require 'config.php';

    $cache = new Gilbitron\Util\SimpleCache();
    
    if(page(PAGE_WEEKLONG_DEALS)) {
        header('Content-Type:text/plain');
        echo get_page(PAGE_WEEKLONG_DEALS, URL_WEEKLONG_DEALS, $cache);
    } else if (page(PAGE_APP_HOVER) && isset($_GET[APP])) {
        header('Content-Type:text/plain');
        echo get_page(PAGE_APP_HOVER . '-' . $_GET[APP], URL_APP_HOVER . '/' . $_GET[APP], $cache);
    } else {
        http_response_code(400);
    }
    
?>