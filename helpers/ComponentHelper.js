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
     * @param {Object|null|undefined} callbackParams
     *
     * @return {ComponentHelper}
     */
    static fetchIfNotExist(storeProp, callback, callbackParams)
    {
        if (storeProp === null || (storeProp.result !== undefined && storeProp.result === null)) {
            callback(callbackParams)
        }

        return ComponentHelper
    }
}
