<?php
$configs = include('config.php');

$health = isset($_POST['health']) ? $_POST['health'] : '';
$fun = isset($_POST['fun']) ? $_POST['fun'] : '';
$fmi = isset($_POST['fmi']) ? $_POST['fmi'] : '';
$actions = isset($_POST['actions']) ? $_POST['actions'] : '';
$id = isset($_POST['id']) ? $_POST['id'] : '';


echo json_encode($_POST);


echo "in php script";
echo $id;
echo "health is ".$health;

$conn = new PDO('mysql:host='.$configs['host'].';dbname='.$configs['dbname'].'', $configs['username'], $configs['password']);


$data = [
    'health'=> $health,
    'fun'=> $fun,
    'uni'=> $fmi,
    'actions'=> $actions,
    'id' => $id
];

$stmt = $conn->prepare("update stats set 
health=:health,
fun=:fun,
uni=:uni,
actions=:actions
 where id = :id;
");

$stmt->execute($data);

?>

