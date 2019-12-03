/**
 * Auth service
 */
export class AuthService
{
	/**
	 * @type {AuthService}
	 */
	static myInstance = null

	/**
	 * @private
	 *
	 * @type {boolean}
	 */
	isSeamlessLogin = false

	/**
	 * @private
	 *
	 * @type {boolean}
	 */
	seamlessError = false

	/**
	 * Get instance
	 *
	 * @return {AuthService}
	 */
	static getInstance()
	{
		if (this.myInstance === null) {
			this.myInstance = new AuthService()
		}

		return this.myInstance
	}

	/**
	 * Reauth after logout (only for mobile app)
	 *
	 * @return {function}
	 */
	authCallback = () => null

	/**
	 * Set reauth callback
	 *
	 * @param {function} authCallback
	 *
	 * @return {AuthService}
	 */
	setAuthCallback = (authCallback) => {
		this.authCallback = authCallback

		return this
	}

	/**
	 * Set seamless login in process
	 *
	 * @param {boolean} val
	 *
	 * @return {AuthService}
	 */
	setSeamlessLogin = (val) => {
		this.isSeamlessLogin = val

		return this
	}

	/**
	 * Seamless login in process
	 *
	 * @return {boolean}
	 */
	getIsSeamlessLogin = () => {
		return this.isSeamlessLogin
	}

	/**
	 * Set seamless login state
	 *
	 * @param {boolean} val
	 *
	 * @return {AuthService}
	 */
	setSeamlessError = (val) => {
		this.seamlessError = val

		return this
	}

	/**
	 * If seamless login error
	 *
	 * @return {boolean}
	 */
	getSeamlessLoginError = () => {
		return this.seamlessError
	}
}
