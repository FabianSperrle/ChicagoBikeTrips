<?php

namespace ChicagoBikeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * BikeRelocation
 *
 * @ORM\Table(name="bike_relocation")
 * @ORM\Entity(repositoryClass="ChicagoBikeBundle\Repository\BikeRelocationRepository")
 */
class BikeRelocation
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
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
     * @ORM\Column(name="fromstation", type="integer")
     */
    private $fromstation;

    /**
     * @var int
     *
     * @ORM\Column(name="tostation", type="integer")
     */
    private $tostation;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="starttime", type="datetime")
     */
    private $starttime;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="endtime", type="datetime")
     */
    private $endtime;


    /**
     * Get id
     *
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
     * @return BikeRelocation
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
     * Set fromstation
     *
     * @param integer $fromstation
     *
     * @return BikeRelocation
     */
    public function setFromstation($fromstation)
    {
        $this->fromstation = $fromstation;

        return $this;
    }

    /**
     * Get fromstation
     *
     * @return int
     */
    public function getFromstation()
    {
        return $this->fromstation;
    }

    /**
     * Set tostation
     *
     * @param integer $tostation
     *
     * @return BikeRelocation
     */
    public function setTostation($tostation)
    {
        $this->tostation = $tostation;

        return $this;
    }

    /**
     * Get tostation
     *
     * @return int
     */
    public function getTostation()
    {
        return $this->tostation;
    }

    /**
     * Set starttime
     *
     * @param \DateTime $starttime
     *
     * @return BikeRelocation
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
     * @return BikeRelocation
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

