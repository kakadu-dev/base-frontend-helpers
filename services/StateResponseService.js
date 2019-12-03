import ResponseHelper from '../helpers/ResponseHelper'

/**
 * State response service
 */
export default class StateResponseService
{
	/**
	 * Response state
	 *
	 * @type {object}
	 */
	state = {}

	/**
	 * State response service constructor
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
		this.state = state || {}
	}

	/**
	 * Get header value
	 *
	 * @param {string} name
	 * @param {*} defaultValue
	 *
	 * @return {*}
	 */
	getHeader = (name, defaultValue) => {
		return ResponseHelper.parseHeaders(this.state, name, defaultValue)
	}

	/**
	 * Get response status
	 *
	 * @return {number}
	 */
	getStatus = () => {
		return this.state && this.state.status || 0
	}
}
