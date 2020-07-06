import { BaseHelper } from './BaseHelper'

/**
 * Cache helper
 */
export class CacheHelper
{
    /**
     * @type {createWebStorage}
     * @private
     */
    static storage = null

    /**
     * Set helper storage
     *
     * @param {Object} storage
     *
     * @return {undefined}
     */
    static setStorage(storage)
    {
        CacheHelper.storage = storage
    }

    /**
     * Get storage
     *
     * @return {createWebStorage}
     */
    static getStorage()
    {
        if (CacheHelper.storage === null) {
            CacheHelper.storage = require('../storage/AsyncStorage').default
        }

        return CacheHelper.storage
    }

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
            const cacheStore = JSON.parse(await CacheHelper.getStorage().getItem(uniqueKey) || '{}')

            if (cacheStore[fullKey]) {
                delete cacheStore[fullKey]

                CacheHelper.getStorage().setItem(uniqueKey, JSON.stringify(cacheStore))
            }

            return CacheHelper.getStorage().removeItem(fullKey)
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
            const cachedResponse = await CacheHelper.getStorage().getItem(fullKey)

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
            const cacheStore = JSON.parse(await CacheHelper.getStorage().getItem(uniqueKey) || '{}')
            const time       = Date.now()

            cacheStore[fullKey] = {expiration, time}

            CacheHelper.getStorage().setItem(uniqueKey, JSON.stringify(cacheStore))

            return CacheHelper.getStorage().setItem(fullKey, JSON.stringify({
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
            const cacheStore = JSON.parse(await CacheHelper.getStorage().getItem(uniqueKey) || '{}')

            const keys = []

            keys.push(uniqueKey)

            if (cacheStore) {
                keys.push(...Object.keys(cacheStore))
            }

            return CacheHelper.getStorage().multiRemove(keys)
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
            const cacheStore = JSON.parse(await CacheHelper.getStorage().getItem(uniqueKey) || '{}')

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
                CacheHelper.getStorage().multiRemove(keys)

                return CacheHelper.getStorage().setItem(uniqueKey, JSON.stringify(cacheStore))
            }
        } catch (e) {
        }

        return null
    }
}
