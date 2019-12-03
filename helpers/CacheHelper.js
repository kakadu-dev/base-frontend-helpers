import storage from '../storage/AsyncStorage'
import { BaseHelper } from './BaseHelper'

/**
 * Cache helper
 */
export class CacheHelper
{
    /**
     * Get cache full key
     *
     * @param {string} key
     * @param {string} uniqueKey
     *
     * @return {string}
     */
    static getFullCacheKey(key, uniqueKey)
    {
        const cacheKey = BaseHelper.strToHash(key)

        return `${uniqueKey}:${cacheKey}`
    }

    /**
     * Remove cache key
     *
     * @param {string} key
     * @param {string} uniqueKey
     *
     * @return {Promise}
     */
    static async removeItem(key, uniqueKey = 'cache')
    {
        const fullKey = CacheHelper.getFullCacheKey(key, uniqueKey)

        try {
            const cacheStore = JSON.parse(await storage.getItem(uniqueKey) || '{}')

            if (cacheStore[fullKey]) {
                delete cacheStore[fullKey]

                storage.setItem(uniqueKey, JSON.stringify(cacheStore))
            }

            return storage.removeItem(fullKey)
        } catch (e) {
            return null
        }
    }

    /**
     * Get cache
     *
     * @param {string} key
     * @param {string} uniqueKey
     *
     * @return {object|null}
     */
    static async getItem(key, uniqueKey = 'cache', expiration)
    {
        const fullKey = CacheHelper.getFullCacheKey(key, uniqueKey)

        try {
            const cachedResponse = await storage.getItem(fullKey)

            if (!cachedResponse) {
                return null
            }

            const cache      = JSON.parse(cachedResponse)
            const timePassed = (Date.now() - cache.time) / 1000

            // Valid cache
            if (timePassed < cache.expiration) {
                if (!expiration || expiration === cache.expiration) {
                    return cache.payload
                }
            }

            CacheHelper.removeItem(key, uniqueKey)
        } catch (e) {
        }

        return null
    }

    /**
     * Set cache
     *
     * @param {string} key
     * @param {*} value
     * @param {number} expiration
     * @param {string} uniqueKey
     *
     * @return {Promise<Promise<*>|void>}
     */
    static async setItem(key, value, expiration = 3600, uniqueKey = 'cache')
    {
        const fullKey = CacheHelper.getFullCacheKey(key, uniqueKey)

        try {
            const cacheStore = JSON.parse(await storage.getItem(uniqueKey) || '{}')
            const time       = Date.now()

            cacheStore[fullKey] = {expiration, time}

            storage.setItem(uniqueKey, JSON.stringify(cacheStore))

            return storage.setItem(fullKey, JSON.stringify({
                payload: value,
                time,
                expiration,
            }))
        } catch (e) {
            return null
        }
    }

    /**
     * Clear cache
     *
     * @param {string} uniqueKey
     *
     * @return {Promise<null|*>}
     */
    static async clearCache(uniqueKey = 'cache')
    {
        try {
            const cacheStore = JSON.parse(await storage.getItem(uniqueKey) || '{}')

            const keys = []

            keys.push(uniqueKey)

            if (cacheStore) {
                keys.push(...Object.keys(cacheStore))
            }

            return storage.multiRemove(keys)
        } catch (e) {
            return null
        }
    }

    /**
     * Remove expired cache
     *
     * @param {string} uniqueKey
     *
     * @return {Promise<Promise<Promise<*>|void>|void|null>}
     */
    static async clearOldCache(uniqueKey = 'cache')
    {
        try {
            const cacheStore = JSON.parse(await storage.getItem(uniqueKey) || '{}')

            if (!cacheStore) {
                return null
            }

            const now  = Date.now()
            const keys = []

            Object.entries(cacheStore).map(([key, data]) => {
                const timePassed = (now - data.time) / 1000

                if (timePassed > data.expiration) {
                    keys.push(key)

                    delete cacheStore[key]
                }
            })

            if (keys.length > 0) {
                storage.multiRemove(keys)

                return storage.setItem(uniqueKey, JSON.stringify(cacheStore))
            }
        } catch (e) {
        }

        return null
    }
}
