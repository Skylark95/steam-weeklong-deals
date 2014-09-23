<?php
namespace Skylark95\SteamWeeklongDeals\Controller;
use Respect\Rest\Routable;

class SaleWeeklongDeals extends HtmlToJsonController implements Routable, Validatable {
    
    public function isValid(array $args)
    {
        return preg_match('/^[0-9]*$/', $args['page']) !== 0;
    }
    
    public function get($page)
    {
        if ($this->isValid(['page' => $page])) {
            return parent::getHtmlAsJson(
                "sale-weeklongdeals-{$page}",
                "http://store.steampowered.com/search/?filter=weeklongdeals&page={$page}",
                '#search_result_container'
            );
        }
        return parent::badRequest();
    }
    
}
