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
        -   if insert fails, re-render template with an error message

    -   ✔️ `GET /login`

    -   ✔️ `POST /login`

        -   ✔️ get the user's stored hashed password from the db using the user's email address
        -   ✔️ pass the hashed password to `COMPARE` along with the password the user typed in the input field
        -   ✔️ if they match, `COMPARE` returns a boolean value of true
        -   ✔️ store the userId in a cookie
            -   OPTIONAL: do a db query to find out if they've signed
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
