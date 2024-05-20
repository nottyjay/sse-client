import SSERequestConfig from "./SSERequestConfig";
import {processHeaders} from './type/header'

import {transformRequest, bulidURL} from './utils'


class SSEClient {
  config: SSERequestConfig

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
    while(true){
      const result = reader.read();
      if ((result as ReadableStreamReadResult<Uint8Array>).done !== undefined) {
        const { value, done } = result as ReadableStreamReadResult<Uint8Array>;
        // 使用value和done...
      } else {
        console.error('结果不符合预期的类型');
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