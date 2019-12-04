import _ from 'lodash'
import {
	call,
	put,
	select,
} from 'redux-saga/effects'
import DataProvider from '../DataProvider'
import RequestActionHelper from './RequestActionHelper'

/**
 * Default view action for response single model
 *
 * @param {object} action
 * @param {function} api
 * @param {function} beforeResponse
 * @param {function} afterResponse
 *
 * @return {undefined}
 */
function* defaultActionView(action, api, beforeResponse, afterResponse)
{
	const { payload, type }           = action
	const { id, searchQuery }         = payload
	const { request, success, error } = RequestActionHelper.getAllActions(type)
	const sQ                          = DataProvider.getSearchQuery(searchQuery)

	try {
		yield put(request(sQ))

		if (typeof beforeResponse === 'function') {
			yield beforeResponse(sQ, id)
		}

		const response = yield call(api, id, sQ)

		yield put(success(DataProvider.handleResponseView(response), sQ))

		if (typeof afterResponse === 'function') {
			yield afterResponse(response, sQ, id)
		}

		sQ.runSuccessCallback(response)
	} catch (e) {
		yield put(error(sQ.addReduxRequestParams({ error: e })))

		sQ.runErrorCallback(e)
	}

	sQ.runCallback()
}

/**
 * Default list action for response multiple model
 *
 * @param {object} action
 * @param {function} api
 * @param {function} beforeResponse
 * @param {function} afterResponse
 *
 * @return {undefined}
 */
function* defaultActionList(action, api, beforeResponse, afterResponse, responseHandler)
{
	const { payload, type }           = action
	const { request, success, error } = RequestActionHelper.getAllActions(type)
	const searchQuery                 = DataProvider.getSearchQuery(payload)

	try {
		yield put(request(searchQuery))

		if (typeof beforeResponse === 'function') {
			yield beforeResponse(searchQuery)
		}

		const response = yield call(api, searchQuery)

		if (!responseHandler) {
			yield put(success(response.result, searchQuery))
		} else {
			yield put(success(responseHandler(response), searchQuery))
		}

		if (typeof afterResponse === 'function') {
			yield afterResponse(response, searchQuery)
		}

		searchQuery.runSuccessCallback(response)
	} catch (e) {
		yield put(error(searchQuery.addReduxRequestParams({ error: e })))

		searchQuery.runErrorCallback(e)
	}

	searchQuery.runCallback()
}

/**
 * Merge list models with model
 *
 * @param {object} modelsState
 * @param {object} model
 *
 * @return {undefined}
 */
const mergeModels = (modelsState, model) => {
	if (!modelsState || !modelsState.result) {
		return
	}

	const models     = modelsState.result
	let productExist = false

	for (let i = 0; i < models.list.length; i++) {
		if (models.list[i].id === model.result.id) {
			models.list[i] = model.result

			productExist = true
			break
		}
	}

	if (!productExist) {
		models.list.push(model.result)

		models.pagination.totalItems++
	}

	if (
		modelsState && modelsState.response &&
		model && model.response && model.response.headers
	) {
		modelsState.response.headers = model.response.headers
	}
}

/**
 * Sagas helper
 */
export default class SagasHelper
{
	/**
	 * Add customer id to request body
	 *
	 * @param {SearchQuery} searchQuery
	 * @param {function} userSelector
	 *
	 * @return {IterableIterator<SelectEffect>}
	 */
	static* beforeAddCustomerId(searchQuery, userSelector)
	{
		const body = searchQuery.getBody()

		if (!body.customerId) {
			const currentUser = yield select(userSelector)

			// Add user id
			body.customerId = currentUser.result.id

			searchQuery.addBody(body, true)
		}
	}

	/**
	 * Clear action state
	 *
	 * @param {object} response
	 * @param {SearchQuery} searchQuery
	 * @param {function} action
	 *
	 * @return {IterableIterator<PutEffect<*>>}
	 */
	static* afterClearState(response, searchQuery, action)
	{
		if (response.response.status === 200) {
			yield put(action(DataProvider.getDefaultState()))
		}
	}

	/**
	 * Delete model from list in fly
	 *
	 * @param {object} response
	 * @param {SearchQuery}  searchQuery
	 * @param {string|number} id
	 * @param {function} getList
	 * @param {function} setList
	 * @param {BaseModel} className
	 *
	 * @return {IterableIterator<SelectEffect|PutEffect<*>>}
	 */
	static* afterDeleteModelFromList(response, searchQuery, id, getList, setList, className)
	{
		let model = null

		if (response.response.status === 204) {
			const { result: models } = yield select(getList)

			_.remove(models.list, e => {
				let modelId = e.id

				if (className) {
					modelId = className.create(e).primaryKey()
				}

				if (modelId === id) {
					model = e
					return true
				}

				return false
			})

			if (models.pagination && models.pagination.totalItems) {
				models.pagination.totalItems--
			}

			yield put(setList({ ...models, response: response.response }))
		}

		return model
	}

	/**
	 * Add or update model in models list
	 *
	 * @param {object} response
	 * @param {SearchQuery} searchQuery
	 * @param {number|string} id
	 * @param {function} getList
	 * @param {function} setList
	 *
	 * @return {IterableIterator<SelectEffect|PutEffect<*>>}
	 */
	static* afterMergeModels(response, searchQuery, id, getList, setList)
	{
		const params = searchQuery.getCustomParams()

		if (params.mergeResponse) {
			const modelsState = yield select(getList) || {}

			// If previous state not exist, create empty state
			if (!modelsState.result) {
				modelsState.result   = DataProvider.handleResponseList({
					response: {},
					result:   [],
				})
				modelsState.response = response
			}

			mergeModels(modelsState, response)

			yield put(setList(DataProvider.handleResponseList({
				result:   modelsState.result.list,
				response: modelsState.response,
			})))
		}
	}

	/**
	 * Default saga create action
	 *
	 * @param {object} action
	 * @param {function} api
	 * @param {function} beforeResponse
	 * @param {function} afterResponse
	 *
	 * @return {undefined}
	 */
	static* defaultCreate(action, api, beforeResponse, afterResponse)
	{
		yield defaultActionList(action, api, beforeResponse, afterResponse, DataProvider.handleResponseView)
	}

	/**
	 * Default saga update action
	 *
	 * @param {object} action
	 * @param {function} api
	 * @param {function} beforeResponse
	 * @param {function} afterResponse
	 *
	 * @return {undefined}
	 */
	static* defaultUpdate(...params)
	{
		yield defaultActionView(...params)
	}

	/**
	 * Default saga view action
	 *
	 * @param {object} action
	 * @param {function} api
	 * @param {function} beforeResponse
	 * @param {function} afterResponse
	 *
	 * @return {undefined}
	 */
	static* defaultView(...params)
	{
		yield defaultActionView(...params)
	}

	/**
	 * Default saga list action
	 *
	 * @param {object} action
	 * @param {function} api
	 * @param {function} beforeResponse
	 * @param {function} afterResponse
	 *
	 * @return {undefined}
	 */
	static* defaultList(action, api, beforeResponse, afterResponse)
	{
		yield defaultActionList(action, api, beforeResponse, afterResponse, DataProvider.handleResponseList)
	}

	/**
	 * Default saga delete action
	 *
	 * @param {object} action
	 * @param {function} api
	 * @param {function} beforeResponse
	 * @param {function} afterResponse
	 *
	 * @return {undefined}
	 */
	static* defaultDelete(...params)
	{
		yield defaultActionView(...params)
	}

	/**
	 * Default saga custom action
	 *
	 * @param {object} action
	 * @param {function} api
	 * @param {function} beforeResponse
	 * @param {function} afterResponse
	 *
	 * @return {undefined}
	 */
	static* defaultCustom(...params)
	{
		yield defaultActionList(...params)
	}

	/**
	 * Default saga delete all action
	 *
	 * @param {object} action
	 * @param {function} api
	 * @param {function} beforeResponse
	 * @param {function} afterResponse
	 *
	 * @return {undefined}
	 */
	static* defaultDeleteAll(action, api, beforeResponse, afterResponse)
	{
		yield defaultActionList(action, api, beforeResponse, afterResponse, DataProvider.handleResponseList)
	}
}
