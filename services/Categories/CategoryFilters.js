import _ from 'lodash'
import StateService from '../StateService'

/**
 * Category filters
 */
export default class CategoryFilters
{
    /**
     * @property default state
     * @private
     *
     * @type {{orderBy: {column: string, direction: string}, filters: {}}}
     */
    defaultState = {
        orderBy: {
            column:    '',
            direction: '',
        },
        filters: {},
    }

    /**
     * @property response service
     * @private
     *
     * @type {StateService}
     */
    responseService = {}

    /**
     * @property filters state
     * @private
     *
     * @type {object}
     */
    state = {}

    /**
     * Create new category filter
     *
     * @param {object} object
     * @param {object} state
     *
     * @return {undefined}
     */
    constructor(object, state)
    {
        /**
         * @private
         */
        this.responseService = StateService.create(object || {})

        /**
         * @private
         */
        this.state = {
            ...(this.defaultState),
            ...(state || {}),
        }
    }

    /**
     * Create instance
     *
     * @param {object} object
     * @param {object} state
     *
     * @return {CategoryFilters}
     */
    static create(object, state)
    {
        return new this(object, state)
    }

    /**
     * Get empty state
     * Remove keys from state
     *
     * @param {object} defaultState begin values
     *
     * @return {object}
     */
    static getEmptyState = (defaultState) => {
        const state = {...CategoryFilters.create().defaultState}

        // Set begin state
        if (defaultState) {
            if (defaultState.properties) {
                state.filters = defaultState.properties
            }

            if (defaultState.orderBy) {
                state.orderBy.column    = defaultState.orderBy.replace('-', '')
                state.orderBy.direction = defaultState.orderBy.indexOf('-') !== -1 ? '-' : ''
            }
        }

        return state
    }

    /**
     * Check if empty filters
     *
     * @param {object} state
     *
     * @return {undefined}
     */
    static isEmpty = (state) => {
        return !(state && state.orderBy && state.orderBy.column !== '') && _.isEmpty(state.filters)
    }

    /**
     * Get actual state
     *
     * @return {Object}
     */
    getState = () => {
        return this.state
    }

    /**
     * Get current order column title
     *
     * @return {string}
     */
    getCurrentOrderTitle = () => {
        const {orderBy} = this.state

        const sortList    = this.responseService.getResultKey('sort', {})
        const sortDefault = this.responseService.getResultKey('sortDefault')

        return sortList[orderBy.column] || sortList[sortDefault] || ''
    }

    /**
     * Get current order column
     *
     * @return {string|string}
     */
    getCurrentOrderColumn = () => {
        const {orderBy} = this.state

        const sortDefault = this.responseService.getResultKey('sortDefault')

        return orderBy.column || sortDefault || ''
    }

    /**
     * Set order
     *
     * @param {string} column
     * @param {string} direction
     *
     * @return {CategoryFilters}
     */
    setOrder = (column, direction = '') => {
        this.state.orderBy = {
            column,
            direction,
        }

        return this
    }

    /**
     * Get sort list
     *
     * @param {function} callback
     *
     * @return {*[]|*}
     */
    getSortList = (callback) => {
        const sort = this.responseService.getResultKey('sort', {})

        if (typeof callback === 'function') {
            return Object.entries(sort).map(([column, title]) => {
                return callback(column, title)
            })
        }

        return sort
    }

    /**
     * Get filters
     *
     * @return {Array.<object>}
     */
    getFilters = () => {
        return this.responseService.getResultKey('filters', [])
    }

    /**
     * Get filter values
     *
     * @param {object} filter
     * @param {boolean} onlyTitle
     * @param {string|number} defaultValue
     *
     * @return {*[]}
     */
    getFilterValues = (filter, onlyTitle = false, defaultValue) => {
        const values = this.state.filters[filter.alias]

        if (!onlyTitle) {
            return values || defaultValue || []
        }

        if (values) {
            if (filter.filterType === 'number') {
                const res = []

                if (values[0]) {
                    res.push(`от ${values[0]}`)
                }

                if (values[1]) {
                    res.push(`до ${values[1]}`)
                }

                return res
            } else if (filter.filterType === 'string') {
                return filter.items.reduce((result, element) => {
                    if (values.includes(element.pId)) {
                        result.push(element.value)
                    }

                    return result
                }, [])
            }
        }

        return defaultValue || []
    }

    /**
     * Set/update filter
     *
     * @param {object} filter
     * @param {Array.<string>} values
     *
     * @return {CategoryFilters}
     */
    setFilterValue = (filter, values) => {
        if (values) {
            this.state.filters[filter.alias] = values
        } else if (!values && this.state.filters[filter.alias]) {
            delete this.state.filters[filter.alias]
        }

        return this
    }

    /**
     * Get data provider query filters
     *
     * @return {object|null}
     */
    getQueryFilters = () => {
        if (!_.isEmpty(this.state.filters)) {
            return this.state.filters
        }

        return null
    }

    /**
     * Get data provider order by
     *
     * @return {string}
     */
    getQueryOrderBy = () => {
        if (this.state.orderBy.column !== '') {
            return `${this.state.orderBy.direction}${this.state.orderBy.column}`
        }

        return ''
    }
}
