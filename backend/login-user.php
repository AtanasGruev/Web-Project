<?php
$configs = include('config.php');

$username = isset($_POST['username']) ? $_POST['username'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$hashed_password = sha1($password);

$conn = new PDO('mysql:host='.$configs['host'].';dbname='.$configs['dbname'].'', $configs['username'], $configs['password']);

$stmt = $conn->prepare("SELECT * FROM users WHERE username = :username AND password = :password");
$stmt->bindParam(':username', $username, PDO::PARAM_STR);
$stmt->bindParam(':password', $hashed_password, PDO::PARAM_STR);

$stmt->execute();

$row = $stmt->fetch();
if ($row == false) {
    echo "Невалидно потребителско име/парола.";
} else {
  
    $id = $row['id'];
    echo "Вписахте се успешно!";
    echo $id;
}
?>