<?php

class ShopCars
{
    private $dbh;
    public function __construct()
    {
        if (!$this->dbh = new \PDO('mysql:host='.HOST.';dbname='.DB, USER, PASSWORD))
        {
            throw new SoapFault('Server', 'Error DB');
        }
    }

    private function query( $sql,$data = [])
    {
        $sth = $this->dbh->prepare($sql);
        $result = $sth->execute($data);
        if (false === $result) {
            throw new SoapFault('Server', NO_CONNECT);
            die;
        }
        return $sth->fetchAll(\PDO::FETCH_ASSOC);
    }

    private function execute(string $sql, array $data = [])
    {
        $sth = $this->dbh->prepare($sql);
        $result = $sth->execute($data);
        if (false === $result) {
            throw new SoapFault('Server', NO_CONNECT);
            die;
        }
        return true;
    }

    /**
     * @return string
     * @throws SoapFault
     */
    public function allCars()
    {
        $data = $this->query(
            "SELECT id, brand, model FROM cars ",
            []
        );
        if(!empty($data))
        {
            $resultJSON = json_encode($data);
            return $resultJSON;
        }
        else
        {
            throw new SoapFault('Server', 'Empty data');
        }
    }

    /**
     * @param $id
     * @return string
     * @throws SoapFault
     */
    public function idCars($id)
    {
        $data = $this->query(
            "SELECT id, brand, model, year, engine, color, maxSpeed, price FROM cars WHERE id=:id",
            [':id' => $id]
        );
        if(!empty($data))
        {
            $resultJSON = json_encode($data[0]);
            return $resultJSON;
        }
        else
        {
            throw new SoapFault('Server', 'Id auto do not exist or not integer');
        }

    }

    /**
     * @param $arrParams
     * @return string
     * @throws SoapFault
     */
    public function getSerch($arrParams)
    {
        $arrParams = json_decode($arrParams, true);

        if(empty($arrParams['year']) )
        {
            throw new SoapFault('Server', 'Year exist, please choice year');
        }

        $year = $this->dbh->quote($arrParams['year']);
        $where = $year;
        if (!empty($arrParams['brand']))
        {
            $brand = $this->dbh->quote($arrParams['brand']);
            $where .= " AND brand=".$brand;
        }
        if (!empty($arrParams['model']))
        {
            $model = $this->dbh->quote($arrParams['model']);
            $where .= " AND model=".$model;
        }
        if (!empty($arrParams['engine']))
        {
            $engine = $this->dbh->quote($arrParams['engine']);
            $where .= " AND engine=".$engine;
        }
        if (!empty($arrParams['color']))
        {
            $color = $this->dbh->quote($arrParams['color']);
            $where .= " AND color=".$color;
        }
        if (!empty($arrParams['maxSpeed']))
        {
            $maxSpeed = $this->dbh->quote($arrParams['maxSpeed']);
            $where .= " AND maxSpeed=".$maxSpeed;
        }
        if (!empty($arrParams['price']))
        {
            $price = $this->dbh->quote($arrParams['price']);
            $where .= " AND price=".$price;
        }

        $data = $this->query(
            "SELECT id,  brand, model, year, engine, color, maxSpeed, price FROM cars WHERE year=".$where,
            []
        );
        if(!empty($data))
        {
            $resultJSON = json_encode($data);
            return $resultJSON;
        }
        else
        {
            throw new SoapFault('Server', 'Something wrong');
        }

    }

    /**
     * @param $order
     * @throws SoapFault
     */
    public function getOrders($order)
    {
        $order = json_decode($order, true);
        if(!empty($order['id_cars'])&& !empty($order['first_name'])
            && !empty($order['second_name']) && !empty($order['payment'])) {
            $id_cars = $this->dbh->quote($order['id_cars']);
            $first_name = $this->dbh->quote($order['first_name']);
            $second_name = $this->dbh->quote($order['second_name']);
            $payment = $this->dbh->quote($order['payment']);
            $sql = "INSERT INTO orders (id_cars, first_name, second_name, payment)
                VALUES ( $id_cars, $first_name, $second_name, $payment)";
            $result = $this->execute($sql);
            return $result;
            if (false === $result) {
                throw new SoapFault('Server', 'Not add order');
            }
        }
        else
        {
            throw new SoapFault('Server', 'Empty fields');
        }


    }

}













