<?php


/**
 * Class PolyConverter version 3.1
 * Uses http://guilhermemussi.com/conversor.html converted svg file as source
 * Converts into multipolies
 */
class PolyConverter
{
    const PRECISION = 4;

    protected $polygonShapes = array();
    protected static $ax = 0.01663;
    protected static $ay = 0.01292;
    protected static $dx = 52.396;
    protected static $dy = 42.803;
//    protected static $dy = 42.9; // used for max lat defect detection

    protected static $maxLat = 42.793;
    protected static $minLat = 35.14;
    protected static $middleLat = 39;
    protected static $maxLatDefect = 0.120;

    protected $summary = array(
        "Марыйский_велаят",
        "Дашогузский_велаят",
        "Лебапский_велаят",
        "Балканский_велаят",
        "Ахалский_велаят",
        "Ашхабад",
        "Балканабад",
        "Дашогуз",
        "Туркменабад",
        "Мары",
        51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
    );

    protected $mapping = array(
        "Марыйский_велаят" => "mariyskiy",
        "mv" => "mariyskiy",
        "Дашогузский_велаят" => "dashoguzskiy",
        "dv" => "dashoguzskiy",
        "Лебапский_велаят" => "lebapskiy",
        "lv" => "lebapskiy",
        "Балканский_велаят" => "balkanskiy",
        "bv" => "balkanskiy",
        "Ахалский_велаят" => "ahalskiy",
        "av" => "ahalskiy",
        "Ашхабад" => "ashhabad",
        "ash" => "ashhabad",
        "Балканабад" => "balkanabad",
        "Дашогуз" => "dashoguz",
        "Туркменабад" => "turkmenabad",
        "Мары" => "mari",
    );

    protected $titleMapping = array();

    protected $info = array();

    public function extractShapesFrom($source)
    {
        $counter = 0; // Counter will be used to keep track of shape number which is used to divide velayats and etraps
        $lines = file($source);
        foreach ($lines as $line) {
            if (!preg_match_all('/points=\"([^")]+)\"/', $line, $matches)) {
                continue;
            }
            $shapes = array();
            // Loop though polygons on this line
            for ($i = 0; $i < count($matches[1]); $i++) {
                // Loop though points of the polygon
                $data = array();
                foreach (explode(' ', $matches[1][$i]) as $pair) {
                    $values = explode(',', $pair);

                    $lat = self::$dy - self::$ay * $values[1];
                    $lng = self::$dx + self::$ax * $values[0];

                    // apply lat defect
                    if ($lat > self::$middleLat) {
                        $tmp = self::$maxLat - self::$middleLat;
                    } else {
                        $tmp = self::$middleLat - self::$minLat;
                    }
                    $lat += pow(min(abs($lat - self::$minLat), abs($lat - self::$maxLat)) / $tmp, 0.75) * self::$maxLatDefect;

                    $lat = round($lat, self::PRECISION);
                    $lng = round($lng, self::PRECISION);

                    $data[] = array($lat, $lng);
                }
                /*
                $data now contains some shape.
                We need to find out if it is a island shape or a hole in original shape
                Simply put, all velayats should be at the top and the have no island shapes
                */
                if ($i == 0) {
                    // this is first shape anyway
                    $shapes[0] = array($data);
                } else if ($counter < 8) {
                    // we are working with velayat - this is a hole
                    $shapes[0][] = $data;
                } else {
                    // we are working with etrap - this is island shape
                    $shapes[] = array($data);
                }
            }

            $this->polygonShapes[] = $shapes;
        }
    }

    public function extractInfoFrom($source)
    {
        $data = simplexml_load_file($source);
        if (isset($data->info->etrap)) {
            foreach ($data->info->etrap as $etrap) {
                $etrap->addAttribute('type', 'etrap');
                $this->info['etrap-' . (string)$etrap->attributes()->id] = $etrap;
            }
        } else if (isset($data->info->velaiat)) {
            foreach ($data->info->velaiat as $velaiat) {
                $velaiat->addAttribute('type', 'welayat');
                $this->info[$this->mapping[(string)$velaiat->attributes()->id]] = $velaiat;
            }
        }
    }

    public function getFormattedObject()
    {
        $result = new stdClass();
        $result->items = array();
        foreach ($this->polygonShapes as $polygon) {
            $tmp = new stdClass();
            $regionTitle = array_shift($this->summary);
            if (isset($this->mapping[$regionTitle])) {
                // this is welayat
                $tmp->name = $this->mapping[$regionTitle];
                // Get nice title
                if (isset($this->info[$tmp->name])) {
                    $tmp->title = (string) $this->info[$tmp->name]->name;
                    $tmp->descriptionSource = 'data/descriptions/welayats/' . $tmp->name . '.html';
                }
            } else {
                // this is etrap
                $tmp->name = "etrap-{$regionTitle}";
                // Get nice title
                if (isset($this->info["etrap-" . str_pad($regionTitle, 3, '0', STR_PAD_LEFT)])) {
                    $tmp->title = (string) $this->info["etrap-" . str_pad($regionTitle, 3, '0', STR_PAD_LEFT)]->name;
                    $tmp->descriptionSource = 'data/descriptions/welayats/' . str_pad($regionTitle, 3, '0', STR_PAD_LEFT) . '.html';
                }
            }
            $tmp->shape = $polygon;


            $result->items[] = $tmp;
        }

        return $result;
    }

    protected function dumpToFile($object, $filename)
    {
        file_put_contents($filename, $this->encode($object));
    }


    public function showRegionsJSON()
    {
        echo $this->encode($this->getFormattedObject());
    }

    public function dumpShapes()
    {
        $this->dumpToFile($this->getFormattedObject(), '../data/regions3.json');
    }

    public function dumpInfos()
    {
        foreach ($this->info as $object) {
            if ((string)$object->attributes()->type == 'welayat') {
                $filename = '../data/descriptions/welayats/' . $this->mapping[(string)$object->attributes()->id] . '.html';
            } else {
                $filename = '../data/descriptions/etraps/' . (string)$object->attributes()->id . '.html';
            }
            file_put_contents($filename, (string)$object->information);
        }
    }

    protected function encode ($object)
    {
        $str = json_encode($object);
        // Convert ё to temporary char
        $str = str_replace('\u0451', "###yo###", $str);
        $str = str_replace('\u0401', "###YO###", $str);

        // This will make string cp1251
        $str = preg_replace_callback('/\\\u([a-f0-9]{4})/i', create_function('$m', 'return chr(hexdec($m[1])-1072+224);'), $str);
        // This will bring it back to utf
        $str = iconv('cp1251', 'utf-8', $str);

        $str = str_replace("###yo###", 'ё', $str);
        $str = str_replace("###YO###", 'Ё', $str);

        $str = str_replace("\\/", "/", $str);

        return $str;
    }
}


$converter = new PolyConverter();
$converter->extractShapesFrom('../assets/etraps.poly-converted.svg');
$converter->extractInfoFrom('../assets/etrap_info.xml');
$converter->extractInfoFrom('../assets/velaiat_info.xml');

//$converter->dumpInfos();
//$converter->dumpShapes();

$converter->showRegionsJSON();