<?php
/**
 * Created by PhpStorm.
 * User: fabian
 * Date: 12.05.2016
 * Time: 16:35
 */

namespace ChicagoBikeBundle\Command;


use ChicagoBikeBundle\Entity\Trip;
use Doctrine\ORM\EntityManager;
use Monolog\Logger;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Finder\Finder;

class ImportTripsCommand extends ContainerAwareCommand
{

    /**
     * @var EntityManager
     */
    private $em;

    protected function configure()
    {
        $this->setName('chicago:import:trips')
            ->setDescription('Imports data to Postgres')
            ->addArgument('path', InputArgument::REQUIRED, 'Path to the CSV file')
            ->addOption('skip_header', 'header', InputOption::VALUE_OPTIONAL, 'Skip the first line of the CSV file', true);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->em = $this->getContainer()->get('doctrine')->getEntityManager();

        $path = $input->getArgument('path');
        $skipHeader = $input->getOption('skip_header');

        $finder = new Finder();
        $finder->files()->in($path);

        foreach ($finder as $filePath) {
            /** @var $filePath \SplFileInfo */
            $output->writeln($filePath->getRealPath());
            $file =  new \SplFileObject($filePath->getRealPath());

            if ($skipHeader) {
                $file->fgetcsv();
            }

            $i = 1;
            while (($row = $file->fgetcsv()) != false) {
                $trip = new Trip();
                $fromStation = $this->em->getRepository('ChicagoBikeBundle:Station')->find($row[5]);
                $toStation = $this->em->getRepository('ChicagoBikeBundle:Station')->find($row[7]);

                if ($row[10] == "") {
                    $row[10] = null;
                }
                if ($row[11] == "") {
                    $row[11] = null;
                }

                $trip->setId($row[0])
                    ->setStarttime(new \DateTime($row[1]))
                    ->setEndtime(new \DateTime($row[2]))
                    ->setBikeid($row[3])
                    ->setTripduration($row[4])
                    ->setFromStation($fromStation)
                    ->setToStation($toStation)
                    ->setUsertype($row[9])
                    ->setGender($row[10])
                    ->setBirthday($row[11]);

                $this->em->persist($trip);

                if ($i % 100 == 0) {
                    $output->writeln($row[0]);
                    $this->em->flush();
                    $this->em->clear();
                }
                $i++;
            }
            $this->em->flush();
            $file = null;
        }
    }
}
