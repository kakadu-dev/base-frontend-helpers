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
     * PushNotification constructor
     *
     * @param {object} notification
     * @param {object} params
     *
     * @return {undefined}
     */
    constructor(notification, params = {})
    {
        const { data } = notification.getData && notification.getData() || notification || {}
        const {
        	identifier,
		  	completion,
		  	isForeground,
        } 			   = params

        this._data = data
        this._type = data && data.type

        if (identifier) {
            this._openIdentifier = identifier
        }

        if (completion) {
        	this._completionCallback = completion
		}

        if (isForeground !== undefined) {
        	this._androidIsForeground = isForeground
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
