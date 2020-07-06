import NotificationsIOS, {
	NotificationsAndroid,
	PendingNotifications,
} from 'react-native-notifications'
import { PLATFORM } from '../../helpers/Client'
import firebase from '../index'
import AbstractFirebaseMessaging from './common'
import PushNotification from './notification'

/**
 * Firebase messaging service
 *
 * @see https://github.com/wix/react-native-notifications
 */
export class FirebaseMessaging extends AbstractFirebaseMessaging
{
	/**
	 * @type {number}
	 * @private
	 */
	_attemptsResolveUserToken = 0

	/**
	 * Send local notification
	 *
	 * @see https://github.com/wix/react-native-notifications/blob/master/docs/localNotifications.md
	 *
	 * Example:
	 * {
	 *		fireDate: (new Date).getTime() + 10000,
	 *		title:    'Local notification',
	 *		body:     'This notification was generated by the app!',
	 * }
	 *
	 * @param {object} params
	 *
	 * @return {*}
	 */
	static sendLocalNotification(params)
	{
		let notificationId = null

		if (PLATFORM === 'ios') {
			notificationId = NotificationsIOS.localNotification(params)
		} else {
			const currTime = (new Date).getTime()
			notificationId = NotificationsAndroid.localNotification({
				...params,
				fireDate: (params.fireDate || currTime) - currTime,
				data:     JSON.stringify(typeof params.data === 'object' ? params.data : {}),
			})
		}

		return notificationId
	}

	/**
	 * Get permissions
	 *
	 * @param {Array.<NotificationCategory>} categories
	 *
	 * @return {FirebaseMessaging}
	 */
	getPermissions(categories)
	{
		if (PLATFORM === 'ios') {
			NotificationsIOS.addEventListener('remoteNotificationsRegistered', this._resolveUserToken.bind(this))
			NotificationsIOS.requestPermissions(categories)
		} else {
			NotificationsAndroid.setRegistrationTokenUpdateListener(this._resolveUserToken.bind(this))
		}

		return super.getPermissions()
	}

	/**
	 *  Resolve user token, and send to server:
	 *  - after accept push notifications permissions (ios)
	 *  - after switch on push notifications permissions and run app
	 *
	 * @private
	 *
	 * @return {boolean}
	 */
	async _resolveUserToken()
	{
		this._iosResolvePermissions = true

		const firebaseToken = await this.getUserToken()

		if (!firebaseToken && this._attemptsResolveUserToken < 5) {
			setTimeout(() => this._resolveUserToken(), 7000)

			this._attemptsResolveUserToken++

			return false
		}

		this._onTokenRefreshCallback(firebaseToken)

		if (PLATFORM === 'ios') {
			NotificationsIOS.removeEventListener('remoteNotificationsRegistered', this._resolveUserToken.bind(this))
		}

		return true
	}

	/**
	 * Set notification _listners
	 *
	 * @protected
	 *
	 * @return {undefined}
	 */
	_setListners()
	{
		if (!super._setListners()) {
			return false
		}

		// Handle init notification (open app)
		(PLATFORM === 'ios' ? NotificationsIOS : PendingNotifications)
			.getInitialNotification()
			.then(notification => {
				this._handleNotification(notification, {
					action: {
						identifier: 'default.action',
					},
					isInit: true,
				})
			})

		if (PLATFORM === 'ios') {
			// Handle IOS foreground notifications
			NotificationsIOS.addEventListener('notificationReceivedForeground', (notification, completion) => {
				this._handleNotification(notification, {
					completion,
				}, () => {
					completion({ alert: false, sound: false, badge: false })
				})
			})
			// Handle IOS open notification
			NotificationsIOS.addEventListener('notificationOpened', (notification, completion, action) => {
				this._handleNotification(notification, {
					completion,
					action,
				}, completion)
			})
		} else {
			// Handle Android foreground and background notifications
			NotificationsAndroid.setNotificationReceivedListener(notification => {
				const {
						  notificationId,
						  isForeground,
					  }          = (notification && notification.getData() || {})
				const completion = () => {
					if (notificationId) {
						NotificationsAndroid.cancelLocalNotification(notificationId)
					}
				}

				this._handleNotification(notification, {
					completion,
					isForeground,
				}, isForeground ? completion : null)
			})
			// Handle Android open notification
			NotificationsAndroid.setNotificationOpenedListener(notification => {
				this._handleNotification(notification, {
					action: {
						identifier: 'default.android.action',
					},
				})
			})
		}

		return true
	}

	/**
	 * Handle notification
	 *
	 * @private
	 * @param {IOSNotification|NotificationAndroid} notification
	 * @param {object} params
	 * @param {function} falseCallback
	 *
	 * @return {boolean}
	 */
	_handleNotification = (notification, params, falseCallback) => {
		if (notification) {
			super.receivedNotification(new PushNotification(notification, params), falseCallback)
		}
	}

	/**
	 * Subscribe base topics
	 *
	 * @return {FirebaseMessaging}
	 */
	subscribeBaseTopics()
	{
		firebase.messaging().subscribeToTopic(`${this._environment}~ALL`)
		firebase.messaging().subscribeToTopic(`${this._environment}~${this.getPlatform()}~ALL`)

		return this
	}

	/**
	 * Subscribe to custom topic
	 *
	 * @param {string} name topic name
	 * @param {boolean} includePlatform
	 *
	 * @return {FirebaseMessaging}
	 */
	subscribeTopic(name, includePlatform = false)
	{
		const platform = includePlatform ? `~${this.getPlatform()}` : ''

		firebase.messaging().subscribeToTopic(`${this._environment}${platform}~${name}`)

		return this
	}

	/**
	 * Unsubscribe topic
	 *
	 * @param {string} name topic name
	 * @param {boolean} includePlatform
	 *
	 * @return {FirebaseMessaging}
	 */
	unsubscribeFromTopic(name, includePlatform = false)
	{
		const platform = includePlatform ? `~${this.getPlatform()}` : ''

		firebase.messaging().unsubscribeFromTopic(`${this._environment}${platform}~${name}`)

		return this
	}

	/**
	 * Set IOS badge
	 *
	 * @param {int} expression
	 *
	 * @return {FirebaseMessaging}
	 */
	setBadgeIOS(count)
	{
		if (PLATFORM === 'ios') {
			NotificationsIOS.setBadgesCount(count)
		}

		return this
	}

	/**
	 * Remove (cancel) push notification
	 *
	 * @param {number} id
	 *
	 * @return {FirebaseMessaging}
	 */
	removePushNotification(id)
	{
		if (PLATFORM === 'ios') {
			NotificationsIOS.removeDeliveredNotifications([id])
		} else {
			NotificationsAndroid.cancelLocalNotification(id)
		}

		return this
	}

	/**
	 * Remove (cancel) all push notifications
	 *
	 * @return {FirebaseMessaging}
	 */
	removeAllPushNotifications()
	{
		if (PLATFORM === 'ios') {
			NotificationsIOS.removeAllDeliveredNotifications()
		} else {
			NotificationsAndroid.removeAllDeliveredNotifications()
		}

		return this
	}
}