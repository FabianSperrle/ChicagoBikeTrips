<?php

namespace ChicagoBikeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Bike
 *
 * @ORM\Table(name="bike")
 * @ORM\Entity(repositoryClass="ChicagoBikeBundle\Repository\BikeRepository")
 * @ORM\Table(indexes={@ORM\Index(name="station_idx", columns={"stationid"})})
 */
class Bike
{
    /**
     * @var int
     *
     * @ORM\Column(type="integer")
     * @ORM\Id()
     * @ORM\GeneratedValue()
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\Column(name="bikeid", type="integer")
     */
    private $bikeid;

    /**
     * @var int
     *
     * @ORM\Column(name="stationid", type="integer")
     */
    private $stationid;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="starttime", type="datetime")
     */
    private $starttime;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="endtime", type="datetime", nullable=true)
     */
    private $endtime;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set bikeid
     *
     * @param integer $bikeid
     *
     * @return Bike
     */
    public function setBikeid($bikeid)
    {
        $this->bikeid = $bikeid;

        return $this;
    }

    /**
     * Get bikeid
     *
     * @return int
     */
    public function getBikeid()
    {
        return $this->bikeid;
    }

    /**
     * Set stationid
     *
     * @param integer $stationid
     *
     * @return Bike
     */
    public function setStationid($stationid)
    {
        $this->stationid = $stationid;

        return $this;
    }

    /**
     * Get stationid
     *
     * @return int
     */
    public function getStationid()
    {
        return $this->stationid;
    }

    /**
     * Set starttime
     *
     * @param \DateTime $starttime
     *
     * @return Bike
     */
    public function setStarttime($starttime)
    {
        $this->starttime = $starttime;

        return $this;
    }

    /**
     * Get starttime
     *
     * @return \DateTime
     */
    public function getStarttime()
    {
        return $this->starttime;
    }

    /**
     * Set endtime
     *
     * @param \DateTime $endtime
     *
     * @return Bike
     */
    public function setEndtime($endtime)
    {
        $this->endtime = $endtime;

        return $this;
    }

    /**
     * Get endtime
     *
     * @return \DateTime
     */
    public function getEndtime()
    {
        return $this->endtime;
    }
}

