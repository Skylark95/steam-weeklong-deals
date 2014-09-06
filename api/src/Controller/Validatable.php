<?php
namespace Skylark95\SteamWeeklongDeals\Controller;
use Respect\Rest\Routable;

interface Validatable {
    
    public function isValid(array $args);
    
}
