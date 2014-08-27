<?php
    function page($value) {
        return isset($_GET['page']) && $_GET['page'] === $value;
    }
    
    /**
     * http://bavotasan.com/2009/using-php-to-remove-an-html-tag-from-a-string/
     */
    function strip_img($html) {
        return preg_replace("/<img[^>]+\>/i", "", $html);
    }

    function get_page($page, $url, $cache) {
        if ($data = $cache->get_cache($page)) {
            return $data;
        }
        
        $data = $cache->do_curl($url);
        $data = strip_img($data);
        $cache->set_cache($page, $data);
        
        return $data;
    }
?>