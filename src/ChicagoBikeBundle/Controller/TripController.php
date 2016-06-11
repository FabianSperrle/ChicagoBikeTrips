<?php

namespace ChicagoBikeBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @Route("/trips")
 * Class TripController
 */
class TripController extends Controller
{
    /**
     * @Route("/per_week", name="trips_per_week", options={"expose": true})
     * @return JsonResponse
     */
    public function tripsPerWeekAction()
    {
        $conn = $this->get('database_connection');
        $data = $conn->executeQuery('SELECT cast(extract(epoch from week) AS INTEGER) AS week, customers, subscribers FROM trips_per_week')->fetchAll();

        return new JsonResponse($data);
    }

    /**
     * @Route("/top/{amount}", requirements={"amount": "\d+"}, name="top_trips", options={"expose": true})
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
}
