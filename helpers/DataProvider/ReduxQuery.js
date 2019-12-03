/**
 * Redux query builder
 */
export default class ReduxQuery
{
	params = {
		// Keep result in store after repeat request
		keepPrevResult:           true,
		// Keep result in store after repeat request and error
		keepPrevResultError:      true,
		// Enable pagination
		enablePagination:         false,
		// Save prev result key (change only request)
		savePrevResult:           false,
		// Save prev result key (change only request) for HEAD requests
		savePrevResultHead:       true,
		// Don't show error message (disable flash message)
		disableErrorFlashMessage: false,
	}

	/**
	 * Clone redux query instance
	 *
	 * @return {ReduxQuery}
	 */
	cloneInstance = () => {
		const instance = new ReduxQuery()

		instance.params = this.params

		return instance
	}

	/**
	 * Change keep result state in store
	 *
	 * @param {boolean} val
	 * @param {boolean} errorVal
	 *
	 * @return {ReduxQuery}
	 */
	toggleKeepPrevResult = (val = false, errorVal = false) => {
		this.params.keepPrevResult      = val
		this.params.keepPrevResultError = errorVal

		return this
	}

	/**
	 * Enable pagination
	 *
	 * @param {boolean} val
	 *
	 * @return {ReduxQuery}
	 */
	enablePagination = (val = true) => {
		this.params.enablePagination = val

		return this
	}

	/**
	 * Toggle keep result
	 *
	 * @return {ReduxQuery}
	 */
	savePrevResult = (val = true, head = true) => {
		this.params.savePrevResult     = val
		this.params.savePrevResultHead = head

		return this
	}

	/**
	 * Toggle show error flash message
	 *
	 * @param {boolean|function} hide
	 *
	 * @return {ReduxQuery}
	 */
	toggleErrorMessage = (hide) => {
		this.params.disableErrorFlashMessage = hide

		return this
	}

	/**
	 * Get redux params
	 *
	 * @return {object}
	 */
	getParams = () => {
		return this.params
	}
}
