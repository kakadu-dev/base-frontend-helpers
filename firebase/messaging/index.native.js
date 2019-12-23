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
 */
export class FirebaseMessaging extends AbstractFirebaseMessaging
{
	/**
	 * @type {number}
	 * @private
	 */
	_attemptsResolveUserToken = 0

	/**
	 * Get permissions
	 *
	 * @param {Array.<NotificationCategory>} categories
	 *
	 * @return {FirebaseMessaging}
	 */
	getPermissions(categories)
	{
		firebase
			.messaging()
			.hasPermission()
			.then(enabled => {
				if (PLATFORM === 'ios') {
					NotificationsIOS.addEventListener('remoteNotificationsRegistered', () => this._resolveUserToken())
					NotificationsIOS.requestPermissions(categories)
				}

				// For update push token, if permissions was disabled, or update push token
				if (enabled) {
					setTimeout(() => this._resolveUserToken(), 3000)
				}
			})

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
			NotificationsIOS.removeEventListener('remoteNotificationsRegistered', () => this._resolveUserToken())
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
				}, completion)
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
}
