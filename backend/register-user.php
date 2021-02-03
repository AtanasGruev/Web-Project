<?php
$email = isset($_POST['email']) ? $_POST['email'] : '';
$username = isset($_POST['username']) ? $_POST['username'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$hashed_password = sha1($password);

$conn = new PDO('mysql:host=localhost; port=3306; dbname=webproj', 'register_user', 'passw0rd');

$stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
$stmt->bindParam(':email', $email, PDO::PARAM_STR);
$stmt->execute();
$row = $stmt->fetch();

if ($row != false) {
    echo "Потребител с имейла " . $row['email'] . " вече съществува.";
} else { $sql = "INSERT INTO users(username, email, password) VALUES (?,?,?);";
    $stmt = $conn->prepare($sql);
    $result = $stmt->execute([$username, $email, $hashed_password]);

    if ($result) {
        echo 'Регистрирахте се успешно!';
    } else {
        $error = $stmt->errorInfo();
        if ($error[1] == 1062) {
            echo 'Потребителското име е заето.';
            return;
        }
    }

    $id = (int)$conn->lastInsertId();
    $sql = "INSERT INTO stats(id, health, fun, uni, actions) VALUES (?,?,?,?,?);";
    $stmt = $conn->prepare($sql);
    $result = $stmt->execute([$id, 170, 194.4, 20, 0]);
    

}
?>