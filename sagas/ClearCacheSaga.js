import { CacheHelper } from '../helpers/CacheHelper'

/**
 * Check old cache and remove
 *
 * @param {Array.<string>} keys
 *
 * @return {IterableIterator<*>}
 * @constructor
 */
export const ClearCache = function* ({keys}) {
    if (!keys || keys.length === 0) {
        return
    }

    keys.map(uniqueKey => {
        CacheHelper.clearOldCache(uniqueKey)
    })
}