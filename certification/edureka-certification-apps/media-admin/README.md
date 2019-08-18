# start mongodb daemon

mongod

# dbName : db_media
# collectionName : user_list, news_list

# start development server

cd media-admin
npm install
npm start (or npm run dev)

# register or login

1. register account
2. login

# add/edit news will validate user via JWT (Jason Web Token) 

1. click NewsForm to add news
2. click EditNews to edit/delete news

# Get /api/getLatestNews returns json data for latest 3 news records to support media customer facing app 