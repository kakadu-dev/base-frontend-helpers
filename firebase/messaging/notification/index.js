/**
 * Push notification model
 */
export default class PushNotification
{
	/**
	 * Notification type
	 *
	 * @type {string}
	 * @private
	 */
	_type = 'none'

	/**
	 * Notification payload data
	 *
	 * @type {object}
	 * @private
	 */
	_data = {}

	/**
	 * @type {null}
	 * @private
	 */
	_openIdentifier = null

	/**
	 * Remove notification from status bar
	 *
	 * @type {null|function}
	 * @private
	 */
	_completionCallback = null

	/**
	 * @type {boolean}
	 * @private
	 */
	_androidIsForeground = false

	/**
	 * @type {boolean}
	 * @private
	 */
	_isInitNotification = false

	/**
	 * PushNotification constructor
	 *
	 * @param {object} notification
	 * @param {object} params
	 *
	 * @return {undefined}
	 */
	constructor(notification, params = {})
	{
		const data = typeof notification.getData === 'function' && notification.getData()
					 || notification && notification.data || {}

		const {
				  action,
				  completion,
				  isForeground,
				  isInit,
			  } = params

		this._data = data
		this._type = data && data.type

		if (action && action.identifier) {
			this._openIdentifier = action.identifier
		}

		if (completion) {
			this._completionCallback = completion
		}

		if (isForeground) {
			this._androidIsForeground = isForeground
		}

		if (isInit) {
			this._isInitNotification = isInit
		}
	}

	/**
	 * Get notification type
	 *
	 * @see NotificationTypes
	 *
	 * @return {string}
	 */
	getType = () => {
		return this._type
	}

	/**
	 * Get notification payload data
	 *
	 * @return {object}
	 */
	getData = () => {
		return this._data
	}

	/**
	 * Click on push notification in status bar
	 *
	 * @return {boolean}
	 */
	isOpened = () => {
		return this._openIdentifier !== null
	}

	/**
	 * Click on notification and run app (app not running)
	 *
	 * @return {boolean}
	 */
	isInit = () => {
		return this._isInitNotification
	}

	/**
	 * Get open identifier
	 *
	 * @return {string}
	 */
	getOpenIdentifier = () => {
		return this._openIdentifier
	}

	/**
	 * Run complete callback
	 * Remove notification from status bar
	 *
	 * Only IOS params:
	 * { alert: false, sound: false, badge: false }
	 *
	 * @param {object} params
	 *
	 * @return {undefined}
	 */
	runComplete = params => {
		if (this._completionCallback) {
			this._completionCallback(params)
		}
	}
}
