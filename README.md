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

You can easily access the GET apis in a browser. Try these URLs:

	http://localhost:4567/api/questions
	http://localhost:4567/api/questions?limit=3
	http://localhost:4567/api/questions/summaries
	http://localhost:4567/api/questions/summaries?sort=votes&limit=5
	http://localhost:4567/api/questions/5448b56b57675cbc246e6dbd

You'll want to use a tool like `curl` to try the POST methods. 

We think the [Postman chrome plugin](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en) is a great API exploration tool. We've made it easy for you by preparing some requests in a Postman json file. 

Import those requests as follows:

- Open Postman
- Click the **Collections** button
- Click the **inbox icon**
- Drag *backend.v2/Postman_MEAN_Demo.json* onto the dialog box

You should see a new collection called "MEAN Demo". Have fun.

## Start the frontend server

This section of the code is a separate static site that consumes the data API created in `backend`.

You can run it by serving up the assets in `frontend/app` in a simple HTTP server, such as [http-server](https://github.com/nodeapps/http-server).
```
npm install http-server -g
cd frontend/app
http-server -p 3000 # default port is 8080
```

Now you can access the demo at http://localhost:3000


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
      





