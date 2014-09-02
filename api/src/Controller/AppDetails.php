<?php
namespace Skylark95\SteamWeeklongDeals\Controller;
use Respect\Rest\Routable;

class AppDetails extends HtmlToJsonController implements Routable {
    
    public function get($appId)
    {
        return parent::getHtmlAsJson('appdetails-' . $appId, 'http://store.steampowered.com/apphover/' . $appId);
    }
    
}
