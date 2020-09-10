import _ from 'lodash'
import {
	call,
	put,
	select,
} from 'redux-saga/effects'
import DataProvider from '../DataProvider'
import RequestActionHelper from './RequestActionHelper'

/**
 * Sagas helper
 */
export default class SagasHelper {
	/**
	 * Default action for response
	 *
	 * @param {object} action
	 * @param {function} api
	 * @param {function} responseHandler
	 * @param {function} beforeResponse
	 * @param {function} afterResponse
	 *
	 * @return {undefined}
	 */
	static* defaultAction(action, api, responseHandler, beforeResponse = null, afterResponse = null) {
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
	 * Clear action state
	 *
	 * @param {object} response
	 * @param {SearchQuery} searchQuery
	 * @param {function} action
	 *
	 * @return {IterableIterator<PutEffect<*>>}
	 */
	static* afterClearState(response, searchQuery, action) {
		if (response.response.status === 200) {
			yield put(action(DataProvider.getDefaultState()))
		}
	}

	/**
	 * Delete model from list in fly
	 *
	 * @param {object} response
	 * @param {SearchQuery}  searchQuery
	 * @param {function} getList
	 * @param {function} setList
	 * @param {BaseModel} className
	 *
	 * @return {IterableIterator<SelectEffect|PutEffect<*>>}
	 */
	static* afterDeleteModelFromList(response, searchQuery, getList, setList, className) {
		let model    = null
		const status = response?.response?.status ?? 0
		const id     = className
					   ? className.create(response).primaryKey()
					   : (response?.result?.model?.id ?? response?.result?.id ?? 0)

		if (status === 200 && id > 0) {
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

			yield put(setList({
				...models,
				response: response.response,
			}))
		}

		return model
	}

	/**
	 * Add or update model in models list
	 *
	 * @param {object} response
	 * @param {SearchQuery} searchQuery
	 * @param {function} getList
	 * @param {function} setList
	 *
	 * @return {IterableIterator<SelectEffect|PutEffect<*>>}
	 */
	static* afterMergeModels(response, searchQuery, getList, setList) {
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

			SagasHelper._mergeModels(modelsState, response)

			yield put(setList(DataProvider.handleResponseList({
				result:   modelsState.result,
				response: modelsState.response,
			})))
		}
	}

	/**
	 * Merge list models with model
	 *
	 * @protected
	 *
	 * @param {object} modelsState
	 * @param {object} model
	 *
	 * @return {undefined}
	 */
	static _mergeModels = (modelsState, model) => {
		const modelOrig = model?.result?.model ?? model?.result ?? model
		const modelsRes = modelsState?.result ?? null
		if (!modelsRes || !modelOrig) {
			return
		}

		let productExist = false
		if (modelOrig) {
			for (let i = 0; i < modelsRes.list.length; i++) {
				if (modelsRes.list[i].id === modelOrig.id) {
					modelsRes.list[i] = modelOrig

					productExist = true
					break
				}
			}

			if (!productExist) {
				modelsRes.list.push(modelOrig)

				modelsRes.pagination.totalItems++
			}
		}

		if (modelsRes.payload) {
			modelsRes.payload = _.merge(modelsRes.payload, model?.result?.headers ?? model?.result?.payload ?? {})
		}
	}
}
