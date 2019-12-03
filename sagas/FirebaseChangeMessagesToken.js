import { channel } from 'redux-saga'
import {
	put,
	take,
} from 'redux-saga/effects'
import { getJwtAccessToken } from 'base-frontend-components/api'
import firebase from 'base-frontend-components/firebase'
import { UsersActions } from 'base-frontend-components/modules/user'

/**
 * Token change wrapper
 *
 * @param {Channel} channel
 *
 * @return {onTokenRefresh}
 */
function tokenChangedWrapper(channel)
{
	function onTokenRefresh(fcmToken)
	{
		channel.put(fcmToken)
	}

	return onTokenRefresh
}

/**
 * Check change firebase messages token
 *
 * @return {IterableIterator<*>}
 * @constructor
 */
export const FirebaseChangeMessagesToken = function* () {
	if (
		firebase.messaging
		&& typeof firebase.messaging.isSupported === 'function'
		&& !firebase.messaging.isSupported()
	) {
		return null
	}

	const tokenChannel  = channel()
	const onChangeToken = tokenChangedWrapper(tokenChannel)

	let timeout = null

	firebase.messaging().onTokenRefresh(onChangeToken)

	while (true) {
		const pushToken       = yield take(tokenChannel)
		const jwtTokenEncoded = yield getJwtAccessToken()

		if (pushToken && jwtTokenEncoded) {
			yield put(UsersActions.updatePushToken(pushToken))
		} else if (!jwtTokenEncoded && pushToken) {
			// Wait customer auth and get jwt token
			timeout = setTimeout(() => tokenChannel.put(pushToken), 5000)
		}
	}
}
