import SSERequestConfig from "./SSERequestConfig";
import { MessageCallback,ErrorCallback } from "./type/callback";
import {processHeaders} from './type/header'

import {transformRequest, bulidURL} from './utils'


class SSEClient {
  config: SSERequestConfig
  error?: ErrorCallback
  singleCallback?: MessageCallback
  eventCallback?:{[event:string]: MessageCallback}
  utf8decoder:TextDecoder = new TextDecoder()


  constructor(config: SSERequestConfig){
    this.config = config
  }

  async request(config: SSERequestConfig): Promise<void> {
    this.processConfig(config)

    const response = await fetch(config.url, {
      method: config.method,
      headers: config.headers,
      body: config.data
    })

    const reader = response.body?.getReader()
    let content:string = ''
    while(true){

      const result = await (reader?.read() as Promise<ReadableStreamReadResult<Uint8Array>>);
      if(result){
        const { value, done } = result
        if(done){
          break
        }
        content = this.utf8decoder.decode(value)
        if(content !== ''){
          var index = content.indexOf("\n\n");
          if(index != -1){
            var strs = content.substring(0, index).split("\n")
            content = content.substring(index+2)
            if(strs.length == 2 && strs[0].indexOf('event') === 0){// 第一条是event事件
              const regex = /event:(\w+)/; // 正则表达式，匹配以'event:'开头，后面跟着一个或多个字母数字的字符

              // 使用match方法
              const matchResult = strs[0].match(regex);

              if (matchResult) {
                const event:string = matchResult[1]; // 第一个括号中的内容会被捕获为一个分组，可以通过索引1获取
                const regexData = /data:(.*)/;
                const matchResultData = strs[1].match(regexData);
                if(matchResultData) {
                  const data = matchResultData[1]
                  this.eventCallback?.[event]?.(data)
                }
              } else {
                console.log('No match found');
              }
            }else{
              const regexData = /data:(\w+)/;
              const matchResultData = strs[0].match(regexData);
              if(matchResultData) {
                const data = matchResultData[1]
                this.singleCallback?.(data)
              }
            }
          }
        }
      } else {
        this.error?.('读取失败或结果为空')
      }

    }
  }

  processConfig (config: SSERequestConfig): void {
    config.url = this.transformURL(config)
    config.headers = this.transformHeaders(config)
    config.data = this.transformRequestData(config)
  }
  
  transformURL (config: SSERequestConfig): string {
    const { url, params } = config
    return bulidURL(url, params)
  }

  transformRequestData (config: SSERequestConfig): any {
    return transformRequest(config.data)
  }

  transformHeaders (config: SSERequestConfig) {
    const { headers = {}, data } = config
    return processHeaders(headers, data)
  }
}