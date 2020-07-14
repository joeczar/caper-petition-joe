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

1. Remove cookie-parser - no longer using this & replace it with cookie-session middleware
2. change the `POST /petition` route - add id of the signature in the cookie using cookie-session
3. change the `GET /thanks` route to make a db query to get the signature url
    - render the signature onscreen by putting the sig url in an `<img>` tag in your thanks handlebars page

## Part 3 Auth - Log in & Registration

1. Add a `users` table to the database.
    - `userId | first | last | email | hash`
2. Update Signatures table with column for `userId` in order to map users & signatures.
3. Registration & Login pages need to be able to be updated with error messages.
    - Both need a `<form>` that makes a `POST` request
4. First name, last name, email address & password should all be required fields.
    - Emails should unique & enforced by a constraint int the column
5. After login, attach a user object to `req.session`.
