<?php
$id = isset($_POST['id']) ? $_POST['id'] : '';

$conn = new PDO('mysql:host=localhost;dbname=webproj', 'register_user', 'passw0rd');

$stmt = $conn->prepare("SELECT health, fun, uni, actions FROM stats WHERE id = :id");
$stmt->bindParam(':id', $id, PDO::PARAM_STR);
$stmt->execute();
$row = $stmt->fetch();

echo json_encode($row);

?>
