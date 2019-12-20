import { PLATFORM } from '../../helpers/Client'
import NotificationsIOS, {
	NotificationsAndroid,
	PendingNotifications,
} from 'react-native-notifications'
import firebase from '../index'
import AbstractFirebaseMessaging from './common'
import PushNotification from './notification'

/**
 * Firebase messaging service
 */
export class FirebaseMessaging extends AbstractFirebaseMessaging
{
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
			firebase
				.messaging()
				.hasPermission()
				.then(enabled => {
					if (!enabled) {
						NotificationsIOS.requestPermissions(categories)
					}
				})
		}

		return super.getPermissions()
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
			.then(this._handleNotification)

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
				}, completion)
			})
			// Handle Android open notification
			NotificationsAndroid.setNotificationOpenedListener(notification => {
				this._handleNotification(notification)
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
			const notif = new PushNotification(notification)

			super.receivedNotification(notif, falseCallback)
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
