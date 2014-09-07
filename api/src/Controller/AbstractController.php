<?php
namespace Skylark95\SteamWeeklongDeals\Controller;

abstract class AbstractController {
    
    protected function status($code)
    {
        header("HTTP/1.1 {$code}");
    }
    
    protected function badRequest()
    {
        $this->status(400);
        return $this->jsonEncode(['status' => 'HTTP/1.1 400 Bad Request']);
    }
    
    protected function jsonEncode(array $array)
    {
        return json_encode($array);
    }
    
}
