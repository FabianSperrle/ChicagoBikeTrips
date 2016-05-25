<?php
/**
 * @author Tobias Schmidt <tobias.schmidt@refund-suisse.ch>
 */

namespace ChicagoBikeBundle\Command;

use ChicagoBikeBundle\Entity\Bike;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class BikeTableCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('chicago:import:bike')
            ->setDescription('Fills bike table (dont ask how)');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $em = $this->getContainer()->get('doctrine.orm.entity_manager');
        $connection = $em->getConnection();
        $connection->getConfiguration()->setSQLLogger(null);


        $result = $connection->executeQuery("SELECT * FROM trip ORDER BY bikeid, endtime");

        /** @var Bike $oldBike */
        $oldBike = null;

        $i = 0;
        foreach ($result as $item) {
            if ($oldBike) {
                if ($oldBike->getBikeid() == $item['bikeid']) {
                    $oldBike->setEndtime($item['starttime']);
                }
                $em->persist($oldBike);
                if ($i == 1000) {
                    $output->writeln($oldBike->getBikeid() . " - " . $oldBike->getStarttime()->format("Y-m-d H:i:s"));
                    $i = 0;
                    $em->flush();
                    $em->clear();
                }
            }
            $bike = new Bike();
            $bike->setBikeid($item['bikeid']);
            $bike->setStationid($item['tostation']);
            $bike->setStarttime($item['endtime']);

            $oldBike = $bike;
            $i++;
        }

        $em->persist($oldBike);
        $em->flush();
    }

}
