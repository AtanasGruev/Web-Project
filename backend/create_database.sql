#drop database if exists webproj;
CREATE DATABASE webproj
CHARACTER SET="utf8";
USE webproj;

CREATE TABLE users (
	
id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	
username VARCHAR(150) NOT NULL UNIQUE,

email VARCHAR(200) NOT NULL UNIQUE,
	
password VARCHAR(200) NOT NULL

);


CREATE TABLE stats (
id BIGINT UNSIGNED,
health INT NOT NULL,
fun INT NOT NULL,
uni INT NOT NULL ,
actions INT NOT NULL,

FOREIGN KEY (id) REFERENCES users(id)
);


CREATE USER 'register_user'@'localhost' IDENTIFIED BY 'passw0rd';
GRANT ALL ON webproj.users TO 'register_user'@'localhost';
GRANT ALL ON webproj.stats TO 'register_user'@'localhost';