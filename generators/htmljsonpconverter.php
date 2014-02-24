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
    $func = preg_replace('/[^a-zA-Z0-9]/', '', $source);
    var_dump($source, $dest, $func);
    $content = file_get_contents($source);
    $content = nl2br($content);
    $content = json_encode(array('content' => $content, JSON_UNESCAPED_UNICODE));
    echo $content;
    exit();
    $content = "{$func}(". json_encode(array('content' => $content, JSON_UNESCAPED_UNICODE)) .");";
    file_put_contents($dest, $content);
}