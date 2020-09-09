import _ from 'lodash'
import ReduxQuery from './ReduxQuery'

/**
 * Search api query
 */
export default class SearchQuery
{
	query = {}

	queryParams = {}

	requestOptions = {}

	body = {}

	/**
	 * Custom params
	 *
	 * returnRequest - return only request (skip fetch)
	 * externalRequest - send request to another domain
	 * cacheResponse - cache fetch response in sec
	 * saveAuth - save auth tokens (jwt)
	 *
	 * @type {{}}
	 */
	customParams = {}

	/**
	 * @see RequestActionHelper
	 */
	reduxRequestParams = {}

	success  = () => null

	error    = () => null

	callback = () => null

	/**
	 * Clone search query instance
	 *
	 * @return {SearchQuery}
	 */
	cloneInstance = () => {
		const instance = new SearchQuery()

		instance.query              = this.query
		instance.queryParams        = this.queryParams
		instance.requestOptions     = this.requestOptions
		instance.body               = this.body
		instance.customParams       = this.customParams
		instance.reduxRequestParams = this.reduxRequestParams
		instance.callback           = this.callback
		instance.success            = this.success
		instance.error              = this.error

		return instance
	}

	/**
	 * Add common filter
	 *
	 * @param {object} condition
	 * @param {number|string|null} checkValue
	 *
	 * @return {SearchQuery}
	 */
	addFilter(condition, checkValue)
	{
		if (!this.query.filter) {
			this.query.filter = {}
		}

		if (checkValue !== null && checkValue !== '') {
			this.query.filter = _.merge(this.query.filter, { ...condition })
		}

		return this
	}

	/**
	 * Add extra filter
	 *
	 * @param {object} condition
	 * @param {string} unionBy
	 * @param {mixed} checkValue
	 *
	 * @return {SearchQuery}
	 */
	addExtraFilter(field, value, checkValue = true)
	{
		if (!this.query.extraFilter) {
			this.query.extraFilter = {}
		}

		if (!checkValue || checkValue && value) {
			this.query.extraFilter[field] = value
		}

		return this
	}

	/**
	 * Add order by
	 *
	 * @param {string} column
	 * @param {string} sort (DESC '-', ASC empty)
	 *
	 * @return {SearchQuery}
	 */
	addOrderBy(column, sort)
	{
		if (!this.query.orderBy) {
			this.query.orderBy = []
		}

		if (column) {
			this.query.orderBy.push(`${sort ? '-' : ''}${column}`)
		}

		return this
	}

	/**
	 * Set current page
	 *
	 * @param {number|string} page all - for all pages
	 *
	 * @return {SearchQuery}
	 */
	setPage(page)
	{
		if (page && page !== 1) {
			if (!this.query.pagination) {
				this.query.pagination = {}
			}

			if (page === 'all') {
				this.query.pagination.allPage = true
			} else {
				this.query.pagination.page = page
			}
		}

		return this
	}

	/**
	 * Set page size
	 *
	 * @param {number} perPage
	 *
	 * @return {SearchQuery}
	 */
	setPerPage(perPage)
	{
		if (perPage) {
			if (!this.query.pagination) {
				this.query.pagination = {}
			}

			this.query.pagination.perPage = perPage
		}

		return this
	}

	/**
	 * Add expands
	 *
	 * @param {string} expandName
	 *
	 * @return {SearchQuery}
	 */
	addExpands(...expandName)
	{
		if (!this.query.expands) {
			this.query.expands = []
		}

		this.query.expands.push(...expandName)

		return this
	}

	/**
	 * Add options to request
	 *
	 * @param {object} options
	 * @param {boolean} merge
	 *
	 * @return {SearchQuery}
	 */
	addRequestOptions(options, merge)
	{
		if (options) {
			if (merge) {
				this.requestOptions = _.merge(this.requestOptions, options)
			} else {
				this.requestOptions = options
			}
		}

		return this
	}

	/**
	 * Get request options
	 *
	 * @return {*|Object}
	 */
	getRequestOptions()
	{
		const resultOptions = {
			...this.requestOptions,
			// data key - for axios
			...(!_.isEmpty(this.body) ? { data: this.body } : {}),
		}

		return resultOptions
	}

	/**
	 * Add request body
	 *
	 * @param {object} body
	 * @param {boolean} merge
	 *
	 * @return {SearchQuery}
	 */
	addBody(body, merge)
	{
		this.body = merge && _.merge(this.body, body) || body

		return this
	}

	/**
	 * Get request body
	 *
	 * @return {Object}
	 */
	getBody()
	{
		const {
				  filter,
				  extraFilter,
				  expands,
				  orderBy,
				  pagination,
			  } = this.query

		const { page, perPage, allPage } = pagination || {}

		const query = {
			...(filter ? { filter } : {}),
			...(expands && expands.length ? { expands } : {}),
			...(orderBy && orderBy.length? { orderBy } : {}),
			...(page ? { page } : {}),
			...(perPage ? { perPage } : {}),
			...(allPage ? { allPage } : {})
		}

		return _.merge({}, this.body || {}, {
			...(Object.keys(query).length > 0 ? { query } : {}),
			...(extraFilter ? { extraFilter } : {})
		})
	}

	/**
	 * Add custom params (eg. for condition in sagas)
	 *
	 * @param {object} params
	 * @param {boolean} merge
	 *
	 * @return {SearchQuery}
	 */
	addCustomParams(params, merge)
	{
		this.customParams = merge && _.merge(this.customParams, params) || params

		return this
	}

	/**
	 * Get custom params
	 *
	 * @return {Object}
	 */
	getCustomParams()
	{
		return this.customParams || {}
	}

	/**
	 * Set query param
	 *
	 * @param {string} param
	 * @param {string|number|null} value
	 *
	 * @return {SearchQuery}
	 */
	setQueryParam(param, value)
	{
		if (this.queryParams[param] && (value !== null || value !== undefined)) {
			delete this.queryParams[param]
		} else {
			this.queryParams[param] = value
		}

		return this
	}

	/**
	 * Get url query params (e.g.: ?some=query&param=s)
	 *
	 * @return {Object}
	 */
	getQueryParams()
	{
		return this.queryParams
	}

	/**
	 * Set callback
	 *
	 * @param {function} callback
	 *
	 * @return SearchQuery
	 */
	setCallback(callback)
	{
		this.callback = callback

		return this
	}

	/**
	 * Run callback
	 *
	 * @return {undefined}
	 */
	runCallback()
	{
		this.callback.apply(null)
	}

	/**
	 * Set success callback
	 *
	 * @param {function} callback
	 *
	 * return {SearchQuery}
	 */
	setSuccessCallback(callback)
	{
		this.success = callback

		return this
	}

	/**
	 * Run success callback
	 *
	 * @param {object} response
	 *
	 * @return {undefined}
	 */
	runSuccessCallback(...response)
	{
		this.success.apply(null, response)
	}

	/**
	 * Set error callback
	 *
	 * @param {function} callback
	 *
	 * return {SearchQuery}
	 */
	setErrorCallback(callback)
	{
		this.error = callback

		return this
	}

	/**
	 * Run error callback
	 *
	 * @param {...object} error
	 *
	 * @return {undefined}
	 */
	runErrorCallback(...error)
	{
		this.error.apply(null, error)
	}

	/**
	 * Add redux request params
	 *
	 * @param {object|ReduxQuery} params
	 * @param {boolean} merge
	 *
	 * @return {SearchQuery}
	 */
	addReduxRequestParams(params, merge = true)
	{
		const result = params instanceof ReduxQuery
					   ? params.getParams()
					   : params

		this.reduxRequestParams = merge && _.merge(this.reduxRequestParams, result) || result

		return this
	}

	/**
	 * Get redux request params
	 *
	 * @return {object}
	 */
	getReduxRequestParams()
	{
		const params = { ...(new ReduxQuery).getParams(), ...this.reduxRequestParams }

		return params
	}

	/**
	 * Enable/disable cache response
	 *
	 * @param {number} seconds
	 * @param {boolean} prod depend on environment
	 *
	 * @return {SearchQuery}
	 */
	cacheResponse(seconds, prod = false)
	{
		if (prod) {
			this.customParams.cacheResponse = seconds || 0
		}

		return this
	}
}
