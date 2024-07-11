from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from utils.auth import sign_up, sign_in, sign_out
from utils.database import fetch_menu_items

import uvicorn

import json

origins = [
    "http://localhost",
    "http://localhost:8000",
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

# API endpoint to fetch inventory
@app.get("/menu")
def get_menu():
    return fetch_menu_items()

# API endpoint to add item to cart
@app.post("/cart/add")
async def add_to_cart(item: CartItem):
    # Validate item exists in inventory
    item_data = next((x for x in inventory if x["id"] == item.id), None)
    if not item_data:
        raise HTTPException(status_code=404, detail="Item not found")

    # Add item to cart (simulated storage)
    # Implement your actual cart management logic here
    return {"message": f"Added {item.quantity} {item_data['name']} to cart"}

# # API endpoint to place an order
# @app.post("/order/place")
# async def place_order(items: List[CartItem]):
#     # Implement order placement logic here
#     # Typically, you would save order details to a database
#     return {"message": "Order placed successfully"}


@app.post("/signup")
async def signup(user: User):
    return await sign_up(user)

@app.post("/signin")
async def signin(user: User):
    return await sign_in(user)

@app.post("/signout")
async def signout():
    return await sign_out()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

