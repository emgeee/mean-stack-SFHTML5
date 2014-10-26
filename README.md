# MEAN Stack Demo

This is the code that accompanied a presentation on the MEAN stack to the SFHTML users group on Oct 30 2014.

MEAN (MongoDb + Express + Angular + Node) is an end-to-end technology stack for HTML/JavaScript applications.

## Prerequisites

You must have node/npm installed. The application can run with its in-memory database ... but then you'd only be looking at the EAN stack :-)

Install MongoDb first in order to run with the MongoDb database.

# Run it

This app requires both a backend server (for data) and a frontend server (for the client-side application and its assets).

Start them separately.

## Start the backend data server
* start your MongoDb server
* open a terminal or command window
* go to the `backend.v2` directory
* run `npm install`
* choose to run either with the in-memory db or with mongo
    * in-mem: 
   
			npm start
            node bin/www
            node-debug bin/www        (under node-inspector)

    * mongo:
    
            env MONGO=1 npm start
            node bin/www mongo
            node-debug bin/www mongo  (under node-inspector)

The terminal window tells you that the server is running and in which mode (in-mem or mongo).

## Start the frontend server

TBD


## Directory Structure

The following is a quick orientation to the salient structural features of this application

    /backend                  - ignore it
    
    /backend.v2               - the node/express/mongo data server
       /bin/www               - the launch point for server
       /public                - static client assets ... there are none as this is a data server
       /routes                - the router for the data api
       /services              - implementation of the in-memory and MongoDb data 
       API Requirements.md    - the "original" requirements for the data api
       app.js                 - the express server
       config.js              - server configuration values
       Postman_MEAN_Demo.json - Postman request collection, helpful in api exploration
       Tutorial.md            - How to build the backend from scratch
    
    /frontend                 - the client application written with angular 
      





