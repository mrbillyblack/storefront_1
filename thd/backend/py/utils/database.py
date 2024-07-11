from dotenv import load_dotenv
import mysql.connector
import os

load_dotenv()
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

    menu = {}
    for row in result:
        menu[row] = row
    cursor.close()
    
    return menu

