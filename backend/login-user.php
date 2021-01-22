<?php
$username = isset($_POST['username']) ? $_POST['username'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$hashed_password = sha1($password);

$conn = new PDO('mysql:host=localhost;dbname=webproj', 'register_user', 'passw0rd');

$stmt = $conn->prepare("SELECT * FROM users WHERE username = :username AND password = :password");
$stmt->bindParam(':username', $username, PDO::PARAM_STR);
$stmt->bindParam(':password', $hashed_password, PDO::PARAM_STR);

$stmt->execute();

$row = $stmt->fetch();
if ($row == false) {
    echo "Невалидно потребителско име/парола.";
} else {
    echo "Вписахте се успешно!";
}
?>