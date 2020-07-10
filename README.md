# Caper Petition Project

## Part 1

Part one has three pages

1. Petition Page

    - Form with `firstName`, `lastName`
    - Canvas Element for `signature`
        - use jQuery
        - js file in public directory
        - 3 events for the canvas element
            1. `mousedown`
                - start drawing
            2. `mousemove`
                - follow mouse and draw on canvas
            3. `mouseup`
                - stops drawing
                - turn drawing into url
                    - call `.toDataUrl` on canvas to generate
                - find way to send that to server
                    - put sig url into an inputfield
    - Input fields - firstName, lastName, signature (hidden)
    - Submit button
        - form tag makes post request to server.
        - create a post route in server that handles this request

2) Thank You Page
