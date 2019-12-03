/**
 * Component helper
 */
export default class ComponentHelper
{
    /**
     * If store property is null, trigger callback func
     * Callback func may be action creator
     *
     * @param storeProp
     * @param callback
     *
     * @return {ComponentHelper}
     */
    static fetchIfNotExist(storeProp, callback)
    {
        if (storeProp === null || (storeProp.result !== undefined && storeProp.result === null)) {
            callback()
        }

        return ComponentHelper
    }
}
