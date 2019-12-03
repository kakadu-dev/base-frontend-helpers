import SearchQuery from 'base-frontend-components/helpers/DataProvider/SearchQuery'
import { PURGE } from 'redux-persist'
import DataProvider from '../DataProvider'
import ResponseHelper from '../ResponseHelper'

/**
 * Request action helper.
 * Create request action types, creators, reducers.
 */
export default class RequestActionHelper
{
	/**
	 * Get action by key
	 *
	 * @param {string} key
	 * @param {string} type
	 *
	 * @return {string}
	 * @private
	 */
	static getAction(key, type)
	{
		switch (type) {
			case 'request':
				return `REQUEST_${key}`
			case 'success':
				return `REQUEST_SUCCESS_${key}`
			case 'error':
				return `REQUEST_ERROR_${key}`
			default:
				return ''
		}
	}

	/**
	 * Get action fetch
	 *
	 * @param {string} key
	 *
	 * @return {string}
	 */
	static getActionCreatorFetch(key)
	{
		return (options, meta) => ({ type: key, payload: options, meta })
	}

	/**
	 * Get request action
	 *
	 * @param {string} key
	 *
	 * @return {string}
	 */
	static getActionCreatorRequest(key)
	{
		return (searchQuery) => ({
			type:   this.getAction(key, 'request'),
			params: searchQuery,
		})
	}

	/**
	 * Get request action error
	 *
	 * @param {string} key
	 *
	 * @return {string}
	 */
	static getActionCreatorError(key)
	{
		return (searchQuery) => ({
			type:   this.getAction(key, 'error'),
			params: searchQuery,
		})
	}

	/**
	 * Get request action success
	 *
	 * @param {string} key
	 *
	 * @return {string}
	 */
	static getActionCreatorSuccess(key)
	{
		return (options, searchQuery) => ({
			type:    this.getAction(key, 'success'),
			payload: options,
			params:  searchQuery,
		})
	}

	/**
	 * Get all action creators
	 *
	 * @param {string} key
	 *
	 * @return {{request: string, success: string, error: string}}
	 */
	static getAllActions(key)
	{
		return {
			request: this.getActionCreatorRequest(key),
			success: this.getActionCreatorSuccess(key),
			error:   this.getActionCreatorError(key),
		}
	}

	/**
	 * Create dynamic reducer actions
	 *
	 * @param {object} fetchKeys
	 *
	 * @return {Function}
	 */
	static createReducerActions(fetchKeys)
	{
		const actionTypes = {}
		const initState   = {}
		const baseState   = {
			fetching: false,
			error:    false,
			result:   null,
			response: null,
		}

		fetchKeys.map(key => {
			const actionType   = typeof key === 'object' ? key[0] : key
			const defaultState = typeof key === 'object'
				? { ...baseState, result: { ...key[1] } }
				: { ...baseState }

			actionTypes[this.getAction(actionType, 'request')] = (state, action) => {
				const searchQuery = RequestActionHelper.getSearchQuery(action.params)
				let finalResult   = null
				let finalResponse = null

				// Don`t reset prev result and response key
				if (RequestActionHelper.keepPrevResult(searchQuery)) {
					finalResult   = state[actionType].result
					finalResponse = state[actionType].response
				}

				const nextState = {
					...defaultState,
					fetching: true,
					response: finalResponse,
					result:   finalResult,
				}

				return { ...state, ...{ [actionType]: nextState } }
			}

			actionTypes[this.getAction(actionType, 'error')] = (state, action) => {
				const searchQuery = RequestActionHelper.getSearchQuery(action.params)

				const {
						  error: { message, messageData },
						  keepPrevResultError,
					  } = searchQuery.getReduxRequestParams()

				let resultMessage = !message ? true : message

				if (typeof resultMessage !== 'boolean') {
					// Handle json message
					try {
						resultMessage = JSON.parse(resultMessage)
					} catch (e) {
						//
					}
				}

				let finalResult = null

				// Don`t reset prev resullt
				if (keepPrevResultError) {
					finalResult = state[actionType].result
				}

				const nextState = {
					...defaultState,
					fetching: false,
					error:    resultMessage,
					response: ResponseHelper.cleanResponse(messageData || state[actionType].response),
					result:   finalResult,
				}

				return { ...state, ...{ [actionType]: nextState } }
			}

			actionTypes[this.getAction(actionType, 'success')] = (state, action) => {
				const searchQuery          = RequestActionHelper.getSearchQuery(action.params)
				const { enablePagination } = searchQuery.getReduxRequestParams()
				const result               = action.payload || null
				const { response }         = result || {}

				// Remove response key from result (excess)
				if (result && result.response) {
					delete result.response
				}

				let finalResult = result

				// Keep prev state
				if (RequestActionHelper.keepPrevResult(searchQuery, true)) {
					finalResult = state[actionType].result

					// Update pagination
					if (result && result.pagination) {
						finalResult.pagination = { ...result.pagination }
					}
				}

				// Apply pagination
				if (enablePagination) {
					finalResult = DataProvider.mergeList(state[actionType].result, result)
				}

				const nextState = {
					...defaultState,
					fetching: false,
					result:   finalResult,
					response: ResponseHelper.cleanResponse(response),
				}

				return { ...state, ...{ [actionType]: nextState } }
			}

			actionTypes[PURGE] = (state) => {
				const nextState = { ...defaultState }

				return { ...state, ...{ [actionType]: nextState } }
			}

			initState[actionType] = { ...defaultState }

			return actionType
		})

		return (state = initState, action) => {

			if (actionTypes[action.type] !== undefined) {
				return actionTypes[action.type](state, action)
			}

			return state
		}
	}

	/**
	 * Get search query from params
	 *
	 * @param {SearchQuery|{}} params
	 *
	 * @return {SearchQuery}
	 */
	static getSearchQuery = (params) => {
		return (params instanceof SearchQuery)
			? params
			: DataProvider.buildQuery()
	}

	/**
	 * If need keep prev state result or response keys
	 *
	 * @param {SearchQuery} searchQuery
	 * @param {boolean} isResponse
	 *
	 * @return {*|boolean}
	 */
	static keepPrevResult = (searchQuery, isResponse = false) => {
		const {
				  keepPrevResult,
				  enablePagination,
				  savePrevResult,
				  savePrevResultHead,
			  } = searchQuery.getReduxRequestParams()

		const isHeadRequest = searchQuery.getRequestOptions().method &&
							  searchQuery.getRequestOptions().method === 'HEAD'

		const prevResult = savePrevResult || (savePrevResultHead && isHeadRequest)

		if (isResponse) {
			return prevResult
		}

		return keepPrevResult || enablePagination || prevResult
	}
}
