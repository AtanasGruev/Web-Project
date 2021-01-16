<?php
$email = isset($_POST['email']) ? $_POST['email'] : '';
$username = isset($_POST['username']) ? $_POST['username'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$hashed_password = sha1($password);

$conn = new PDO('mysql:host=localhost;dbname=webproj', 'register_user', 'passw0rd');

$stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
$stmt->bindParam(':email', $email, PDO::PARAM_STR);
$stmt->execute();
$row = $stmt->fetch();

if ($row != false) {
    echo "a user with the email " . $row['email'] . " already exists <br>";
} else { $sql = "INSERT INTO users(username, email, password) VALUES (?,?,?);";

    $stmt = $conn->prepare($sql);
    $result = $stmt->execute([$username, $email, $hashed_password]);

    if ($result) {
        echo 'You signed up successfully.';
    } else {
        $error = $stmt->errorInfo();
        if ($error[1] == 1062) {
            echo 'username already exists';
        }
    }
}

// CREATE DATABASE webproj

// CHARACTER SET="utf8";

// USE webproj;

// CREATE TABLE users (

// id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

// username VARCHAR(150) NOT NULL UNIQUE,

// password VARCHAR(200) NOT NULL,

// );

// CREATE USER 'register_user'@'localhost' IDENTIFIED BY 'passw0rd';
// GRANT ALL ON webproj.users TO 'register_user'@'localhost';
