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
}
