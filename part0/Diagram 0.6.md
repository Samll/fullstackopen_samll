```mermaid

sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note left of server: Independently of Server comms, JS updates the content of the list
    Note left of server: Payload: {content: "as", date: "2024-06-04T18:07:40.871Z"}
    server-->>browser: HTTP 201 (Created) 
    deactivate server