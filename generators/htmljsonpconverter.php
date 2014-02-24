<?php

ob_implicit_flush(true);
chdir('../');

$dir = new RecursiveDirectoryIterator('data');


$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator('data'));
while ($it->valid()) {

    if (!$it->isDot()) {
        if (preg_match('/.*\.html/', $it->key())) {
            convert2Jsonp($it->key());
        }
    }

    $it->next();
}


function convert2Jsonp($source)
{
    $dest = preg_replace('/\.html/', '.js', $source);
    $func = preg_replace('/[^a-zA-Z0-9]/', '', str_replace('.html', '', $source));
    var_dump($source, $dest, $func);
    $content = file_get_contents($source);
    $content = nl2br($content);
    $array = array('content' => $content);
//    $array = array_map('htmlentities', $array);
    $content = json_encode($array, JSON_UNESCAPED_UNICODE);
    $content = "{$func}({$content});";
    $content = str_replace('.json', '.js', $content);
    $content = str_replace('.html', '.js', $content);
    file_put_contents($dest, $content);
}