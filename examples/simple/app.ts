import SSEClient from '../../src/index'

const client = new SSEClient()
client.addEventListener('chat', (response) => {
  console.log(response)
})
client.request({
  url: 'http://localhost:8080/rest/chat/stream2',
  method: 'post',
  data: {typeId: 1, content: "你好"}
})
