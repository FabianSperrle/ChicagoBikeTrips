<?php

namespace ChicagoBikeBundle\Controller;

use ChicagoBikeBundle\Entity\Station;
use DateTime;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class StationController extends Controller
{

    /**
     * @Route("stations/", name="list_stations", options={"expose": true})
     */
    public function listAction() {
        $em = $this->getDoctrine()->getManager();
        $stations = $em->getRepository('ChicagoBikeBundle:Station')->findAll();

        $serializer = $this->get('serializer');
        $json = $serializer->serialize($stations, 'json');
        
        return $this->render('ChicagoBikeBundle:station:list.html.twig', compact('json'));
    }

    /**
     * @Route("stations/top5/{timestamp}", name="top5_per_day", options={"expose": true})
     * @param $timestamp
     */
    public function top5_per_day($timestamp) {
        $conn = $this->get('database_connection');
        $timestamp = (new DateTime())->setTimestamp($timestamp)->setTime(20, 0, 0)->getTimestamp();
        $query = $conn->prepare("SELECT date, rank1, rank2, rank3, rank4, rank5
                        FROM top5_stations_per_day
                        WHERE extract (epoch from date) = ?");
        $query->bindParam(1, $timestamp);
        $query->execute();
        $json = $query->fetchAll();
        
        if (count($json) == 0) {
            throw new \InvalidArgumentException("Time stamp invalid or out of range");
        }
        
        return new JsonResponse($json);
    }

    /**
     * @Route("stations/{id}")
     *
     * @param Station $station
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getAction(Station $station) {
        $serializer = $this->get('serializer');
        $json = $serializer->serialize($station, 'json');
        
        return $this->render('ChicagoBikeBundle:station:list.html.twig', compact('json'));
    }

    /**
     * @Route("/idle_bike_count/{time}", requirements={"time": "\d+"})
     * @param $time
     * @return JsonResponse
     */
    public function idleBikeCountAction($time)
    {
        $conn = $this->get('database_connection');

        $stmt = $conn->prepare("SELECT s.id, coalesce(b.count, 0) AS count
        FROM station s
        LEFT JOIN (
            SELECT stationid, COUNT(*) AS count
            FROM bike b 
            WHERE starttime < to_timestamp(:time) AND endtime > to_timestamp(:time) 
            GROUP BY stationid
        ) b
        ON b.stationid = s.id");
        $stmt->bindValue(':time', $time);
        $stmt->execute();

        return new JsonResponse($stmt->fetchAll());
    }
}
