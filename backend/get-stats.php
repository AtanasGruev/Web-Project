<?php
$configs = include('config.php');

$id = isset($_POST['id']) ? $_POST['id'] : '';

$conn = new PDO('mysql:host='.$configs['host'].';dbname='.$configs['dbname'].'', $configs['username'], $configs['password']);

$stmt = $conn->prepare("SELECT health, fun, uni, actions FROM stats WHERE id = :id");
$stmt->bindParam(':id', $id, PDO::PARAM_STR);
$stmt->execute();
$row = $stmt->fetch();

echo json_encode($row);

?>
