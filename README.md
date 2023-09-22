# Auctions marketplace web application
Welcome to project of end of studies that covered the topic of an auctions marketplace achieved using mainly ReactJS/Symfony/NodeJS. i worked on this project for about 3 to 4 months including a full 40 pages report in french about it. This project was a big step for me in my journey of Web development but i am aware that i'm still at the beginnings and i still have a lot to learn.

## The idea of the project
the initial idea was to create a digital marketplace where people compete over a product regardless of its nature by bidding for the best price. We also implemented reversed auctions which are people listen a need for a specific product and people could promote their products that answer the need.

## What's special about our app compared to a traditional auction marketplace

- the standard services are free : we remove most boundaries like the price of publishing a product in the auction , the initial amount that you need to pay in order to be able to bid for a certain product and more.

- Time flexibility : We made the time in which the auction will take place and its duration flexible and for the announcer to freely choose

- Reversed auctions : A user can publish the need of a certain item and people could promote the products they have which they believe that they answer the need (this feature needs to be tested to verify its success)

## features

- Registration and authentication: users can create an account and sign to be able to use the features of the application.

- Listing creation: users can list the items that they want to sell in the application.

- Bidding system : the application proves bidding functionality to place bids on items. also a Real-time bidding updates with bid history is implemented.

- Auction timer : Countdown timers to display the time remaining for each auction to start and for it to end.

- Watchlist : users can watch an auction and receive notifications about any updates that concern it.

- Administrative Tools : the app provides an admin dashboard that allows him to manage most of the app's data

- Real time features : prices are being updated on real time.

## technologies used:

- ReactJS: the frontend of the application which provides interfaces to interact with the end User
  
- Symfony: the backend of the application. Used to create the APIs and the Admin dashboard
  
- NodeJS: used to implement the real time features to the application via Socket.io

- MySql: this application uses a MySql database server to store data

##how to use

you need to have symfony, composer , a mysql server and nodeJS installed in your machine to run this project

symfony: https://symfony.com/download

composer: https://getcomposer.org/download/

xampp for the mysql server (you can use an alternative): https://www.apachefriends.org/

nodeJS : https://nodejs.org/en

once you have these two you should clone the project:

```console
git clone https://github.com/sorrow112/Auctions-Marketplace-frontend.git
```

then you move into the folder where you have the project on your console and install the dependecies then run the project

```console
npm install
npm start
```

then you have to clone the backend  into another seperate folder:

```console
git clone https://github.com/sorrow112/Auction-Marketplace-backend.git
```

make sure to run the database server and configure the connection to it in your .env file (see symfony documentation if you need help with that https://symfony.com/doc/current/doctrine.html#configuring-the-database)
After that install dependencies and run the backend 

```console
composer install
symfony server:start
```
if something didn't work properly you can consult the symfony documentation for a step by step guide : https://symfony.com/doc/5.4/index.html

(i promise this will be the last step :D)
you need to clone the last part of the application into a seperate folder. this is the websocket part of the code.

```console
git clone https://github.com/sorrow112/socket.io_pfe.git
```

then you install dependencies for this too and run it
```console
npm install
npm run devStart
```

the app should be up and running if you followed the steps , if you run into problems please make sure to contact me on my email address below and i'd gladly do my best to help

## Contact me

via email: jguirimahmed112@gmail.com
