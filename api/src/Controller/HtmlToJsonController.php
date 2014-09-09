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
    
    protected function getHtmlAsJson($label, $url, $selector = false)
    {
        $json = $this->getCache($label);
        
        if (!$json) {
            $response = ['cached' => true];
            if (!$selector) {
                $response['html'] = $this->getMinifiedHtml($url);
            } else {
                $response['html'] = $this->getFilteredHtml($url, $selector);
            }
            $this->setCache($label, parent::jsonEncode($response));
            $response['cached'] = false;
            $json = parent::jsonEncode($response);
        }
        
        return $json;
    }
    
    protected function getCache($label)
    {
        if ($this->cache->isCached($label)) {
            header('Cached: true');
            return $this->cache->getCache($label);
        }
        header('Cached: false');
        return false;
    }
    
    protected function setCache($label, $json)
    {
        $this->cache->setCache($label, $json);
    }
    
    protected function getHtml($url)
    {
        return $this->cache->doCurl($url);
    }
    
    protected function getFilteredHtml($url, $selector)
    {
        $qp = qp($this->getHtml($url), $selector);
        $html = '';
        foreach ($qp as $item) {
            $html .= $item->html();
        }
        return "<div>{$html}</div>";
    }
    
    protected function getMinifiedHtml($url)
    {
        return preg_replace(static::$searchChars, static::$replaceChars, $this->getHtml($url));
    }
    
}