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


#  Примерни данни за тестване на базата
INSERT INTO users VALUES(83, 'atanas_gruev', 'nasi989@abv.bg', '5d724fdf5377cdf66a59f83477e6cb79e76620f7'); ## PWD: 123QWEqwe
INSERT INTO users VALUES(84, 'lyubo_anin', 'lyubo989@abv.bg', '5d724fdf5377cdf66a59f83477e6cb79e76620f7');  ## PWD: 123QWEqwe

INSERT INTO stats VALUES(83, 150, 165, 44, 10);
INSERT INTO stats VALUES(84, 80, 170, 75, 30);