node-fastbit
============

A node.js interface to FastBit

##Installation
install fastbit (binding.gyp expects it in /usr/local/lib)

install redis

set up example data

cd ../example_data

awk 'NR>1' Master.csv | ../bin/ardea -v -d Master -n Master -m playerId:t,birthYear:i,birthMonth:i,birthDay:i,birthCountry:k,birthState:k,birthCity:k,deathYear:i,deathMonth:i,deathDay:i,deathCountry:k,deathState:k,deathCity:k,nameFirst:t,nameLast:t,nameGiven:t,weight:i,height:i,bats:k,throws:k,debut:t,finalGame:t,retroID:t,bbrefID:t -t /dev/fd/0 -b ","

cd ../

node-gyp rebuild

node testfb.js

make sure your redis-server is running.

node app.js
