<?php

namespace ChicagoBikeBundle\Controller;

use ChicagoBikeBundle\Entity\Station;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class StationController extends Controller
{

    /**
     * @Route("stations/")
     */
    public function listAction() {
        $em = $this->getDoctrine()->getManager();
        $stations = $em->getRepository('ChicagoBikeBundle:Station')->findAll();

        $serializer = $this->get('serializer');
        $json = $serializer->serialize($stations, 'json');
        
        return $this->render('ChicagoBikeBundle:station:list.html.twig', compact('json'));
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
}