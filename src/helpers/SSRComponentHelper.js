import DataProvider from './DataProvider'
import SearchQuery from './DataProvider/SearchQuery'

/**
 * Server side component helper
 *
 */
class SSRComponentHelper
{
	/**
	 * Get ssr initial props function
	 *
	 * @param {function(Object, Object)} callback
	 * @param {Object} mapDispatchToProps
	 * @param {boolean} disable
	 *
	 * @return {Promise.<function>|null}
	 */
	static initialProps(callback, mapDispatchToProps, disable = false)
	{
		return async (ctx) => {
			const { store } = ctx

			if (disable) {
				return null
			}

			const promisedMapDispatchToProps = {}

			Object.entries(mapDispatchToProps).forEach(([name, dispatcher]) => {
				promisedMapDispatchToProps[name] = param => new Promise((resolve, reject) => {
					const modifiedParams = SSRComponentHelper.modifyParams(param, resolve, reject)

					store.dispatch(dispatcher(modifiedParams))
				})
			})

			return await callback(promisedMapDispatchToProps, ctx)
		}
	}

	/**
	 * Promisifying request
	 *
	 * @param {SearchQuery|Object} param
	 * @param {function} resolve
	 * @param {function} reject
	 *
	 * @return {SearchQuery|Object}
	 */
	static modifyParams(param, resolve, reject)
	{
		/**
		 * @type {SearchQuery}
		 */
		let newParams = null

		// Find search query in request
		if (param) {
			if (param instanceof SearchQuery) {
				newParams = param
			} else if (param.searchQuery instanceof SearchQuery) {
				newParams = param.searchQuery
			} else if (param[0] instanceof SearchQuery) {
				newParams = param[0];
			} else {
				param.searchQuery = newParams = DataProvider.buildQuery()
			}
		}

		if (!newParams) {
			param = newParams = DataProvider.buildQuery()
		}

		const prevSuccessCallback = newParams.success
		const prevErrorCallback   = newParams.error

		// Replace search query callbacks with promisifying
		newParams.setSuccessCallback(async response => {
			await prevSuccessCallback(response)
			resolve(response)
		})
		newParams.setErrorCallback(async e => {
			await prevErrorCallback(e)
			reject(e)
		})

		return param
	}
}

export default SSRComponentHelper
