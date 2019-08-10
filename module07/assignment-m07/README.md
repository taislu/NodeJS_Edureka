# start mongodb daemon

mongod

# dbName : db_shopping_cart
# collectionName : user_list, order_list

# start development server

cd assignment-m07
npm install
npm start (or npm run dev)

# add the 1st admin user without jwt

1. add admin1 via localhost:9900/admin 

# mongo> use db_shopping_cart
# mongo> db.user_list.find().pretty()

# localhost:9900 (shopping cart dashboard with jwt)
# normal user can see shopping list page only
# admin user can get access to [user list] and [shopping list] dashboards

2. register user1 via localhost:9900 

3. login admin1 via localhost:9900 

4. add user2 via [User List] dashboard

5. add admin2 via [User List] dashboard

6. click [Shopping List] 

7. add one order with user1 email

8. open another browser2, navigate to localhost:9900, and login with user1

9. add another order with user1 email

10. refresh browser2

11. click [log out]
