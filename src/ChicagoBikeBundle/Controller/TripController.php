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
     * @Route("/relocation/top_from/{from}/{to}/{limit}", name="relocation_top_from", options={"expose": true})
     */
    public function getRelocationTopFromAction($from, $to, $limit)
    {
        $conn = $this->get('database_connection');
        $result = $conn->executeQuery(<<<SQL
SELECT fromstation AS station, COUNT(*) AS count 
FROM bike_relocation r
WHERE r.starttime BETWEEN :from AND :to
GROUP BY fromstation
ORDER BY count DESC
LIMIT :limit
SQL
            , [
                ':limit' => $limit,
                ':from' => $from,
                ':to' => $to
            ]);
        return new JsonResponse($result->fetchAll());
    }

    /**
     * @Route("/relocation/top_to/{from}/{to}/{limit}", name="relocation_top_to", options={"expose": true})
     */
    public function getRelocationTopToAction($from, $to, $limit)
    {
        $conn = $this->get('database_connection');
        $result = $conn->executeQuery(<<<SQL
SELECT tostation AS station, COUNT(*) AS count 
FROM bike_relocation r
WHERE r.endtime BETWEEN :from AND :to
GROUP BY tostation
ORDER BY count DESC
LIMIT :limit
SQL
            , [
                ':limit' => $limit,
                ':from' => $from,
                ':to' => $to
            ]);
        return new JsonResponse($result->fetchAll());
    }

    /**
     * @Route("/trips/top/range/{from}/{to}",
     *     name="top_trips_in_range",
     *     options={"expose": true},
     *     requirements={"from": "\d+", "to": "\d+"})
     * @param Request $request
     * @param $from
     * @param $to
     * @return JsonResponse
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getTopTripsInRange(Request $request, $from, $to)
    {
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

        $threshold = $request->query->getInt('threshold');
        $thresholdPart = "";
        if ($threshold) {
            $thresholdPart = " HAVING SUM(subscriber)+SUM(customer) >= :threshold";
        }
        
        $limit = $request->query->getInt('limit');
        $limitPart = "";
        if ($limit) {
            $limitPart = " LIMIT :limit";
        }
        
        $q = $conn->prepare('SELECT fromstation, tostation, SUM(subscriber) AS subscriber, SUM(customer) AS customer
FROM top_trips_per_day
WHERE day BETWEEN :start AND :end
GROUP BY fromstation, tostation' . $thresholdPart . '
ORDER BY SUM(subscriber)+SUM(customer) DESC ' . $limitPart);
        if ($threshold) {
            $q->bindValue(':threshold', $threshold);
        }
        if ($limit) {
            $q->bindValue(':limit', $limit);
        }
        $q->bindValue(':start', $start->format('Y-m-d'));
        $q->bindValue(':end', $end->format('Y-m-d'));
        $q->execute();
        return new JsonResponse($q->fetchAll());
    }
}
