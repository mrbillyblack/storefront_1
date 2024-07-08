#!/usr/bin/python3

from dotenv import load_dotenv
import json
from fastapi import HTTPException
from supabase import create_client, Client
import os

import json 

#get url, api key from separate env var file

load_dotenv()
SUPABASE_URL = str(os.getenv('SUPABASE_URL'))
SUPABASE_KEY = str(os.getenv('SUPABASE_KEY'))

print('SUPABASE_URL='+SUPABASE_URL)
print('SUPABASE_KEY='+SUPABASE_KEY)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def sign_up(user):
    #add line to push username to mongo database, when created.
    response = supabase.auth.sign_up({
        'email': user.email,
        'password': user.password
    })
    print(response)
    if 'error' in response.json():
        raise HTTPException(status_code=400, detail=response['error']['message'])
    return {"message": "User signed up successfully", "data": response}

async def sign_in(user):
    response = supabase.auth.sign_in({
        'email': user.email,
        'password': user.password
    })
    if 'error' in response.json():
        raise HTTPException(status_code=400, detail=response['error']['message'])
    return {"message": "User signed in successfully", "data": response}

async def sign_out():
    response = supabase.auth.sign_out()
    if 'error' in response.json():
        raise HTTPException(status_code=400, detail=response['error']['message'])
    return {"message": "User signed out successfully"}
