import axios from 'axios'
import _ from 'lodash'
import { CacheHelper } from '../helpers/CacheHelper'
import DataProvider from '../helpers/DataProvider'
import SearchQuery from '../helpers/DataProvider/SearchQuery'

/**
 * Build full url with query string
 *
 * @param {string} endpoint
 * @param {SearchQuery} dataProvider
 *
 * @return {string}
 */
export function getFullUrl(endpoint, dataProvider)
{
	// Remove end slash if exist and add get params
	const resultEndpoint = endpoint.replace(/\/$/, '')
	const queryParams    = Object.entries(dataProvider.buildUrlParams()).map(([key, value]) => {
		return `${key}=${encodeURIComponent(value)}`
	}).join('&')

	return resultEndpoint + (
		queryParams.length > 0
			? `?${queryParams}`
			: ''
	)
}

/**
 * Get full request
 *
 * @param {string} endpoint
 * @param {SearchQuery} dataProvider
 * @param {object} config
 *
 * @return {Promise<{response: {response: Response, json: any}} | {error: (*|string)}>}
 */
export async function callApiEndpoint(endpoint, dataProvider, config = {})
{
	const {
			  domain,
			  requestHeaders,
			  successCallback,
		  } = config

	const {
			  returnRequest,
			  cacheResponse,
			  saveAuth,
		  } = dataProvider.getCustomParams()

	// Complete url address
	const url     = (endpoint.indexOf('http') === -1)
		? (domain + endpoint)
		: endpoint
	const fullUrl = getFullUrl(url, dataProvider)

	// Default request headers
	const defaultOptions = {
		method:  'GET',
		headers: {
			'Accept':       '*/*',
			'Content-Type': 'application/json',
			...requestHeaders,
		},
	}

	// Merge default headers with custom headers
	const requestOptions = _.merge(defaultOptions, dataProvider.getRequestOptions())

	// Return only request options
	if (returnRequest && !saveAuth) {
		return {
			url:     fullUrl,
			options: requestOptions,
		}
	}

	// Try get cached response (may not working if __DEV__, check data provider request)
	if (cacheResponse) {
		const cachedResult = await CacheHelper.getItem(fullUrl, 'fetch', cacheResponse)

		if (cachedResult) {
			return cachedResult
		}
	}

	let body     = null
	let error    = null
	let response = {}

	try {
		// Request
		response = await axios.request({ url: fullUrl, ...requestOptions })
		body     = response.body
	} catch (e) {
		error = e
	}

	const result = {
		result: body,
		error,
		response,
	}

	// Cache response
	if (cacheResponse && error === null) {
		CacheHelper.setItem(fullUrl, result, cacheResponse, 'fetch')
	}

	if (successCallback) {
		await successCallback(result, dataProvider.getCustomParams())
	}

	return result
}

/**
 * Make request and preprocessing response
 *
 * @param {string} endpoint
 * @param {SearchQuery|object} options
 * @param {object} config
 *
 * @return {IterableIterator<Promise<{response: {response: Response, json: any}}|{error: (*|string)}>|*>}
 */
export function* callApi(endpoint, options, config = {})
{
	const {
			  initRequest,
			  beforeRequest,
			  handleError,
			  requestConfig,
		  } = config

	// Init request callback
	if (initRequest) {
		const initResult = yield initRequest()

		if (initResult) {
			return initResult
		}
	}

	const dataProvider = (options instanceof SearchQuery)
		? options
		: DataProvider.buildQuery().addRequestOptions(options)

	if (beforeRequest) {
		yield beforeRequest(dataProvider)
	}

	const result = yield callApiEndpoint(endpoint, dataProvider, requestConfig)

	// Return only request options, skip fetch
	if (dataProvider.getCustomParams().returnRequest) {
		return result
	}

	if (result.error) {
		const { error, response } = result

		// Custom handle request error
		if (handleError) {
			const handleErrorResult = yield handleError(response.status, error, dataProvider, endpoint, options)

			if (handleErrorResult) {
				return handleErrorResult
			}
		}

		const customError = new Error(
			error && (error.message || JSON.stringify(error)) || 'Unknown error',
		)

		customError.messageData = response

		throw customError
	}

	return result
}
