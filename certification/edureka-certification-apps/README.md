# To run media-apps with docker

docker pull taislu92503/media-cust-app    
docker pull taislu92503/media-admin-app     
docker pull taislu92503/media-nginx     
docker images    

# to start

cd edureka-certification-apps/media-nginx     
docker-compose up     

# check out customer facing app

http://localhost

click image slider to see detail page     

"open two browsers"      
enter your-nick-name & click [set nickname]      
enter messages & click chat message     

click [Sports] menu    

click [About Us] menu    

click [Contact Us menu]    

(note: the apps use database hosted on external mongodb atlas)     

# check out admin app     

http://localhost:9900    

register an admin user    
(or use existing admin2@testmail.com password admin2 )     

Add News (FYI)     
title: Why Buy A Bugatti Centodieci When You Can Have This F-16 Fighter Jet For Less? - Jalopnik      
description : "The $8,878,800 (plus tax!) list price of the Bugatti Centodieci really makes you think. The fact that there’s a market for such a preposterous toy is a pretty clear indicator that some people are too rich. Then again–why would you park among peasants in one o…",     
url: https://jalopnik.com/why-buy-a-bugatti-centodieci-when-you-can-have-this-f-1-1837312224     
urlToImage : https://i.kinja-img.com/gawker-media/image/upload/s--ZPYPsJN0--/c_fill,fl_progressive,g_center,h_900,q_80,w_1600/wdilym0wmdxb4i3nyjfi.jpg     
publishedAt : 2019-08-16T23:00:00Z     

Click [EditNews] menu     

Click [Logout]    

# to stop    

docker-compose down    

GitHub : https://github.com/taislu/NodeJS_Edureka/tree/master/certification/edureka-certification-apps      

