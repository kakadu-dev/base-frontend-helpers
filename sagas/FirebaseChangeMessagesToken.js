import { channel } from 'redux-saga'
import { take, } from 'redux-saga/effects'
import firebase from '../firebase'
import { FirebaseMessaging } from '../firebase/messaging'

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
        const pushToken = yield take(tokenChannel)

        if (pushToken) {
            FirebaseMessaging
                .getInstance()
                .recieveUserToken(pushToken)
        }
    }
}
