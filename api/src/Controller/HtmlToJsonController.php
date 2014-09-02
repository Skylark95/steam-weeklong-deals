<?php
namespace Skylark95\SteamWeeklongDeals\Controller;
use Skylark95\SteamWeeklongDeals\Cache\Cache;

abstract class HtmlToJsonController {
    
    private $cache;
    
    public function __construct(Cache $cache)
    {
        $this->cache = $cache;
    }
    
    public function getHtmlAsJson($label, $url)
    {
        if ($this->cache->isCached($label)) {
            return $this->cache->getCache($label);
        }
        $html = $this->cache->doCurl($url);
        $json = $this->htmlToJson($html);
        $this->cache->setCache($label, $json);

        return $json;
    }
    
    private function htmlToJson($html)
    {
        $search = [
        '/\>[^\S ]+/s',
        '/[^\S ]+\</s',
        '/(\s)+/s',
        '/<img[^>]+\>/i'
        ];
        $replace = [
            '>',
            '<',
            '\\1',
            ''
        ];
        $html = preg_replace($search, $replace, $html);
        return json_encode(['html' => $html]);
    }
    
}