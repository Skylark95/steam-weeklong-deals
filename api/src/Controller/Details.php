<?php
namespace Skylark95\SteamWeeklongDeals\Controller;
use Respect\Rest\Routable;

class Details extends HtmlToJsonController implements Routable, Validatable {
    
    public function isValid(array $args)
    {
        return ($args['type'] === 'app' || $args['type'] === 'sub')
            && preg_match('/^[0-9]*$/', $args['id']) !== 0;
    }
    
    public function get($type, $id)
    {
        if ($this->isValid(['type' => $type, 'id' => $id])) {
            return parent::getHtmlAsJson("details-{$type}-{$id}", "http://store.steampowered.com/{$type}hover/{$id}");
        }
        return parent::badRequest();
    }
    
}
