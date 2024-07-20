from dotenv import load_dotenv
import os
import re
import requests

load_dotenv()


def sms(phone: str, message: str):
    try:
        resp = requests.post('https://textbelt.com/text', {
        'phone': str(phone),
        'message': str(message),
        'key': str(os.getenv('SMS_KEY')),
        })
    except Exception as err:
        raise HTTPException(status_code=400, detail=err)
    print(resp.json())
    return resp.json()

def dispatch_sms(message: str):
    try:
        resp = requests.post('https://textbelt.com/text', {
        'phone': str(os.getenv('DISPATCH_PHONE')),
        'message': str(message),
        'key': str(os.getenv('SMS_KEY')),
        })
    except Exception as err:
        raise HTTPException(status_code=400, detail=err)
    print(resp.json())
    return resp.json()