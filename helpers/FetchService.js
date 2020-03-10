import { parse } from 'set-cookie-parser'

/**
 * Fetch service
 */
class FetchService
{
	/**
	 * @type {FetchService}
	 *
	 * @private
	 */
	static myInstance = null

	/**
	 * @type {Headers}
	 *
	 * @private
	 */
	clientHeaders = {}

	/**
	 * @type {string}
	 */
	clientProtocol = 'https'

	/**
	 * @type {Headers|null}
	 *
	 * @private
	 */
	apiHeaders = null

	/**
	 * @type {{set: function, get: function, remove: function, getAll: function}}
	 *
	 * @private
	 */
	clientCookiesHandler = {
		get:    () => null,
		set:    () => null,
		remove: () => null,
		getAll: () => null,
	}

	/**
	 * Get instance
	 *
	 * @return {FetchService}
	 */
	static getInstance()
	{
		if (this.myInstance === null) {
			this.myInstance = new FetchService()
		}

		return this.myInstance
	}

	/**
	 * Set request client headers
	 *
	 * @param {Object} headers
	 * @param {string} protocol
	 *
	 * @return {FetchService}
	 */
	setClientHeaders(headers, protocol)
	{
		this.clientHeaders  = headers
		this.clientProtocol = protocol

		return this
	}

	/**
	 * Set client cookies handler
	 *
	 * @param {Cookies} handler
	 *
	 * @return {FetchService}
	 */
	setClientCookiesHandler(handler)
	{
		this.clientCookiesHandler = handler

		return this
	}

	/**
	 * Get client cookies handler
	 *
	 * @return {Cookies}
	 */
	getClientCookiesHandler()
	{
		return this.clientCookiesHandler
	}

	/**
	 * Set api response headers
	 *
	 * @param {Headers} headers
	 *
	 * @return {FetchService}
	 */
	setApiHeaders(headers)
	{
		this.apiHeaders = headers

		this.handleSetCookies()

		return this
	}

	/**
	 * Handle set cookies
	 *
	 * @private
	 *
	 * @param {Headers} headers
	 *
	 * @return {undefined}
	 */
	handleSetCookies(headers)
	{
		// Only node-fetch
		if (!this.apiHeaders || !this.apiHeaders.raw) {
			return
		}

		const cookies = parse(this.apiHeaders.raw()['set-cookie'], { decodeValues: false })

		if (cookies.length > 0) {
			cookies.forEach(cookie => {
				const {
						  name,
						  value,
						  ...options
					  } = cookie

				this.clientCookiesHandler.set(name, value, options)
			})
		}
	}

	/**
	 * Get client headers
	 *
	 * @param {Object} baseHeaders
	 *
	 * @return {Object}
	 */
	getClientHeaders(baseHeaders)
	{
		let cookies = this.clientHeaders.cookie

		const handlerCookies = Object.entries(this.clientCookiesHandler.getAll() || {})
		if (handlerCookies.length > 0) {
			cookies = handlerCookies.map(([name, value]) => `${name}=${value}`).join('; ')
		}

		const {
				  referer,
				  host:              origin,
				  'user-agent':      userAgent,
				  'accept-language': acceptLanguage,
				  'x-forwarded-for': xForwardedFor,
			  } = this.clientHeaders || {}

		const headers = {
			...baseHeaders,
			...(origin ? { 'Origin': `${this.clientProtocol}://${origin}` } : {}),
			...(referer ? { 'Referer': referer } : {}),
			...(userAgent ? { 'User-Agent': `${userAgent} SSR` } : {}),
			...(acceptLanguage ? { 'Accept-Language': acceptLanguage } : {}),
			...(cookies ? { 'Cookie': cookies } : {}),
			...(xForwardedFor ? { 'X-Forwarded-For': xForwardedFor } : {}),
		}

		return headers
	}
}

export default FetchService
