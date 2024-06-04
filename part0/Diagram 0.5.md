```mermaid

sequenceDiagram
    participant browser
    participant server
   
    browser->>server: GET  https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML 200 (OK) without redirect
    deactivate server
    
    Note right of browser: Now browser will request files in HTML (CSS and JS)
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: main.css
    deactivate server
        
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: spa.js
    deactivate server
    
    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{content: "note_1", date: "2024-06-04T12:51:32.377Z"},…]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes