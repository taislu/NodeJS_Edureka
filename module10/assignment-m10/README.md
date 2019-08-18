# run app from docker hub

docker run --rm -p 13579:8080 taislu92503/edureka-nodejs-assignment-m10

# browser

localhost:13579/getGithubUser/userid
or
0.0.0.0:13579/getGithubUser/who

# use another terminal to stop the running docker app

docker ps (to get container id)
docker stop <container id>
