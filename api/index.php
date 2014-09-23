<?php
require 'vendor/autoload.php';
use Respect\Rest\Router;
use Skylark95\SteamWeeklongDeals\Cache\SimpleCache;

/**
 * Config
 */
header('Content-Type:application/json');
$r3 = new Router('/steam-weeklong-deals/api');
$namespace = 'Skylark95\\SteamWeeklongDeals\\Controller\\';
$cachePath = getcwd() . '/tmp/';
$cacheTime = 86400;
$clearCacheKey = 'pwd';
$cache = new SimpleCache($cachePath, $cacheTime);

/**
 * Routing
 */
$r3->get('/sale/weeklongdeals/page/*', $namespace . 'SaleWeeklongDeals', [$cache]);
$r3->get('/details/*/*', $namespace . 'Details', [$cache]);
$r3->get('/ratings/app/*', $namespace . 'Ratings', [$cache]);
$r3->delete('/cache/', $namespace . 'Cache', [$clearCacheKey, $cachePath]);
