/**
 * Key helper
 */
export default class KeyHelper {
    /**
     * Enter key
     *
     * @param {function} callback
     * @param {number} key
     *
     * @return {function}
     *
     * @constructor
     */
    static enter = (callback, key) => {
        const keyPressed = key !== undefined ? key : 13

        return (e) => {
            if (e.keyCode === keyPressed) {
                callback.call()
            }
        }
    }
}
