# React Native/Expo Storefront Application

## How to install

Required Environment Variables:
```
SUPABASE_URL=
SUPABASE_KEY=
MYSQL_PASSWD=
SMS_KEY=
DISPATCH_PHONE=
```

FastAPI Backend:
```
pip3 install requirements.txt
```

React/React Native Frontend:
```
npm install
```

Docker-compose file available. Run containers with ```docker-compose up -d``` and backend dependencies will install in container.

The ```SMS_KEY``` value needs to be a TextBelt API key. You can get one after you purchase a number of texts: [https://textbelt.com/](url)

Authentication is handled by SupaBase: [https://supabase.com/](url)




