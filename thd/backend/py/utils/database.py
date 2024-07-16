from dotenv import load_dotenv
import json
import mysql.connector
import uuid
import os

load_dotenv
connection = mysql.connector.connect(
    host="172.20.0.9",
    user="root",
    password=str(os.getenv('MYSQL_PASSWD')),
    database="store"
)

def fetch_menu_items():
    cursor = connection.cursor()
    cursor.execute("SELECT ItemID, ItemName, Price FROM menu")
    result = cursor.fetchall()

    menu = []
    for row in result:
        menu.append({ 'id': str(row[0]), 'name': row[1], 'price': row[2]})
    cursor.close()
    
    return menu

def place_order(order):
    cursor = connection.cursor()     

    # Insert a new menu item with the current date
    random_uuid = str(uuid.uuid4())
    OrderID = random_uuid[:7]
    print("Order No. %s", OrderID.upper())

    cartObject = json.loads(order.cart.json())  # Use date.today() to get the current date
    # print(cartObject)

    cartItems = 'Item\t\tPrice\tQty\n'
    for key, item in cartObject.items():
        cartItems = cartItems + "{}\t{}\t{}\n".format(item["name"], item["price"], item["quantity"])
    print(cartItems)

    orderPickup = '0'
    if order.pickup == True:
        orderPickup = '1'



    # SQL insert statement
    add_order = ("INSERT INTO orders "
                 "(UserName, Phone, Address, Pickup, ScheduledTime, Details, Total, OrderID) "
                 "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)")

    # Order data
    data_order = (
        order.name,               # UserName
        order.phone,            # Phone
        order.address,        # Address
        order.pickup,                    # Pickup
        order.scheduledTime,   # ScheduledTime
        order.cart.json(),       # Details
        order.cartTotal,                     # Total
        OrderID               # OrderID
    )

    # Insert the new order
    cursor.execute(add_order, data_order)




    # insert_query = "INSERT INTO orders (UserName, Phone, Address, Pickup, Total, OrderID) VALUES ({}, {}, {}, {}, {}, {});".format(order.name, order.phone, order.address, order.pickup, order.cartTotal, OrderID)
    # # insert_query = "INSERT INTO orders (UserName, Phone, Address, Pickup, ScheduledTime, Items, Total, OrderID) VALUES ({}, {}, {}, {}, {}, {}, {}, {})".format(order.name, order.phone, order.address, order.pickup, order.scheduledTime, cartObject, order.cartTotal, OrderID)

    connection.commit()

    cursor.close()
    connection.close()

    return {"message": "Data inserted successfully: {}".format(data_order)}


