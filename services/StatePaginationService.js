/**
 * State pagination service
 */
export default class StatePaginationService
{
    /**
     * Pagination state
     *
     * @type {object}
     */
    state = {}

    /**
     * State pagination service constructor
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
     * Get total items
     *
     * @return {number}
     */
    getTotalItems = () => {
        return this.state.totalItems || 0
    }

    /**
     * Get page count
     *
     * return {number}
     */
    getPageCount = () => {
        return this.state.pageCount || 0
    }

    /**
     * Get current page
     *
     * return {number}
     */
    getCurrentPage = () => {
        return this.state.currentPage || 0
    }

    /**
     * Get per page
     *
     * return {number}
     */
    getPerPage = () => {
        return this.state.perPage || 0
    }
}
