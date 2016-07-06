<?php

namespace ChicagoBikeBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class TripController
 */
class TripController extends Controller
{
    /**
     * @Route("/trips/per_day", name="trips_per_day", options={"expose": true})
     * @return JsonResponse
     */
    public function tripsPerDayAction()
    {
        $conn = $this->get('database_connection');
        $data = $conn->executeQuery('SELECT day, customers, subscribers FROM trips_per_day')->fetchAll();

        return new JsonResponse($data);
    }
    
    /**
     * @Route("/trips/per_week", name="trips_per_week", options={"expose": true})
     * @return JsonResponse
     */
    public function tripsPerWeekAction()
    {
        $conn = $this->get('database_connection');
        $data = $conn->executeQuery('SELECT cast(extract(EPOCH FROM week) AS INTEGER) AS week, customers, subscribers FROM trips_per_week')->fetchAll();

        return new JsonResponse($data);
    }

    /**
     * @Route("/trips/top/{amount}", requirements={"amount": "\d+"}, name="top_trips", options={"expose": true})
     */
    public function topTripsAction($amount)
    {
        $conn = $this->get('database_connection');
        $query = $conn->prepare('SELECT s_from.latitude from_lat, s_from.longitude from_long, s_to.latitude to_lat, s_to.longitude to_long FROM (
            SELECT tt.fromstation, tt.tostation, SUM(tt.count) AS count
            FROM top_trips_per_month tt
            WHERE fromstation != tostation
            GROUP BY fromstation, tostation
            ORDER BY count DESC
            LIMIT :limit) AS t
            LEFT JOIN station s_from ON s_from.id = t.fromstation
            LEFT JOIN station s_to ON s_to.id = t.tostation
            ORDER BY t.count DESC');
        $query->execute([
            ':limit' => $amount
        ]);
        $data = $query->fetchAll();

        return new JsonResponse($data);
    }

    /**
     * @Route("/trips/top/{amount}/{timestamp}", requirements={"amount": "\d+", "timestamp": "\d+"}, name="top_trips_per_month", options={"expose": true})
     */
    public function topTripsPerMonthAction($amount, $timestamp)
    {
        $conn = $this->get('database_connection');
        $timestamp = (new \DateTime())
            ->setTimestamp($timestamp)
            ->setTimezone(new \DateTimeZone('UTC'))
            ->setTime(0, 0, 0)
            ->modify("first day of this month")
            ->getTimestamp();
        $query = $conn->prepare('SELECT s_from.latitude from_lat, s_from.longitude from_long, s_to.latitude to_lat, s_to.longitude to_long
FROM top_trips_per_month tt
LEFT JOIN station s_from ON s_from.id = tt.fromstation
LEFT JOIN station s_to ON s_to.id = tt.tostation
WHERE fromstation != tostation AND extract(EPOCH FROM month) = :month
ORDER BY count DESC
LIMIT :limit');
        $query->execute([
            ':limit' => $amount,
            ':month' => $timestamp
        ]);
        $data = $query->fetchAll();

        return new JsonResponse($data);
    }

    /**
     * @Route("/trips/statistics/length", name="avg_trip_length", options={"expose": true})
     */
    public function getAverageTripLength() {
        $conn = $this->get('database_connection');
        $query = $conn->executeQuery("select * 
from crosstab(\$\$select extract (epoch from date_trunc)::text as month, usertype, (date_part('minutes', avg) + (date_part('seconds', avg) / 60))::text
		from avg_trip_length
		order by 1,2\$\$)
as ct(Month text , Customer text, Subscriber text)
");
        $data = $query->fetchAll();
        
        return new JsonResponse($data);
    }

    /**
     * @Route("/trips/statistics/roundtrips", name="round_trip", options={"expose": true})
     * @return JsonResponse
     */
    public function getRoundTripPercentage() {
        $data = [];

        $data['subscribers'] = round(34382 / 2066429 * 100, 2);
        $data['customers'] = round(104481 / 1147992 * 100, 2);
        
        return new JsonResponse($data);
    }

    /**
     * @Route("/relocation/top_from/{limit}", name="relocation_top_from", options={"expose": true})
     */
    public function getRelocationTopFromAction($limit)
    {
        $conn = $this->get('database_connection');
        $result = $conn->executeQuery(<<<SQL
SELECT fromstation, COUNT(*) AS count 
FROM bike_relocation r
GROUP BY fromstation
ORDER BY count DESC
LIMIT :limit
SQL
            , [':limit' => $limit]);
        return new JsonResponse($result->fetchAll());
    }

    /**
     * @Route("/relocation/top_to/{limit}", name="relocation_top_to", options={"expose": true})
     */
    public function getRelocationTopToAction($limit)
    {
        $conn = $this->get('database_connection');
        $result = $conn->executeQuery(<<<SQL
SELECT tostation, COUNT(*) AS count 
FROM bike_relocation r
GROUP BY tostation
ORDER BY count DESC
LIMIT :limit
SQL
            , [':limit' => $limit]);
        return new JsonResponse($result->fetchAll());
    }

    /**
     * @Route("/trips/top/range/{from}/{to}", requirements={"from": "\d+", "to": "\d+"})
     * @param Request $request
     * @param $from
     * @param $to
     * @return JsonResponse
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getTopTripsInRange(Request $request, $from, $to)
    {
        $threshold = $request->query->getInt('threshold');
        $start = new \DateTime();
        $start->setTimestamp($from)
            ->setTimezone(new \DateTimeZone('UTC'))
            ->setTime(0,0,0);

        $end = new \DateTime();
        $end->setTimestamp($to)
            ->setTimezone(new \DateTimeZone('UTC'))
            ->setTime(0,0,0)
            ->modify('+1 day');

        $conn = $this->get('database_connection');

        $q = $conn->prepare('SELECT fromstation, tostation, SUM(subscriber) AS subscriber, SUM(customer) AS customer
FROM top_trips_per_day
WHERE day BETWEEN :start AND :end
GROUP BY fromstation, tostation HAVING SUM(subscriber)+SUM(customer) >= :threshold
ORDER BY subscriber+customer DESC');
        $q->execute([
            ':start' => $start->format('Y-m-d'),
            ':end' => $end->format('Y-m-d'),
            ':threshold' => $threshold
        ]);
        return new JsonResponse($q->fetchAll());
    }
}
