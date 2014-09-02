<?php
namespace Skylark95\SteamWeeklongDeals\Cache;
require 'vendor/autoload.php';

class SimpleCache implements Cache {
    
    private $cache;
    
    public function __construct($cachePath, $cacheTime)
    {
        $this->cache = new \Gilbitron\Util\SimpleCache();
        $this->setCachePath($cachePath);
        $this->setCacheTime($cacheTime);
    }
    
    public function isCached($label)
    {
        return $this->cache->is_cached($label);
    }
    
    public function doCurl($url)
    {
        return $this->cache->do_curl($url);
    }
    
    public function getCache($label)
    {
        return $this->cache->get_cache($label);
    }
    
    public function setCache($label, $data)
    {
        $this->cache->set_cache($label, $data);
    }
    
    public function setCachePath($path)
    {
        $this->cache->cache_path = $path;
    }
    
    public function setCacheTime($cacheTime)
    {
        $this->cache->cache_time = $cacheTime;
    }
    
}
