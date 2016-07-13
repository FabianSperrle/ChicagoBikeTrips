<?php

namespace ChicagoBikeBundle\Controller;

use ChicagoBikeBundle\Entity\Station;
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
     * @Route("stations/top5/{from}/{to}/{limit}",
     *     name="top5_per_day",
     *     requirements={"from": "\d+", "to": "\d+", "limit": "\d+"},
     *     options={"expose": true})
     * @param $from
     * @param $to
     * @param $limit
     * @return JsonResponse
     * @internal param $timestamp
     */
    public function top5_per_day($from, $to, $limit) {
        $conn = $this->get('database_connection');
        $query = $conn->prepare("SELECT station, SUM(popularity) FROM popularity WHERE extract(epoch from date) BETWEEN :from AND :to GROUP BY station ORDER BY SUM(popularity) DESC LIMIT :limit");
        $query->bindParam(':from', $from);
        $query->bindParam(':to', $to);
        $query->execute([
            ':from' => $from,
            ':to' => $to,
            ':limit' => $limit
        ]);
        $json = $query->fetchAll();
        
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
