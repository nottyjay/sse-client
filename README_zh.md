# SSE-Client
SSEClient是一个面向SSE通信开发的Web组件库，在组件基础功能之上提供了针对SSE返回接口的`POST`,`GET`等请求方式，并支持请求类型自定义。
## EventSource
针对SSE接口，传统方式为采用`EventSource`类进行开发，例如：
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
由于`EventSource`仅支持`GET`请求，无法做到向服务器提交新的文本请求，在使用`OpenAI`之类接口时候，如果想采用SSE方式通讯就需要使用`fetch`方式。

## 使用
```
npm install sse-client
```
```javascript
const client = new SSEClient()
client.addListener((data) => {
  console.log(data)
})
client.post({
  url: 'http://localhost/v1/chat/completions',
  data: {message: 'Hello!'}
})
// client.request({
//   url: 'http://localhost/v1/chat/completions', 
//   method: 'post',
//   data: {message: 'Hello!'} 
// })
```
当需要处理Event时，可以使用
```javascript
const client = new SSEClient()
client.addEventListener('chat', (data) => {
  console.log(data)
})
client.post({
  url: 'http://localhost/v1/chat/completions',
  data: {message: 'Hello!'}
})
// client.request({
//   url: 'http://localhost/v1/chat/completions', 
//   method: 'post',
//   data: {message: 'Hello!'} 
// })
```