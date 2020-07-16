# Caper Petition Project

## next steps for part 1

separate part 1 into different parts

-   Server routes
    -   ✔️`GET /petition`
        -   renders petition template
    -   ✔️`POST /petition`
        -   renders petition template if there is an error
            -   for example, an error might happen if a user leaves an input field blank...
        -   redirects to thanks page if insert was successful
    -   ✔️`GET /thanks`
        -   get number of signers
        -   renders thanks template
    -   ✔️`GET /petition/signers`
        -   gets the first and last names of the signers from db and passes them to the signers template
-   Queries

    -   ✔️`INSERT` into signatures
    -   ✔️`SELECT` the names of the signers
    -   ✔️`SELECT` to figure out the number of signers

-   Handlebars Templates
    -   ✔️ petition (link JS file that contains code for canvas here)
    -   ✔️ thanks
    -   ✔️ signers
    -   ✔️ a layout (link jQuery, CSS here)
    -   any partials you want (optional)

## Part 1

Part one has three pages

1. ✔️`/petition`

    - `input` fields for first, last, `canvas` for signature, and button. all wrapped in a form!
    - `canvas`
    - you'll probably want to use jQuery
    - create a JS file in your public directory. this JS file in your public directory will contain all the code that allows the user to sign the `canvas`!
    - we'll need to add 3 events to the `canvas` element
    - ✔️`mousedown`
        - start drawing
    - ✔️`mousemove`

        - draws the line
        - it will follow the users cursor and draw lines along the way
        - we'll need to, in the `mousemove`, know where the user's cursor is within the canvas element

    - ✔️`mouseup`

        - finish drawing
        - we need to do two big things her:
        - turn the drawing into a url that we can `INSERT` into signatures
        - call `.toDataURL()` on the canvas to get that big url
        - send that big url to the server, and the server will then do the INSERT
        - we're going to put that big url in an input field
          so...
        - in our petition template, inside of the form tag, we will need 3 input fields: (1) first, (2) last, (3) signature
        - the signature input field will be hidden (give it `type='hidden'`)
        - when the user mouse's up, we can set the value of that input field to be the big url

    - ✔️`submit`
        - the form tag will automatically make a POST request to your server
        - you need to write a `app.post` in your server that will run when this request happens
        - in this app.post route, you need to take the input we got from the user (so their first, last, and signature) and `INSERT` it into our signatures table
        - how can get to a point in our server where we can log something and see, in our server, what input the user provided???
    - ✔️`INSERT` query

        - that will insert that first, last, and signature into the signatures table
        - write the query in your `db.js` file, but RUN it in `index.js`, in the app.post route
        - once the first, last, and signature have been successfully inserted into signatures, then redirect the user to the next page

    - ✔️`ERROR HANDLING`: render an error message on screen if...
        - the user leaves one of the input fields blank
        - or if some other type of unexpected error occurs

2. ✔️`/thanks`
    - renders a thank you message
      has a link to the next page
      render the number of signers.
3. ✔️`/signers`
    - `GET /petition/signers` route (in your server)...
    - run a `SELECT` query, that's going to `SELECT` every first and last name from signatures
    - once you can console log the results of that query and see in your Terminal all of the names of the signers...
    - then give that list of signers to your signers template
      and have the template render that list

## Next Steps for Pt. 2

1. ✔️ Remove cookie-parser - no longer using this & replace it with cookie-session middleware
2. ✔️ change the `POST /petition` route - add id of the signature in the cookie using cookie-session
3. ✔️ change the `GET /thanks` route to make a db query to get the signature url
    - render the signature onscreen by putting the sig url in an `<img>` tag in your thanks handlebars page

## Part 3 Auth - Log in & Registration

1.  ✔️ Templates: Add 2 new handlebars templates (registration & login)

    -   ✔️ Both templates should conditionally render error messages in case something goes wrong
    -   ✔️ Both templates should have a `<form>` that makes a `POST` request to the server when you click the submit / login button.

2.  Routes: Add 4 new routes in total

    -   ✔️ `GET /register`

    -   ✔️ `POST /register`

        -   ✔️ grab the user input and read it on the server
        -   ✔️ hash the password that the user typed and THEN
            insert a row in the USERS table (new table) -> see 3. for table structure
        -   ✔️ if the insert is successful, add `userId` in a cookie (value should be the id created by postgres when the row was inserted).
        -   ✔️ if insert fails, re-render template with an error message

    -   ✔️ `GET /login`

    -   ✔️ `POST /login`

        -   ✔️ get the user's stored hashed password from the db using the user's email address
        -   ✔️ pass the hashed password to `COMPARE` along with the password the user typed in the input field
        -   ✔️ if they match, `COMPARE` returns a boolean value of true
        -   ✔️ store the userId in a cookie
            -   ✔️ OPTIONAL: do a db query to find out if they've signed
                -   if yes, you want to put their sigId in a cookie & redirect to `/thanks`
                -   if not, redirect to `/petition`
                    if they don't match, `COMPARE` returns a boolean value of false & re-render with an error message

    -   ✔️ `POST /petition`
        -   alter your route so that you pass userId from the cookie to your query instead of first and last name

3.  ✔️ Tables

    -   ✔️ Create a new table for USERS

    ```
    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        first VARCHAR(255) NOT NULL,
        last VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ```

    -   ✔️ Modify the signatures Table
        -   this is what signatures should look like for pt 3 and on..
        -   don't run this file until you're at part 3!

    ```
        CREATE TABLE signatures(
            id SERIAL PRIMARY KEY,
            -- get rid of first and last!
            signature TEXT NOT NULL,
            user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
    ```

        -- here we are adding the foreign key (user_id)
        -- foreign key lets us identify which user from the users table signed the petition
        -- and which signature is theirs (acts as an identifier btw the 2 tables!)

4.  Queries
    -   ✔️ `INSERT` in users table (in `post /registration`)
    -   ✔️ `SELECT` to get user info by email address (in p`ost /login`)
    -   ✔️ `INSERT` for signatures table needs to be changed to include the user_id (in `post /petition`)
    -   ✔️ `SELECT` from signature to find out if they've signed (`post /login`)

## Part 4 Profile

1. Routes

    - `GET /profile`

        - redirect here immediately after registrations

        - render new profile template

    - `POST /profile`

        - if the user submitted a url, a city, an age or any combination of these three, insert into the user_profiles table

        - redirect to /petition upon success

            -easiest way to deal with javascript: urls, is before doing the insert confirm the url does start with either "https://", "http://", or "//".

            - If the url doesn't start with one of those good things, you can either throw the url away or prepend "http://"

    - `GET /signers/:city`

        - passes req.params.city to a query to get the signers by city

        - can use the existing signers template

    - `POST /login`
        - Change so that it no longer does a different query to get the signature id. Instead, it gets the signature id from the same query that gives the user id and password

2. Templates

    - profile.handlebars

        - form with fields for age, city, url

    - signers.handlebars
        - change to link first and last name if there is a url and show age and city if there are age and city

3. Queries

    - INSERT for new user_profiles table

    - A new SELECT for getting the signers

        - first and last name from the user table

        - age, city, and url from the user_profiles table

        - use the signatures table to limit whose data we show (we only want to show data for users whose ids are in the signatures table

    - A new SELECT that gets signers by city

        - identical to the query above but with an additional WHERE clause

        - Deal with cases: WHERE LOWER(city) = LOWER(\$1)

    - Change the SELECT that gets user id and password by email address to join the signatures table and get the signature id as well

    - Delete the SELECT signature id by user id because it is no longer needed

4. Tables

    - New user_profiles table

    ```
    CREATE TABLE user_profiles(
        id SERIAL PRIMARY KEY,
        age INT,
        city VARCHAR,
        url VARCHAR,
        user_id INT NOT NULL UNIQUE REFERENCES users(id)
    );
    ```

    - ✔️ Drop the signatures table and recreate it without first and last names
