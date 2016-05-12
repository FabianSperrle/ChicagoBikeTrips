<?php

namespace ChicagoBikeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Station
 *
 * @ORM\Table(name="station")
 * @ORM\Entity(repositoryClass="ChicagoBikeBundle\Repository\StationRepository")
 */
class Station
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=80)
     */
    private $name;

    /**
     * @var float
     *
     * @ORM\Column(name="latitude", type="float")
     */
    private $latitude;

    /**
     * @var float
     *
     * @ORM\Column(name="longitude", type="float")
     */
    private $longitude;

    /**
     * @var int
     *
     * @ORM\Column(name="dpcapacity", type="integer")
     */
    private $dpcapacity;

    /**
     * @var int
     *
     * @ORM\Column(name="landmark", type="integer")
     */
    private $landmark;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="online_date", type="date")
     */
    private $onlineDate;


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
     * Set id
     *
     * @param integer $id
     *
     * @return Station
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Station
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set latitude
     *
     * @param float $latitude
     *
     * @return Station
     */
    public function setLatitude($latitude)
    {
        $this->latitude = $latitude;

        return $this;
    }

    /**
     * Get latitude
     *
     * @return float
     */
    public function getLatitude()
    {
        return $this->latitude;
    }

    /**
     * Set longitude
     *
     * @param float $longitude
     *
     * @return Station
     */
    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;

        return $this;
    }

    /**
     * Get longitude
     *
     * @return float
     */
    public function getLongitude()
    {
        return $this->longitude;
    }

    /**
     * Set dpcapacity
     *
     * @param integer $dpcapacity
     *
     * @return Station
     */
    public function setDpcapacity($dpcapacity)
    {
        $this->dpcapacity = $dpcapacity;

        return $this;
    }

    /**
     * Get dpcapacity
     *
     * @return int
     */
    public function getDpcapacity()
    {
        return $this->dpcapacity;
    }

    /**
     * Set landmark
     *
     * @param integer $landmark
     *
     * @return Station
     */
    public function setLandmark($landmark)
    {
        $this->landmark = $landmark;

        return $this;
    }

    /**
     * Get landmark
     *
     * @return int
     */
    public function getLandmark()
    {
        return $this->landmark;
    }

    /**
     * Set onlineDate
     *
     * @param \DateTime $onlineDate
     *
     * @return Station
     */
    public function setOnlineDate($onlineDate)
    {
        $this->onlineDate = $onlineDate;

        return $this;
    }

    /**
     * Get onlineDate
     *
     * @return \DateTime
     */
    public function getOnlineDate()
    {
        return $this->onlineDate;
    }
}

