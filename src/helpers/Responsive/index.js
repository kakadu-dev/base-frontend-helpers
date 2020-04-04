// Platform constants
const isAndroid = false
const isIOS     = false

// !!! Don't change to "const" !!!
let orientationIsPortrait  = 0
let orientationIsLandscape = 0

/**
 * Converts provided width percentage to independent pixel (dp).
 * @param  {string} widthPercent The percentage of screen's width that UI element should cover
 *                               along with the percentage symbol (%).
 * @return {number}              The calculated dp depending on current device's screen width.
 */
const widthPercentageToDP = widthPercent => {
	return 0
}

/**
 * Converts provided height percentage to independent pixel (dp).
 * @param  {string} heightPercent The percentage of screen's height that UI element should cover
 *                                along with the percentage symbol (%).
 * @return {number}               The calculated dp depending on current device's screen height.
 */
const heightPercentageToDP = heightPercent => {
	return 0
}

/*
 * Font size
 */
const fontSizePercentageToDP = fontPercent => {
	return 0
}

/**
 * Event listener function that detects orientation change (every time it occurs) and triggers
 * screen rerendering. It does that, by changing the state of the screen where the function is
 * called. State changing occurs for a new state variable with the name 'orientation' that will
 * always hold the current value of the orientation after the 1st orientation change.
 * Invoke it inside the screen's constructor or in componentDidMount lifecycle method.
 * @param {object} that Screen's class component this variable. The function needs it to
 *                      invoke setState method and trigger screen rerender (this.setState()).
 */
const listenOrientationChange = (that, callback) => {

}

/**
 * Wrapper function that removes orientation change listener and should be invoked in
 * componentWillUnmount lifecycle method of every class component (UI screen) that
 * listenOrientationChange function has been invoked. This should be done in order to
 * avoid adding new listeners every time the same component is re-mounted.
 */
const removeOrientationListener = () => {
}

export {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
	fontSizePercentageToDP as fs,
	listenOrientationChange as lor,
	removeOrientationListener as rol,
	orientationIsPortrait as orIsP,
	orientationIsLandscape as orIsL,
	isAndroid,
	isIOS,
}
