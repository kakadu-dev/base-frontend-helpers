/**
 * Component helper
 */
export default class ComponentHelper
{
    /**
     * If store property is null, trigger callback func
     * Callback func may be action creator
     *
     * @param {Object|null|undefined} storeProp
     * @param {function} callback
     * @param {Object} callbackParams
     * @param {boolean} isList
     *
     * @return {ComponentHelper}
     */
    static fetchIfNotExist(storeProp, callback, callbackParams = {}, isList = false)
    {
        if ((isList && !storeProp?.result?.list?.length) ||
            (storeProp === null || storeProp.result !== undefined && storeProp.result === null)) {

            callback(callbackParams)
        }

        return ComponentHelper
    }
}
