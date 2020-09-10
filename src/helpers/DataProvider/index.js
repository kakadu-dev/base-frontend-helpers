import ReduxQuery from './ReduxQuery'
import SearchQuery from './SearchQuery'

/**
 * Data provider helper
 */
export default class DataProvider
{
	/**
	 * Get defaul state data provider
	 *
	 * @param {object} options
	 *
	 * @return {{pagination: {totalItems: number, pageCount: number, perPage: number, currentPage: number}, list: Array}}
	 */
	static getDefaultState(options)
	{
		return {
			list:       [],
			pagination: {
				totalItems:  0,
				pageCount:   0,
				currentPage: 1,
				perPage:     20,
			},
			settings:   {
				pageSizeLimit: [20, 50, 100],
			},
			...options,
		}
	}

	/**
	 * Get headers key
	 *
	 * @param {object} headers
	 * @param {string} key
	 *
	 * @deprecated
	 *
	 * @return {null|*}
	 */
	static getHeader(headers, key)
	{
		if (!headers || !key) {
			return null
		}

		if (typeof headers.get === 'function') {
			return headers.get(key)
		}

		if (headers.map) {
			return headers.map[key.toLowerCase()] || null
		}

		return headers[key.toLowerCase()] || null
	}

	/**
	 * Set header value
	 *
	 * @param {object} headers
	 * @param {string} key
	 * @param {string} value
	 *
	 * @return {boolean}
	 */
	static setHeader(headers, key, value)
	{
		if (!headers || !key) {
			return false
		}

		if (typeof headers.get === 'function') {
			headers.set(key, value)

			return true
		}

		if (headers.map) {
			headers.map[key.toLowerCase()] = value

			return true
		}

		headers[key.toLowerCase()] = value

		return true
	}

	/**
	 * Handle response from server and return data provider format
	 *
	 * @param {object} response
	 *
	 * @return {{pagination: {totalItems: *, pageCount: *, perPage: *, currentPage: *}, list: *}}
	 */
	static handleResponse(response)
	{
		const { result, response: { headers } } = response

		if (
			(Array.isArray(result) || Array.isArray(result?.list)) ||
			(result?.pagination?.totalItems ?? null) !== null
		) {
			return DataProvider.handleResponseList(response)
		}

		return DataProvider.handleResponseView(response)
	}

	/**
	 * Handle response single object from server
	 *
	 * @param {object} response
	 *
	 * @return {*|{headers: *}}
	 */
	static handleResponseView(response)
	{
		const { result, response: resp } = response

		const output = { ...result, response: resp }

		return output
	}

	/**
	 * Handle response list from server
	 *
	 * @param {object} response
	 * @param {boolean} emulateState
	 *
	 * @return {object}
	 */
	static handleResponseList(response, emulateState = false)
	{
		const { result, response: resp } = response
		const headers                    = result?.pagination ?? resp?.headers ?? {}

		const output = {
			list:       result?.list ?? result,
			...(result?.headers ? { payload: result.headers } : {}),
			...(result?.payload ? { payload: result.payload } : {}),
			pagination: {
				totalItems:  Number(headers?.totalItems ?? 0),
				pageCount:   Number(headers?.pageCount ?? 0),
				currentPage: Number(headers?.currentPage ?? 1),
				perPage:     Number(headers?.perPage ?? 0),
			},
			response:   resp,
		}

		if (emulateState) {
			return {
				result: output,
			}
		}

		return output
	}

	/**
	 * Merge pagination response
	 *
	 * @param {object} prevState
	 * @param {object} currentState
	 * @return {{list: ...*|Array[]}}
	 */
	static mergeList(prevState, currentState)
	{
		const prevList = prevState && prevState.list || []

		return {
			...prevState,
			...currentState,
			list: [...prevList, ...(currentState && currentState.list || [])],
		}
	}

	/**
	 * Get search query
	 *
	 * @return {SearchQuery}
	 */
	static buildQuery()
	{
		return new SearchQuery()
	}

	/**
	 * Get redux query
	 *
	 * @return {ReduxQuery}
	 */
	static buildReduxQuery()
	{
		return new ReduxQuery()
	}

	/**
	 * Get search query request options from object
	 *
	 * @param {SearchQuery|object} searchQuery
	 *
	 * @return {SearchQuery}
	 */
	static getSearchQuery(searchQuery)
	{
		const result = searchQuery && searchQuery.searchQuery || searchQuery

		return result instanceof SearchQuery
			? result
			: DataProvider.buildQuery().addRequestOptions(result)
	}

	/**
	 * Get search query request body from object
	 *
	 * @param {SearchQuery|object} searchQuery
	 *
	 * @return {SearchQuery}
	 */
	static getSearchQueryBody(searchQuery)
	{
		const result = searchQuery && searchQuery.searchQuery || searchQuery

		return result instanceof SearchQuery
			? result
			: DataProvider.buildQuery().addBody(result)
	}

	/**
	 * Clone query
	 *
	 * @param {(SearchQuery | ReduxQuery)} query
	 *
	 * @return {null|SearchQuery|ReduxQuery}
	 */
	static cloneQuery(query)
	{
		if (query instanceof SearchQuery || query instanceof ReduxQuery) {
			return query.cloneInstance()
		}

		return null
	}
}
