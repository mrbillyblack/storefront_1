CREATE DATABASE store;
use store;

-- GRANT ALL PRIVILEGES ON store.* TO 'python'@'%';
-- FLUSH PRIVILEGES;

CREATE TABLE menu(
    ItemID int NOT NULL AUTO_INCREMENT,
    ItemName varchar(100) NOT NULL,
    Price int NOT NULL,
    OnMenu boolean,
    PRIMARY KEY (ItemID)
);

INSERT INTO menu (ItemName, Price, OnMenu)
values

CREATE TABLE orders(
    OrderNo int NOT NULL AUTO_INCREMENT,
    UserName varchar(20) NOT NULL,
    Phone varchar(15) NOT NULL,
    `Address` varchar(100) NOT NULL,
    Pickup boolean,
    ScheduledTime varchar(200),
    Details JSON, 
    Total int NOT NULL,
    OrderID CHAR(8),
    PRIMARY KEY (OrderNo)
);




