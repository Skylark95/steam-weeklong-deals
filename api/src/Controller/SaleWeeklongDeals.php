<?php
namespace Skylark95\SteamWeeklongDeals\Controller;
use Respect\Rest\Routable;

class SaleWeeklongDeals extends HtmlToJsonController implements Routable {
    
    public function get()
    {
        return parent::getHtmlAsJson('weeklongdeals', 'http://store.steampowered.com/sale/Weeklong_Deals');
    }
    
}
