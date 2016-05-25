<?php

namespace ChicagoBikeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\ManyToOne as ManyToOne;
use Doctrine\ORM\Mapping\JoinColumn as JoinColumn;

/**
 * Trip
 *
 * @ORM\Table(name="trip")
 * @ORM\Entity(repositoryClass="ChicagoBikeBundle\Repository\TripRepository")
 */
class Trip
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     */
    private $id;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="starttime", type="mydatetime")
     */
    private $starttime;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="endtime", type="mydatetime")
     */
    private $endtime;

    /**
     * @var int
     *
     * @ORM\Column(name="bikeid", type="integer")
     */
    private $bikeid;

    /**
     * @var int
     *
     * @ORM\Column(name="tripduration", type="integer")
     */
    private $tripduration;

    /**
     * @var int
     *
     * @ManyToOne(targetEntity="Station")
     * @JoinColumn(name="fromStation", referencedColumnName="id")
     */
    private $fromStation;

    /**
     * @var int
     *
     * @ManyToOne(targetEntity="Station")
     * @JoinColumn(name="toStation", referencedColumnName="id")
     */
    private $toStation;

    /**
     * @var string
     *
     * @ORM\Column(name="usertype", type="string", length=30)
     */
    private $usertype;

    /**
     * @var string
     *
     * @ORM\Column(name="gender", type="string", length=6, nullable=true)
     */
    private $gender;

    /**
     * @var int
     *
     * @ORM\Column(name="birthday", type="integer", nullable=true)
     */
    private $birthday;


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
     * Set tripID
     *
     * @param integer $tripID
     *
     * @return Trip
     */
    public function setId($tripID)
    {
        $this->id = $tripID;

        return $this;
    }

    /**
     * Set starttime
     *
     * @param \DateTime $starttime
     *
     * @return Trip
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
     * @return Trip
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

    /**
     * Set bikeid
     *
     * @param integer $bikeid
     *
     * @return Trip
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
     * Set tripduration
     *
     * @param integer $tripduration
     *
     * @return Trip
     */
    public function setTripduration($tripduration)
    {
        $this->tripduration = $tripduration;

        return $this;
    }

    /**
     * Get tripduration
     *
     * @return int
     */
    public function getTripduration()
    {
        return $this->tripduration;
    }

    /**
     * Set fromStation
     *
     * @param integer $fromStation
     *
     * @return Trip
     */
    public function setFromStation($fromStation)
    {
        $this->fromStation = $fromStation;

        return $this;
    }

    /**
     * Get fromStation
     *
     * @return int
     */
    public function getFromStation()
    {
        return $this->fromStation;
    }

    /**
     * Set toStation
     *
     * @param integer $toStation
     *
     * @return Trip
     */
    public function setToStation($toStation)
    {
        $this->toStation = $toStation;

        return $this;
    }

    /**
     * Get toStation
     *
     * @return int
     */
    public function getToStation()
    {
        return $this->toStation;
    }

    /**
     * Set usertype
     *
     * @param string $usertype
     *
     * @return Trip
     */
    public function setUsertype($usertype)
    {
        $this->usertype = $usertype;

        return $this;
    }

    /**
     * Get usertype
     *
     * @return string
     */
    public function getUsertype()
    {
        return $this->usertype;
    }

    /**
     * Set gender
     *
     * @param string $gender
     *
     * @return Trip
     */
    public function setGender($gender)
    {
        $this->gender = $gender;

        return $this;
    }

    /**
     * Get gender
     *
     * @return string
     */
    public function getGender()
    {
        return $this->gender;
    }

    /**
     * Set birthday
     *
     * @param integer $birthday
     *
     * @return Trip
     */
    public function setBirthday($birthday)
    {
        $this->birthday = $birthday;

        return $this;
    }

    /**
     * Get birthday
     *
     * @return int
     */
    public function getBirthday()
    {
        return $this->birthday;
    }
}

