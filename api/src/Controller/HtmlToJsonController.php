<?php
namespace Skylark95\SteamWeeklongDeals\Controller;
use Skylark95\SteamWeeklongDeals\Cache\Cache;

abstract class HtmlToJsonController extends AbstractController {
    
    protected static $searchChars = [
        '/\>[^\S ]+/s',
        '/[^\S ]+\</s',
        '/(\s)+/s',
        '/<img[^>]+\>/i'
    ];
    protected static $replaceChars = [
        '>',
        '<',
        '\\1',
        ''
    ];
    
    private $cache;
    
    public function __construct(Cache $cache)
    {
        $this->cache = $cache;
    }
    
    protected function getHtmlAsJson($label, $url)
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
        $html = preg_replace(static::$searchChars, static::$replaceChars, $html);
        return json_encode(['html' => $html]);
    }
    
}