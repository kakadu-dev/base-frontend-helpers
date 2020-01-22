import _ from 'lodash'
import { CacheHelper } from '../helpers/CacheHelper'
import DataProvider from '../helpers/DataProvider'
import SearchQuery from '../helpers/DataProvider/SearchQuery'

/**
 * Get full request
 *
 * @param {string} endpoint
 * @param {object} options
 * @param {object} customParams
 * @param {object} config
 *
 * @return {Promise<{response: {response: Response, json: any}} | {error: (*|string)}>}
 */
async function callApiEndpoint(endpoint, options, customParams = {}, config = {})
{
    const {
              domain,
              requestHeaders,
              successCallback,
          } = config

    const {
              returnRequest,
              cacheResponse,
              saveAuth
          } = customParams

    // Complete url address
    const fullUrl = (endpoint.indexOf('http') === -1)
        ? (domain + endpoint)
        : endpoint

    // Default request headers
    const defaultOptions = {
        method:  'GET',
        headers: {
            'Accept':       '*/*',
            'Content-Type': 'application/json',
            ...requestHeaders
        },
    }

    // Merge default headers with custom headers
    const requestOptions = _.merge(defaultOptions, options)

    if (requestOptions.body) {
        if (['get', 'head'].includes(requestOptions.method.toLowerCase())) {
            delete requestOptions.body
        } else {
            requestOptions.body = JSON.stringify(requestOptions.body)
        }
    }

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

    // Request
    const response = await fetch(fullUrl, requestOptions)

    let body = null

    try {
        const isJson = (response && response.headers && response.headers.get('content-type') || '')
            .includes('json')

        if (isJson) {
            body = await response.json()
        } else {
            const isBlob = (
                               response
                               && response.headers
                               && response.headers.get('content-disposition') || ''
                           ).length > 0

            body = isBlob
                ? await response.blob()
                : await response.text()
        }
    } catch (e) {
        //
    }

    const result = {
        result: body,
        error:  !response.ok,
        response,
    }

    // Cache response
    if (cacheResponse && response.ok) {
        CacheHelper.setItem(fullUrl, result, cacheResponse, 'fetch')
    }

    if (successCallback) {
        successCallback(result, customParams)
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

    // Remove end slash if exist and add get params
    const resultEndpoint = endpoint.replace(/\/$/, '') + dataProvider.buildUrlParams()

    if (beforeRequest) {
        yield beforeRequest(dataProvider)
    }

    const customParams = dataProvider.getCustomParams()
    const result       = yield callApiEndpoint(resultEndpoint, dataProvider.getRequestOptions(), customParams, requestConfig)

    // Return only request options, skip fetch
    if (customParams.returnRequest) {
        return result
    }

    if (result.error) {
        const {result: error, response} = result

        const statusCode  = Number(response.status)
        const resultError = error

        // Custom handle request error
        if (handleError) {
            const handleErrorResult = yield handleError(statusCode, resultError, dataProvider, resultEndpoint)

            if (handleErrorResult) {
                return handleErrorResult
            }
        }

        const customError = new Error(
            resultError && (resultError.message || JSON.stringify(resultError)) || 'Unknown error',
        )

        customError.messageData = response

        throw customError
    }

    return result
}
