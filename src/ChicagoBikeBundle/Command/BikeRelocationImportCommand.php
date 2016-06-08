<?php

namespace ChicagoBikeBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class BikeRelocationImportCommand extends ContainerAwareCommand
{
    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setName('chicago:import:relocation')
            ->setDescription('Imports the data of relocated bikes');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $batchSize = 5000;
        $connection = $this->getContainer()->get('database_connection');
        $connection->getConfiguration()->setSQLLogger(null);

        $filename = sys_get_temp_dir() . "/relocation.csv";
        $file = fopen($filename, 'w');
        fwrite($file, "");

        $limit = $batchSize;
        $offset = 0;
        $resultEmpty = true;
        while ($resultEmpty && $result = $connection->executeQuery("SELECT * FROM trip ORDER BY bikeid, endtime LIMIT $limit OFFSET $offset")) {
            $previous = [];

            $resultEmpty = false;
            foreach ($result as $item) {
                $resultEmpty = true;
                if ($previous && $previous['bikeid'] == $item['bikeid'] && $previous['tostation'] != $item['fromstation']) {
                    fputcsv($file, [
                        $item['bikeid'],
                        $previous['tostation'],
                        $item['fromstation'],
                        $previous['endtime'],
                        $item['starttime']
                    ]);
                }

                $previous = $item;
            }
            $limit = $batchSize + 1;
            $offset = ($offset == 0 ? $batchSize - 1 : $offset + $batchSize);
            $output->writeln("Processed offset " . $offset);
        }
        fclose($file);
        
        $connection->executeUpdate("COPY bike_relocation FROM '" . $filename . "' DELIMITER ',' CSV");
    }
}
