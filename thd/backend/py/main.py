from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Example data for inventory
inventory = [
    {"id": 1, "name": "Item 1", "price": 10.0},
    {"id": 2, "name": "Item 2", "price": 20.0},
    {"id": 3, "name": "Item 3", "price": 15.0}
]

# Pydantic model for an item in the cart
class CartItem(BaseModel):
    id: int
    quantity: int

# API endpoint to fetch inventory
@app.get("/inventory")
async def get_inventory():
    return inventory

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

# API endpoint to place an order
@app.post("/order/place")
async def place_order(items: List[CartItem]):
    # Implement order placement logic here
    # Typically, you would save order details to a database
    return {"message": "Order placed successfully"}

