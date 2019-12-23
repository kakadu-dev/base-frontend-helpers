import {
    isEmulator,
    PLATFORM,
} from '../../helpers/Client'
import firebase from '../index'

/**
 * Abstract class for firebase messaging
 */
export default class AbstractFirebaseMessaging
{
    /**
     * @type {FirebaseMessaging}
     * @protected
     */
    static myInstance = null

    /**
     * @type {object}
     * @protected
     */
    _listners = {}

    /**
     * @type {function|null}
     * @protected
     */
    _refreshTokenListner = null

    /**
     * @type {boolean}
     * @protected
     */
    _isEmulator = false

    /**
     * @type {boolean}
     * @protected
     */
    _isListnersSet = false

    /**
     * @type {string}
     * @protected
     */
    _environment = 'dev'

    /**
     * @type {boolean}
     * @protected
     */
    _iosResolvePermissions = false

    /**
     * Get instance
     *
     * @param {string} env current _environment
     *
     * @return {FirebaseMessaging}
     */
    static getInstance(env)
    {
        if (this.myInstance === null) {
            this.myInstance              = new this()
            this.myInstance._isEmulator  = isEmulator()
            this.myInstance._environment = env || 'dev'
        }

        return this.myInstance
    }

    /**
     * Set _listners
     *
     * @protected
     *
     * @return {boolean}
     */
    _setListners()
    {
        if (this._isListnersSet) {
            return false
        }

        this._isListnersSet = true

        return this._isListnersSet
    }

    /**
     * Get permnissions
     *
     * @return {AbstractFirebaseMessaging}
     */
    getPermissions()
    {
        return this
    }

    /**
     * Get user token
     *
     * @return {Promise<string>}
     */
    getUserToken()
    {
        return new Promise((resolve, reject) => {
            if ((this._isEmulator || !this._iosResolvePermissions) && PLATFORM === 'ios') {
                resolve(null)
            }

            firebase
                .messaging()
                .getToken()
                .then(token => {
                    resolve(token)
                })
                .catch(e => {
                    reject(e)
                })
        })
    }

    /**
     * Listen notification
     *
     * @param {function(PushNotification): boolean} callback
     * @param {string} type
     *
     * @return {FirebaseMessaging}
     */
    onNotification(callback, type = 'all')
    {
        this._setListners()

        if (!this._listners[type]) {
            this._listners[type] = []
        }

        this._listners[type].push(callback)

        return () => {
            this.unsubscribeListeners(type, this._listners[type].length - 1)
        }
    }

    /**
     * Unsubscribe listener(s)
     *
     * @param {string} type
     * @param {number} index
     *
     * @return {FirebaseMessaging}
     */
    unsubscribeListeners(type = 'all', index)
    {
        const types = typeof type === 'string' ? [type] : type

        if (index !== undefined) {
            delete this._listners[type][index]
            return
        }

        types.forEach(t => {
            (this._listners[t] || []).forEach((callback, i) => {
                delete this._listners[t][i]
            })
        })

        return this
    }

    /**
     * Received notification
     *
     * @param {PushNotification} notification
     * @param {function} falseCallback
     *
     * @return {undefined}
     */
    receivedNotification(notification, falseCallback)
    {
        const type      = notification.getType()
        const callbacks = [
            ...(this._listners.all || []),
            ...(this._listners[type] || []),
        ]

        callbacks.forEach(callback => {
            const result = callback(notification)

            if (falseCallback && !result) {
                falseCallback()
            }
        })
    }

    /**
     * Get platform
     *
     * @return {string}
     */
    getPlatform()
    {
        return PLATFORM.toLowerCase()
    }

    /**
     * Subscribe base platform topics
     *
     * @return {FirebaseMessaging}
     */
    subscribeBaseTopics()
    {
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
        return this
    }

    /**
     * Set refresh token listner
     *
     * @param {function(): boolean} callback
     *
     * @return {FirebaseMessaging}
     */
    setRefreshTokenListner(callback)
    {
        this._refreshTokenListner = callback

        return this
    }

    /**
     * Remove refresh token listner
     *
     * @return {FirebaseMessaging}
     */
    removeRefreshTokenListner()
    {
        this._refreshTokenListner = null

        return this
    }

    /**
     * Recieve new user token
     *
     * @param {string} token
     *
     * @return {boolean}
     */
    * recieveUserToken(token)
    {
        if (this._refreshTokenListner) {
            return yield this._refreshTokenListner(token)
        }

        return true
    }
}
