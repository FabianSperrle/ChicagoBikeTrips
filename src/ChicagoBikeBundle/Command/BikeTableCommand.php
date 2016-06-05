<?php
/**
 * @author Tobias Schmidt <tobias.schmidt@refund-suisse.ch>
 */

namespace ChicagoBikeBundle\Command;

use ChicagoBikeBundle\Entity\Bike;
use Doctrine\DBAL\DBALException;
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
        $batchSize = 5000;
        $em = $this->getContainer()->get('doctrine.orm.entity_manager');
        $connection = $em->getConnection();
        $connection->getConfiguration()->setSQLLogger(null);

        $filename = sys_get_temp_dir() . "/bike.csv";
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
                if ($previous && $previous['bikeid'] == $item['bikeid'] && $previous['tostation'] == $item['fromstation']) {
                    fputcsv($file, [
                        $item['bikeid'],
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

        // TODO: does not work, if there are duplicates (violating primary key constraint)
        $connection->executeUpdate("COPY bike FROM '" . $filename . "' DELIMITER ',' CSV");
    }

}
