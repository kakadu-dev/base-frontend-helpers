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
	 * @return {FirebaseMessaging}
	 */
	getPermissions()
	{
		Notification.requestPermission()

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

		firebase
			.messaging()
			.onMessage(this.receivedNotification)

		return true
	}

	/**
	 * Received notification
	 *
	 * @param {object} message
	 * @param {string} type
	 *
	 * @return {undefined}
	 */
	receivedNotification(message, type)
	{
		const msg = message && message.data && message.data['firebase-messaging-msg-data']
			? message.data['firebase-messaging-msg-data']
			: message

		const notification = new PushNotification(msg)

		super.receivedNotification(notification)
	}
}
