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
    ('Lemon Haze', 30, True),
    ('Black Cherry Gelato', 25, True),
    ('Cereal Milk', 20, True),
    ('Acapulco Gold', 20, True),
    ('$5 Special', 5, True);

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


INSERT INTO orders(UserName, Phone, `Address`, Pickup, ScheduledTime, Details, Total, OrderID)
VALUES ('JohnDoe', '1234567890', '123 Elm Street', TRUE, '2024-07-12 14:00:00', 'Item1:2,Item2:1', 100, 'ABC12345');


