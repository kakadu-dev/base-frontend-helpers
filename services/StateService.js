import _ from 'lodash'
import StatePaginationService from './StatePaginationService'
import StateResponseService from './StateResponseService'
import StateSettingsService from './StateSettingsService'

/**
 * State service
 */
export default class StateService
{
	/**
	 * Store state
	 *
	 * @private
	 * @type {object}
	 */
	state = {}

	/**
	 * @type {StatePaginationService}
	 */
	pagination = null

	/**
	 * @type {StateSettingsService}
	 */
	settings = null

	/**
	 * @type {StateResponseService}
	 */
	response = null

	/**
	 * State service constructor
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
		this.state = !state.result && state.list && { result: state }
					 || state
					 || {}
	}

	/**
	 * Create state service instance
	 *
	 * @param {object} state
	 *
	 * @return {StateService}
	 */
	static create = (state) => {
		return new this(state)
	}

	/**
	 * Get pagination service
	 *
	 * @return {StatePaginationService}
	 */
	getPagination = () => {
		if (!this.pagination) {
			this.pagination = new StatePaginationService(this.state.result && this.state.result.pagination)
		}

		return this.pagination
	}

	/**
	 * Get settings service
	 *
	 * @return {StateSettingsService}
	 */
	getSettings = () => {
		if (!this.settings) {
			this.settings = new StateSettingsService(this.state.result && this.state.result.settings)
		}

		return this.settings
	}

	/**
	 * Get response service
	 *
	 * @return {StateResponseService}
	 */
	getResponse = () => {
		if (!this.response) {
			this.response = new StateResponseService(this.state.response)
		}

		return this.response
	}

	/**
	 * Is empty models list
	 *
	 * return {boolean}
	 */
	isEmptyList = () => {
		return !this.state.result
			   || !this.state.result.list
			   || this.state.result.list.length <= 0
	}

	/**
	 * Is fetching result
	 *
	 * return {boolean}
	 */
	isFetching = () => {
		return this.state.fetching
	}

	/**
	 * Get error
	 *
	 * return {string}
	 */
	getError = () => {
		return this.state.error
	}

	/**
	 * Get list result
	 *
	 * @return {*|Array}
	 */
	getList = () => {
		return this.state.result && this.state.result.list && this.state.result.list.length
			? this.state.result.list
			: []
	}

	/**
	 * Is empty result
	 *
	 * @return {*}
	 */
	isEmptyResult = () => {
		return _.isEmpty(this.state.result)
	}

	/**
	 * Get result key value
	 *
	 * @param {string} key
	 * @param {*} defaultValue
	 *
	 * @return {*}
	 */
	getResultKey = (key, defaultValue = null) => {
		return this.state.result && this.state.result[key] || defaultValue
	}

	/**
	 * Map result
	 *
	 * @property {function(...*): Array}
	 * @property {string} key in result
	 *
	 * @return {Array}
	 */
	mapResult = (callback, key = null) => {
		const obj = key === null
			? this.state.result
			: this.state.result && this.state.result[key]

		const array = obj && obj.length
			? obj
			: Object.entries(obj)

		return array.map(callback)
	}

	/**
	 * Handle pagination
	 * E.g. Flatlist onEndReached
	 *
	 * @param {function(page, isPagination)} getModels
	 *
	 * @return {undefined}
	 */
	handlePagination = (getModels) => {
		const currentPage = this.getPagination().getCurrentPage()
		const maxPage     = this.getPagination().getPageCount()

		if (!this.isFetching() && currentPage < maxPage) {
			getModels(this.getPagination().getCurrentPage() + 1, true)
		}
	}
}
