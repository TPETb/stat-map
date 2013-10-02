<?php

$result = array(
        );
define("STEP_COUNT", 10);
define("START", 110);
define("FINISH", 120);

$step = (FINISH - START) / STEP_COUNT;
$fix = $step / 1000;

for ($j = 1, $i = START; $i < FINISH; $i += $step) {
    $tmp = new stdClass();
    $tmp->min = $i;
    $tmp->max = $i + $step - $fix;
    $tmp->label = "From " . ($i) . " to " . ($i + $step);
    $tmp->rate = $j++;
    
    $result[] = $tmp;
}

$json = json_encode($result);
$json = html_entity_decode($json);  
echo $json;