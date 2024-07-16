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

def get_user():
    try:
        response = supabase.auth.get_user()
        print(response)
    
    #can take username and push to other db
    except Exception as err:
        raise HTTPException(status_code=400, detail=err)
    return response

async def sign_up(user):
    #add line to push username to mongo database, when created.
    try:
        response = supabase.auth.sign_up(credentials={
            'email': user.email,
            'password': user.password
        })
        print(response)
    
        #can take username and push to other db
    except Exception as err:
        raise HTTPException(status_code=400, detail=err)
    
    return {"message": "User signed up successfully", "data": response}

async def sign_in(user):
    try:
        print('endpoint hit')
        response = supabase.auth.sign_in_with_password({
            'email': user.email,
            'password': user.password
        })
    except Exception as err:
        raise HTTPException(status_code=400, detail=err)
    print(response)
    return {"message": "User signed in successfully", "data": response}

def sign_in_as_guest():
    print('endpoint hit')

    try:
        response = supabase.auth.sign_in_anonymously(credentials={"options": {"data": {}}})
        print(response)
    except Exception as err:
        raise HTTPException(status_code=400, detail=err)
    return {"message": "Guest user signed in successfully", "data": response}

def sign_out():
    try:
        response = supabase.auth.sign_out()
    except Exception as err:
        raise HTTPException(status_code=400, detail=err)
    return {"message": "User signed out successfully", "data": response}

