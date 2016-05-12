<?php
/**
 * Created by PhpStorm.
 * User: fabian
 * Date: 12.05.2016
 * Time: 16:35
 */

namespace ChicagoBikeBundle\Command;


use ChicagoBikeBundle\Entity\Station;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

use Symfony\Component\Finder\Finder;

class ImportStationsCommand extends ContainerAwareCommand
{

    private $logger;
    private $em;

    protected function configure()
    {
        $this->setName('chicago:import:stations')
            ->setDescription('Imports data to Postgres')
            ->addArgument('path', InputArgument::REQUIRED, 'Path to the CSV file')
            ->addOption('skip_header', 'header', InputOption::VALUE_OPTIONAL, 'Skip the first line of the CSV file', true);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->logger = $this->getContainer()->get('logger');
        $this->em = $this->getContainer()->get('doctrine')->getEntityManager();

        $path = $input->getArgument('path');
        $skipHeader = $input->getOption('skip_header');

        $finder = new Finder();
        $finder->files()->in($path);

        foreach ($finder as $filePath) {
            $output->writeln($filePath->getRealPath());
            $file =  new \SplFileObject($filePath->getRealPath());

            if ($skipHeader) {
                $file->fgetcsv();
            }

            $i = 1;
            while (($row = $file->fgetcsv()) != false) {
                $station = new Station();
                $station->setId($row[0])
                    ->setName($row[1])
                    ->setLatitude($row[2])
                    ->setLongitude($row[3])
                    ->setDpcapacity($row[4])
                    ->setLandmark($row[5])
                    ->setOnlineDate(new \DateTime($row[6]));
                $this->em->persist($station);

                if ($i % 100 == 0) {
                    $output->writeln($row[0]);
                    $this->em->flush();
                }
                $i++;
            }
            $this->em->flush();
            $file = null;
        }
    }
}