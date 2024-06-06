import SSEClient from '../../src/index'

const client = new SSEClient()
client.addEventListener('document', (data) => {
  const backData = JSON.parse(data)
})
client.addEventListener('chat', (data) => {
  const backData = JSON.parse(data)
  // console.log(backData,'chat')
})
client.request({
  url: 'http://ai.alphay.local/prod-api/rest/chat/stream2',
  method: 'post',
  data: {typeId: 1, content: "请问都有哪些产品"}
})
