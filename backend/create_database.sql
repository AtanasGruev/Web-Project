# DROP DATABASE IF EXISTS webproj;
CREATE DATABASE webproj
CHARACTER SET="utf8";
USE webproj;

CREATE TABLE users (
	
id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	
username VARCHAR(150) NOT NULL UNIQUE,

email VARCHAR(200) NOT NULL UNIQUE,
	
password VARCHAR(200) NOT NULL

);

# DROP USER IF EXISTS 'register_user'@'localhost';
CREATE USER 'register_user'@'localhost' IDENTIFIED BY 'passw0rd';
GRANT ALL ON webproj.users TO 'register_user'@'localhost';