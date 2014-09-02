<?php
namespace Skylark95\SteamWeeklongDeals\Cache;

interface Cache {
    public function isCached($label);
    public function doCurl($url);
    public function getCache($label);
    public function setCache($label, $data);
    public function setCachePath($cachePath);
    public function setCacheTime($cacheTime);
}
