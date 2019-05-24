import { AuthType, ClientsConfig, IOClients, LRUCache } from '@vtex/api'
import WordpressDataSource from './wordpress'

const TIMEOUT_MS = 8000

const defaultClientOptions = {
    retries: 2,
    timeout: TIMEOUT_MS,
}

const memoryCache = new LRUCache<string, any>({ max: 5000 })
metrics.trackCache('wordpress', memoryCache)

export class Clients extends IOClients {
    public get wordpress(): WordpressDataSource {
        return this.getOrSet('wordpress', WordpressDataSource)
    }
}

export const clients: ClientsConfig<Clients> = {
    implementation: Clients,
    options: {
        default: defaultClientOptions,
        wordpress: {
            authType: AuthType.bearer,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            memoryCache,
        },
    },
}