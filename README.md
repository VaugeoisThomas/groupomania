# Groupomania

Welcome to groupomania repository !

## Installation

1. Clone the repository
2. Execute the following command on your terminal `npm install` from backend and frontend folder
*It will install all depencies that you need to properly launch the differents servers.*
3. Make sure you've sequelize-cli installed. If it's done, you could go to step 4
4. Execute the following command to create the database: `npx sequelize db:create`
5. Then you should migrate differents migrations like this : `npx sequelize db:migrate`
6. Now, you've to run the following commands: `npx sequelize-cli db:seed:all`

At this point you've installed all the different files you could execute following command lines.

## Launching the differents servers

1. Open two different terminal  
  * One for front-end  
  * Other one for back-end
2. On front-end terminal you have to execute `npm run serve`
3. On back-end terminal you have to execute  `nodemon server.js`
4. Finally, open your browser and you should go to [localhost](http://localhost:8080/)

## On the website

You can login with:
- Email: Admin@groupomania.com
- Password: Password09

But you can also create another account

You may have a strong password :
* minimum 8 characteres
* contains one capital letter
* have two numbers   

You can write a post, write a comment on one post.
You can delete your comment or post
You can modify your account, delete your account.

## Administration

You can modify an user account, delete a account,
You can also delete a post or a comment !

Enjoy your visit.
