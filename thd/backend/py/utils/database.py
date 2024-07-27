from dotenv import load_dotenv
import json
import mysql.connector
import os
import re
from utils.textbelt import sms, dispatch_sms
import uuid

load_dotenv()

connection = mysql.connector.connect(
    host="172.20.0.9",
    user="root",
    password=str(os.getenv('MYSQL_PASSWD')),
    database="store"
)

def fetch_menu_items():
    cursor = connection.cursor()
    cursor.execute("SELECT ItemID, ItemName, Price FROM menu WHERE OnMenu = 1")
    result = cursor.fetchall()

    menu = []
    for row in result:
        menu.append({ 'id': str(row[0]), 'name': row[1], 'price': row[2]})
    cursor.close()
    
    return menu

def place_order(order):
    cursor = connection.cursor()     

    # Insert a new menu item with the current date
    random_uuid = str(uuid.uuid4()).upper()
    OrderID = random_uuid[:7]
    orderHeader = "Order Received: Order ID {}".format(OrderID)
    
    orderPhone = re.sub(r'\D', '', order.phone)
    print(orderPhone)

    orderTime = "\n\nPickup/Delivery time: {} {}".format(str(order.scheduledTime)[:15], str(order.scheduledTime)[33:])
    print(orderTime)

    orderType = "\nOrder Type: Pickup"

    if order.pickup == False:
        orderType = "\nOrder Type: Delivery"


    orderTotal = "\nTotal: ${}, customer will pay at pickup/delivery".format(str(int(order.cartTotal)))

    cartObject = json.loads(order.cart.json())  # Use date.today() to get the current date
    # print(cartObject)

    cartItems = '\n\nOrder Details:\n'
    for key, item in cartObject.items():
        cartItems = cartItems + "{}: ${}, Quantity: {} bag(s) x3.5\n".format(item["name"], item["price"], item["quantity"])
    

    orderReceivedMsg = orderHeader + cartItems + orderTotal + orderType + orderTime

    print(orderReceivedMsg)

    dispatchMsg = orderReceivedMsg + "\n\nCustomer Name: {}\nPhone: {}".format(order.name, order.phone)
    text_to_dispatch = dispatch_sms(dispatchMsg)

    text_to_user = sms(orderPhone, orderReceivedMsg)
    
    return text_to_user 

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

    return {"message": "Data inserted successfully: {}".format(data_order)}


