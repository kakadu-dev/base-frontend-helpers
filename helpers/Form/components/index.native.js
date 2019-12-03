import * as PropTypes from 'prop-types'
import React from 'react'
import {
	findNodeHandle,
	View,
} from 'react-native'
import { HelperText as HT } from 'react-native-paper'

/**
 * Scroll to form input
 *
 * @param {object} errorInput
 * @param {object} scrollView
 * @param {function} callback
 *
 * @return {undefined}
 */
export const scrollToInput = (errorInput, scrollView, callback = () => null) => {
	if (!errorInput || !scrollView) {
		return
	}

	errorInput.measureLayout(findNodeHandle(scrollView), (x, y) => {
		scrollView.scrollTo({ x: 0, y, animated: true })

		callback()
	})
}

/**
 * Wrapper form
 *
 * @param {*} props
 *
 * @return {*}
 */
export const WrapView = React.forwardRef((props, ref) => (
	<View ref={ref} style={props.style}>
		{props.children}
	</View>
))

WrapView.propTypes = {
	children: PropTypes.array.isRequired,
	style:    PropTypes.object.isRequired,
}

/**
 * Helper text wrapper
 *
 * @param {*} props
 *
 * @return {*}
 */
export const HelperText = props => (
	<HT {...props}>
		{props.text}
	</HT>
)
