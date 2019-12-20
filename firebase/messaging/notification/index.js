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
	 * PushNotification constructor
	 *
	 * @param {object} notification
	 *
	 * @return {undefined}
	 */
	constructor(notification)
	{
		const { data } = notification.getData && notification.getData() || notification || {}

		this._data = data
		this._type = data && data.type
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
}
