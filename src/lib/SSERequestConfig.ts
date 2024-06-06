import { Method } from "./type/methods"

export default interface SSERequestConfig {
  url: string,
  method?: Method,
  data?: any,
  params?: any,
  headers?: any,
  signal?: AbortSignal
}