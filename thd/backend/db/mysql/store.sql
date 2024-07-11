CREATE DATABASE store;
use store;

GRANT ALL PRIVILEGES ON store.* TO 'python'@'%';
FLUSH PRIVILEGES;

CREATE TABLE menu(
    ItemID int NOT NULL AUTO_INCREMENT,
    ItemName varchar(100) NOT NULL,
    Price int NOT NULL,
    OnMenu boolean,
    PRIMARY KEY (ItemID)
);

CREATE TABLE orders(
    OrderNo int NOT NULL AUTO_INCREMENT,
    UserName varchar(20) NOT NULL,
    Phone varchar(15) NOT NULL,
    Address varchar(100) NOT NULL,
    Pickup boolean,
    Items JSON,
    OrderID CHAR(8),
    PRIMARY KEY (OrderNo)
);

DELIMITER //
CREATE TRIGGER generate_random_id
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    SET NEW.OrderID = SUBSTRING(MD5(RAND()), 1, 8);
END;
//
DELIMITER ;


INSERT INTO menu (ItemName, Price, OnMenu)
values
    ('Lemon Haze', 30, True),
    ('Black Cherry Gelato', 25, True),
    ('Cereal Milk', 20, True),
    ('Acapulco Gold', 20, True),
    ('$5 Special', 5, True);