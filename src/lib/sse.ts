import SSERequestConfig from "./SSERequestConfig";
import Options from "./type/options";
import { MessageCallback, ErrorCallback } from "./type/callback";
import { processHeaders } from './type/header'

import { transformRequest, bulidURL } from './utils'

export default class SSEClient {
  error?: ErrorCallback
  singleCallback?: MessageCallback
  eventCallback?: { [event: string]: MessageCallback }
  utf8decoder: TextDecoder = new TextDecoder()
  option?: Options
  content?: string

  SSEClient(option: Options) {
    this.option = (option === null ? option : new Options())
  }

  async request(config: SSERequestConfig): Promise<void> {
    this.processConfig(config)

    const response = await fetch(config.url, {
      method: config.method,
      headers: config.headers,
      body: config.data,
      signal: config.signal
    })

    const reader = response.body?.getReader()
    this.content = ''
    while (true) {

      const result = await (reader?.read() as Promise<ReadableStreamReadResult<Uint8Array>>);
      if (result) {
        const { value, done } = result
        if (done) {
          if (this.content !== '') {
            this.convertContent()
          }
          break
        }
        this.content += this.utf8decoder.decode(value)
        if (this.content !== '') {
          this.convertContent()
        }
      } else {
        this.error?.('读取失败或结果为空')
      }

    }
  }

  post(config: SSERequestConfig): Promise<void> {
    config.method = 'post'
    return this.request(config)
  }

  get(config: SSERequestConfig): Promise<void> {
    config.method = 'get'
    return this.request(config)
  }

  addEventListener(event: string, handler: MessageCallback) {
    this.eventCallback = this.eventCallback || {};
    this.eventCallback[event] = handler
  }

  addListener(handler: MessageCallback) {
    this.singleCallback = handler
  }

  processConfig(config: SSERequestConfig): void {
    config.url = this.transformURL(config)
    config.headers = this.transformHeaders(config)
    config.data = this.transformRequestData(config)
    config.signal = config.signal ? config.signal : new AbortController().signal
  }

  transformURL(config: SSERequestConfig): string {
    let { url, params } = config
    if (this.option?.base !== null && url.indexOf('http') !== 0) {
      url = this.option?.base + url
    }
    return bulidURL(url, params)
  }

  transformRequestData(config: SSERequestConfig): any {
    return transformRequest(config.data)
  }

  transformHeaders(config: SSERequestConfig) {
    const { headers = {}, data } = config
    return processHeaders(headers, data)
  }

  convertContent() {
    let contents = this.content!.split("\n\n");
    if (contents.length > 1) {
      let size = contents.length
      this.content = contents[size - 1]

      for (let i = 0; i < size - 1; i++) {
        let strs = contents[i].split("\n")
        if (strs.length === 2 && strs[0].indexOf('event') === 0) {// 第一条是event事件
          const regex = /^event:(.*)$/; // 正则表达式，匹配以'event:'开头，后面跟着一个或多个字母数字的字符

          // 使用match方法
          const matchResult = strs[0].match(regex);

          if (matchResult) {
            const event: string = matchResult[1]; // 第一个括号中的内容会被捕获为一个分组，可以通过索引1获取
            const regexData = /^data:(.*)$/;
            const matchResultData = strs[1].match(regexData);
            if (matchResultData) {
              const data = matchResultData[1]
              this.eventCallback?.[event]?.(data)
            }
          } else {
            console.log('No match found');
          }
        } else {
          const regexData = /^data:(.*)$/;
          const matchResultData = strs[0].match(regexData);
          if (matchResultData) {
            const data = matchResultData[1]
            this.singleCallback?.(data)
          }
        }
      }
    }
  }
}