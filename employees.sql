DROP DATABASE IF EXISTS work-force_db;
CREATE DATABASE work-force_db;

CREATE TABLE department(
    id INTEGER AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
)

CREATE TABLE position(
    id INTEGER AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2),
    department_id INT NOT NULL,
    PRIMARY KEY (id)
)

CREATE TABLE employees(
    id INTEGER AUTO_INCREMENT NOT NULL,
    firstname VARCHAR(25) NOT NULL,
    lastname VARCHAR(35) NOT NULL,
    role_id  INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id)
)

