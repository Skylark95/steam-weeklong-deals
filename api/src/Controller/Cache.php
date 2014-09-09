<?php
namespace Skylark95\SteamWeeklongDeals\Controller;
use Respect\Rest\Routable;

class Cache extends AbstractController implements Routable, Validatable {
    
    private $key = 'pwd';
    private $cachePath;
    
    public function __construct($key, $cachePath)
    {
        $this->key = $key;
        $this->cachePath = $cachePath;
    }
    
    public function isValid(array $args)
    {
        return isset($args['key']) && $args['key'] === $this->key;
    }
    
    public function delete()
    {
        if ($this->isValid($_GET)) {
            return $this->emptyCache();
        }
        parent::badRequest();
    }
    
    private function emptyCache()
    {
        $results = [];
        $files = glob("{$this->cachePath}/*");

        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
                $results[] = basename($file);
            }
        }

        return json_encode(['deleted' => $results]);
    }
    
}
