<?php
/**
 * Created by IntelliJ IDEA.
 * User: fabian
 * Date: 25/05/16
 * Time: 18:44
 */

namespace ChicagoBikeBundle\Type;

use Doctrine\DBAL\Types\DateTimeType;
use Doctrine\DBAL\Platforms\AbstractPlatform;

class MyDateTimeType extends DateTimeType
{
    public function convertToPHPValue($value, AbstractPlatform $platform)
    {
        $dateTime = parent::convertToPHPValue($value, $platform);

        if ( ! $dateTime) {
            return $dateTime;
        }

        return new MyDateTime('@' . $dateTime->format('U'));
    }

    public function getName()
    {
        return 'mydatetime';
    }
}

