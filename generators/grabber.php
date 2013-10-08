<?php


class Grabber
{
    static protected $path = "../tiles/";
    static protected $source = "http://a.tile.cloudmade.com/674ae0a3d72a4dd7a8dcdefb608302a3/997/256/{z}/{x}/{y}.png";
    static protected $storePath = "{z}/{x}/{y}.png";

    /**
     * @param int $z - zoom level
     * @param array $xLim
     * @param array $yLim
     * @return bool
     */
    public function grab($z, array $xLim, array $yLim)
    {
        for ($x = $xLim[0]; $x <= $xLim[1]; $x++) {
            for ($y = $yLim[0]; $y <= $yLim[1]; $y++) {
                $link = self::$source;
                $link = str_replace('{x}', $x, $link);
                $link = str_replace('{y}', $y, $link);
                $link = str_replace('{z}', $z, $link);

                $storeTo = self::$storePath;
                $storeTo = str_replace('{x}', $x, $storeTo);
                $storeTo = str_replace('{y}', $y, $storeTo);
                $storeTo = str_replace('{z}', $z, $storeTo);

                print_r(array("from" => $link, "to" => $storeTo));
//                continue;

                $this->store($storeTo, file_get_contents($link));
            }
        }

        return true;
    }

    protected function store($filename, $content)
    {
        $filename = ltrim($filename, '/');

        $chunks = explode('/', $filename);

        if (!file_exists(self::$path . $chunks[0])) {
            mkdir(self::$path . $chunks[0]);
        }
        if (!file_exists(self::$path . $chunks[0] . '/' . $chunks[1])) {
            mkdir(self::$path . $chunks[0] . '/' . $chunks[1]);
        }
        if (file_exists(self::$path . $filename)) {
            unlink(self::$path . $filename);
        }

        file_put_contents(self::$path . $filename, $content);
    }
}

$grabber = new Grabber();

//$grabber->grab(6, array(41, 43), array(21, 23));
//$grabber->grab(7, array(82, 87), array(47, 50));
$grabber->grab(8, array(165, 175), array(94, 101));