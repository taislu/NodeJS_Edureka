# use a terminal start mongodb

mongod

# dbName : userdata
# collectionName : userlist

# use one terminal to start express api server

cd assignment-m09
npm install
npm start

# use another terminal to run testcases with mocha & chai 

npm test

# Output sample :
> mocha -timeout 15000

  Testing API Endpoints on http://localhost:3800
    ✓ GET / : should return status 200
    ✓ POST /addUser : should insert user into mongodb
    ✓ POST /addUser without body : should return 400 bad request
    ✓ GET /getUser/name : should retrieve user from mongodb
    ✓ GET /getUser/invalidName : should return 404 not found
    ✓ PUT /updateUser : should update user in mongodb
    ✓ PUT /updateUser without body : should return 400 bad request
    ✓ DELETE /deleteUser/name : should delete user from mongodb
    ✓ DELETE /deleteUser/invalidName : should return 404 not found

  9 passing (71ms)
