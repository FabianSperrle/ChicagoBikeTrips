<?php
/**
 * Created by IntelliJ IDEA.
 * User: fabian
 * Date: 25/05/16
 * Time: 18:43
 */

namespace ChicagoBikeBundle\Type;

class MyDateTime extends \DateTime
{
    public function __toString()
    {
        return $this->format('Y-m-d H:i:s');
    }
}

