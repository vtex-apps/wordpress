import { ClientsConfig, IOClients, LRUCache } from '@vtex/api'
import WordpressProxyDataSource from './wordpressProxy'

const TIMEOUT_MS = 8000

const defaultClientOptions = {
    retries: 2,
    timeout: TIMEOUT_MS,
}

const cacheStorage = new LRUCache<string, any>({ max: 5000 })
metrics.trackCache('wordpressProxy', cacheStorage)

export class Clients extends IOClients {
    public get wordpressProxy(): WordpressProxyDataSource {
        return this.getOrSet('wordpressProxy', WordpressProxyDataSource)
    }
}

export const clients: ClientsConfig<Clients> = {
    implementation: Clients,
    options: {
        default: defaultClientOptions,
        wordpressProxy: {
            //authType: AuthType.bearer,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            memoryCache: cacheStorage
        },
    },
}