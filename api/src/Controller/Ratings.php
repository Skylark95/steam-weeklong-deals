<?php
namespace Skylark95\SteamWeeklongDeals\Controller;
use Respect\Rest\Routable;

class Ratings extends HtmlToJsonController implements Routable, Validatable {
    
    public function isValid(array $args)
    {
        return preg_match('/^[0-9]*$/', $args['appId']) !== 0;
    }
    
    public function get($appId)
    {
        if ($this->isValid(['appId' => $appId])) {
            return $this->getRatings($appId);
        }
        return parent::badRequest();
    }
    
    private function getRatings($appId)
    {
        $label = "rating-app-{$appId}";
        $json = parent::getCache($label);
        
        if (!$json) {
            $ratings = [
                'cached' => true,
                'ratings' => [
                    $this->getRating($appId, 0, 1),
                    $this->getRating($appId, 10, 2),
                    $this->getRating($appId, 20, 3),
                    $this->getRating($appId, 30, 4),
                    $this->getRating($appId, 40, 5)
                ]
            ];
            parent::setCache($label, parent::jsonEncode($ratings));
            $ratings['cached'] = false;
            $json = parent::jsonEncode($ratings);
        }
        
        return $json;
    }
    
    private function getRating($appId, $offset, $page)
    {
        $url = "http://steamcommunity.com/app/{$appId}/homecontent/"
             . "?userreviewsoffset={$offset}&p={$page}&itemspage=10&appHubSubSection=10&browsefilter=toprated";
        return [
            'page' => $page,
            'html' => parent::getFilteredHtml($url, 'div.title')
        ];
    }
    
}
