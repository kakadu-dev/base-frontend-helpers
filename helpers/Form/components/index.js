/* eslint-disable import/no-extraneous-dependencies */
import * as PropTypes from 'prop-types'
import { forwardRef } from 'react'

/**
 * Scroll to form input
 *
 * @return {undefined}
 */
export const scrollToInput = (errorInput, scrollView, callback = () => null) => {
	if (!errorInput || !scrollView) {
		return
	}

	if (errorInput && errorInput.scrollIntoView) {
		errorInput.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}
	callback()
}

/**
 * Wrapper form
 *
 * @param {*} props
 *
 * @return {*}
 */
export const WrapView = forwardRef((props, ref) => {
	const {
			  component,
			  ...newProps
		  } = props

	return component({ ...newProps, ref })
})

WrapView.propTypes = {
	component: PropTypes.func,
}

WrapView.defaultProps = {
	component: () => null,
}

/**
 * Helper text wrapper
 *
 * @param {*} props
 *
 * @return {*}
 */
export const HelperText = props => {
	const {
			  component,
			  ...newProps
		  } = props

	return component(newProps)
}

HelperText.propTypes = {
	component: PropTypes.func,
}

HelperText.defaultProps = {
	component: () => null,
}
