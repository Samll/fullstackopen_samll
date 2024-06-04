```mermaid

sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note left of server: Redirected answer (302) to https://studies.cs.helsinki.fi/exampleapp/notes
    server-->>browser: HTTP 302 (redirect)
    deactivate server
    
    Note right of browser: Redirected to notes again, to retrieve all notes

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML 200 (OK) that reloads the page
    deactivate server
    
    Note right of browser: Now browser will request files in HTML (CSS and JS)
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{content: "note_1", date: "2024-06-04T12:51:32.377Z"},…]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes