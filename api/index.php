<?php
require 'vendor/autoload.php';
use Respect\Rest\Router;
use Skylark95\SteamWeeklongDeals\Cache\SimpleCache;

$r3 = new Router('/steam-weeklong-deals/api');
$namespace = 'Skylark95\\SteamWeeklongDeals\\Controller\\';
$cache = new SimpleCache(getcwd() . '/cache/', 86400);

header('Content-Type:application/json');

$r3->get('/sale/weeklongdeals', $namespace . 'SaleWeeklongDeals', [$cache]);
$r3->get('/details/app/*', $namespace . 'AppDetails', [$cache]);
