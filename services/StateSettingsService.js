/**
 * State settings service
 */
export default class StateSettingsService
{
    /**
     * Settings state
     *
     * @type {object}
     */
    state = {}

    /**
     * State settings service constructor
     *
     * @param {object} state
     *
     * @return {undefined}
     */
    constructor(state)
    {
        /**
         * @private
         */
        this.state = state || {}
    }

    /**
     * Get page size limit
     *
     * @return {Array.<number>}
     */
    getPageSizeLimit = () => {
        return this.state.pageSizeLimit || []
    }
}
