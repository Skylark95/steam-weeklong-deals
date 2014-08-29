<?php

function is_clear_cache()
{
    return isset($_GET[EMPTY_CACHE]) && $_GET[EMPTY_CACHE] === 'true' && isset($_GET[KEY]) && $_GET[KEY] === KEY_VALUE;
}

function do_clear_cache()
{
    $results = [];
    $files = glob('cache/*');

    foreach ($files as $file) {
        if (is_file($file)) {
            unlink($file);
            $results[] = $file;
        }
    }

    return json_encode(['deleted' => $results]);
}

function is_page($value)
{
    return isset($_GET[PAGE]) && $_GET[PAGE] === $value;
}

/**
 * http://jesin.tk/how-to-use-php-to-minify-html-output/
 * http://bavotasan.com/2009/using-php-to-remove-an-html-tag-from-a-string/
 */
function html_to_json($html)
{
    $search = [
        '/\>[^\S ]+/s',
        '/[^\S ]+\</s',
        '/(\s)+/s',
        '/<img[^>]+\>/i'
    ];
    $replace = [
        '>',
        '<',
        '\\1',
        ''
    ];
    $html = preg_replace($search, $replace, $html);
    return json_encode(['html' => $html]);
}

function get_page($page, $url, $cache)
{
    if ($data = $cache->get_cache($page)) {
        return $data;
    }

    $html = $cache->do_curl($url);
    $json = html_to_json($html);
    $cache->set_cache($page, $json);

    return $json;
}

function bad_request()
{
    http_response_code(400);
    return json_encode(['status' => 'HTTP/1.1 400 Bad Request']);
}