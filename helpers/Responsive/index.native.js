// packages
import {
	Dimensions,
	PixelRatio,
	Platform,
	StatusBar,
} from 'react-native'

// Platform constants
const isAndroid = Platform.OS === 'android'
const isIOS     = Platform.OS === 'ios'

// Retrieve initial screen's width
let screenWidth = Dimensions.get('window').width

// Retrieve initial screen's height
let screenHeight =
		isAndroid
			? Dimensions.get('window').height - StatusBar.currentHeight
			: Dimensions.get('window').height

// !!! Don't change to "const" !!!
let orientationIsPortrait  = screenWidth < screenHeight
let orientationIsLandscape = screenWidth > screenHeight

/**
 * Converts provided width percentage to independent pixel (dp).
 * @param  {string} widthPercent The percentage of screen's width that UI element should cover
 *                               along with the percentage symbol (%).
 * @return {number}              The calculated dp depending on current device's screen width.
 */
const widthPercentageToDP = widthPercent => {
	// Parse string percentage input and convert it to number.
	const elemWidth = parseFloat(widthPercent)

	// Use PixelRatio.roundToNearestPixel method in order to round the layout
	// size (dp) to the nearest one that correspons to an integer number of pixels.
	return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100)
}

/**
 * Converts provided height percentage to independent pixel (dp).
 * @param  {string} heightPercent The percentage of screen's height that UI element should cover
 *                                along with the percentage symbol (%).
 * @return {number}               The calculated dp depending on current device's screen height.
 */
const heightPercentageToDP = heightPercent => {
	// Parse string percentage input and convert it to number.
	const elemHeight = parseFloat(heightPercent)

	// Use PixelRatio.roundToNearestPixel method in order to round the layout
	// size (dp) to the nearest one that correspons to an integer number of pixels.
	return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100)
}

/*
 * Font size
 */
const fontSizePercentageToDP = fontPercent => {
	const elemWidth = parseFloat(fontPercent)

	return PixelRatio.roundToNearestPixel(((screenWidth < screenHeight ? screenWidth : screenHeight) * elemWidth) / 100)
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
	Dimensions.addEventListener('change', newDimensions => {
		// Retrieve and save new dimensions
		screenWidth            = newDimensions.window.width
		screenHeight           = newDimensions.window.height
		orientationIsPortrait  = screenWidth < screenHeight
		orientationIsLandscape = screenWidth > screenHeight

		// Trigger screen's rerender with a state update of the orientation variable
		that.setState({
			orientation: screenWidth < screenHeight ? 'portrait' : 'landscape',
		})

		if (typeof callback === 'function') {
			callback(that)
		}
	})
}

/**
 * Wrapper function that removes orientation change listener and should be invoked in
 * componentWillUnmount lifecycle method of every class component (UI screen) that
 * listenOrientationChange function has been invoked. This should be done in order to
 * avoid adding new listeners every time the same component is re-mounted.
 */
const removeOrientationListener = () => {
	Dimensions.removeEventListener('change', () => null)
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
