from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, RootModel
import requests
from typing import  Dict, List, Optional
from utils.auth import get_user, sign_up, sign_in, sign_in_as_guest, sign_out
from utils.database import fetch_menu_items, place_order

import uvicorn

import json


load_dotenv()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://172.20.0.10:5000",
    "https://theherbdepot.vip",
    "http://theherbdepot.vip"
]


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Example data for inventory
menu = [
    {"id": 1, "name": "Item 1", "price": 10.0},
    {"id": 2, "name": "Item 2", "price": 20.0},
    {"id": 3, "name": "Item 3", "price": 15.0}
]

# Pydantic model for an item in the cart
class CartItem(BaseModel):
    id: int
    quantity: int

class User(BaseModel):
    email: str
    password: str
    #username: Optional[str] = None

class OrderItem(BaseModel):
    id: str
    name: str
    price: int
    quantity: int

class MenuItem(BaseModel):
    id: str
    name: str
    price: int
    onMenu: bool


class Cart(RootModel):
    root: Dict[str, OrderItem]

class Order(BaseModel):
    name: str
    phone: str
    address: str
    pickup: bool
    scheduledTime: str
    cart: Cart
    cartTotal: float
    

# API endpoint to fetch inventory
@app.get("/api/menu")
def get_menu():
    return fetch_menu_items()

@app.get("/api/user")
async def getUser(username: str):
    return get_user(username)

# API endpoint to add item to cart
# @app.post("/api/cart/add")
# async def add_to_cart(item: CartItem):
#     # Validate item exists in inventory
#     item_data = next((x for x in inventory if x["id"] == item.id), None)
#     if not item_data:
#         raise HTTPException(status_code=404, detail="Item not found")

#     # Add item to cart (simulated storage)
#     # Implement your actual cart management logic here
#     return {"message": f"Added {item.quantity} {item_data['name']} to cart"}

# # API endpoint to place an order
# @app.post("/order/place")
# async def place_order(items: List[CartItem]):
#     # Implement order placement logic here
#     # Typically, you would save order details to a database
#     return {"message": "Order placed successfully"}

@app.post('/api/placeOrder')
def placeOrder(order: Order):
    return place_order(order)

@app.post("/api/signup")
async def signup(user: User):
    return await sign_up(user)

@app.post("/api/signin")
async def signin(user: User):
    return await sign_in(user)

@app.post("/api/guest")
def signin_as_guest():
    return sign_in_as_guest()

@app.post("/api/signout")
def signout():
    return sign_out()

@app.get("/api")
async def index():
    return {'message' : 'connection successful'}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)

