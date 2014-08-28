<?php
require 'vendor/autoload.php';
require 'functions.php';
require 'config.php';

header('Content-Type:application/json');

if (is_clear_cache()) {
    echo do_clear_cache();
    exit();
}

$cache = new Gilbitron\Util\SimpleCache();
$cache->cache_time = 86400;

if (is_page(PAGE_WEEKLONG_DEALS)) {
    echo get_page(PAGE_WEEKLONG_DEALS, URL_WEEKLONG_DEALS, $cache);
} else if (is_page(PAGE_APP_HOVER) && isset($_GET[APP])) {
    echo get_page(PAGE_APP_HOVER . '-' . $_GET[APP], URL_APP_HOVER . '/' . $_GET[APP], $cache);
} else {
    echo bad_request();
}