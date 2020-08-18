# kill process running at 8000
sudo kill -9 $(sudo lsof -t -i:8000)

# restart mongod server
sudo systemctl restart mongod

#run node script
/usr/local/bin/node ~/portfolio-tracking-api/backend/server.js