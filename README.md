# MEAN Stack Demo

MEAN (MongoDb + Express + Angular + Node) is an end-to-end technology stack for HTML/JavaScript applications.

This is the code that accompanied a presentation on the MEAN stack to the SFHTML users group on Oct 30 2014.

Copyright (c) 2014 Alicia Liu, Matt Green, and Ward Bell

License: MIT

[Link to presentation videos](https://thenewcircle.com/s/post/1679/get_mean_a_three_part_introduction_to_the_mean_stack_video)

[Slides for MEAN overview and Node/Express](https://docs.google.com/presentation/d/1p-7iLAIBR6PZ1tz1n21g_ONbdf7nkIgyscMOczdZgKA)

[Slides for Mongo Talk](https://docs.google.com/presentation/d/1Ze2PbPNAel0ETuNS1mTYk7spPXwbPxdUaqiAgw5B6Zs/edit?usp=sharing)

[Slides for Angular talk](http://emgeee.github.io/mean-stack-SFHTML5/slides/angular)

## Prerequisites

You must have [**node**](http://nodejs.org/) installed. The application can run with its in-memory database ... but then you'd only be looking at the EAN stack :-)

Install [**MongoDb**](http://www.mongodb.org/) in order to run the app with the MongoDb database.

[**Nodemon**](https://github.com/remy/nodemon) and [**node-inspector**](https://github.com/node-inspector/node-inspector) are two handy node runners; they are not required.

# Run it

This app requires *three* servers

* MongoDb database server
* backend data server 
* frontend server for the client-side app and its assets

Start them separately.

## Start the MongoDb server

Much depends upon your development environment. Assuming that the `mongod` command is available, the following may work for you:
* open a terminal/command window
* change directory to the root of the project
* `mongod --dbpath database`

The last step launches the MongoDb server, pointing it (via `--dbpath`) to the "database" directory under the project root as the place to put the app database.

## Start the backend data server

* open a terminal or command window
* open a terminal or command window
* go to the `backend` directory
* run `npm install`
* choose to run either with the in-memory db or with mongo
    * in-mem: 
   
			npm start
            node bin/www
			nodemon bin/www           (auto-restarts node)
            node-debug bin/www        (under node-inspector)

    * mongo:
    
            env MONGO=1 npm start
            node bin/www mongo
			nodemon bin/www  mongo    (auto-restarts node)
            node-debug bin/www mongo  (under node-inspector)

The terminal window tells you that the server is running and in which mode (in-mem or mongo).

You can try the GET apis in a browser. `localhost:4567` presents an "API test page" with sample links such as:

	http://localhost:4567/api/questions
	http://localhost:4567/api/questions?limit=3
	http://localhost:4567/api/questions/summaries
	http://localhost:4567/api/questions/summaries?sort=votes&limit=5
	http://localhost:4567/api/questions/5448b56b57675cbc246e6dbd

You'll have to use a tool like `curl` to try the POST methods. 

We think the [Postman chrome plugin](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en) is a great API exploration tool. We've made it easy for you by preparing some requests in a Postman json file. 

Import those requests as follows:

- Open Postman
- Click the **Collections** button
- Click the **inbox icon**
- Drag *backend/Postman_MEAN_Demo.json* onto the dialog box

You should see a new collection called "MEAN Demo". Have fun.

## Start the frontend server

This section of the code is a separate static site that consumes the data API created in `backend`.

You can run it by serving up the assets in `frontend/app` in a simple HTTP server, such as [http-server](https://github.com/nodeapps/http-server).

	npm install http-server -g # one-time only
	cd frontend/app
	http-server -p 3000 # default port is 8080

Now you can access the demo at `http://localhost:3000`


## Directory Structure

The following is a quick orientation to the salient structural features of this application

    /backend                  - the node-express-mongo data server
       /bin/www               - the launch point for the server
       /dataservice           - the in-memory and MongoDb data services
       /public                - static client assets ... there are none as this is a data server
       /routes                - the router for the data api
       API Requirements.md    - the "original" requirements for the data api
       app.js                 - the express server
       Postman_MEAN_Demo.json - Postman request collection, helpful in api exploration
       Tutorial.md            - How to build the backend from scratch
    
    /frontend                 - the client application written with angular 
       /app
           app.js             - the root application module
           /scripts           - application JavaScript
               /controllers   - control view presentation
               /directives
               /services      - access the data service
           /views             - HTML templates w/ Angular markup
