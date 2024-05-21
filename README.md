# SSE-Client
The SSEClient is a web component library specifically designed for SSE (Server-Sent Events) communication. It extends the basic functionality by providing `POST`, `GET`, and custom request methods tailored to SSE endpoints.

## EventSource
Traditionally, when working with SSE endpoints, developers use the `EventSource` class, like so:
```javascript
 const source = new EventSource('https://example.com/events'); 
 source.addEventListener('message', (event) => { 
  console.log('Received:', event.data); 
 }); 
 source.addEventListener('open', () => { 
  console.log('Connection opened'); 
 }); 
 source.addEventListener('error', (event) => { 
  if (event.readyState === EventSource.CLOSED) { 
    console.log('Connection closed'); 
  } else { 
    console.error('An error occurred:', event); 
  } 
 });
```

However, `EventSource` only supports `GET` requests, making it unable to send new text requests to the server. When using APIs like `OpenAI`, and you want to communicate via SSE, you'd typically need to use the `fetch` method.

## Usage
```bash 
npm install sse-web-client
```
```javascript 
import SSEClient from 'sse-web-client'
const client = new SSEClient() 
client.addListener((data) => { 
  console.log(data) 
}) 
client.post({ 
  url: 'http://localhost/v1/chat/completions', 
  data: {message: 'Hello!'} 
})
```
When handling events, you can do the following:
```javascript
const client = new SSEClient() 
client.addEventListener('chat', (data) => { 
  console.log(data) 
}) 
client.post({ 
  url: 'http://localhost/v1/chat/completions', 
  data: {message: 'Hello!'} 
})
```