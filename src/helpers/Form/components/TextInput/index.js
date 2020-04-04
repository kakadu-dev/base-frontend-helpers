/* eslint-disable import/no-extraneous-dependencies */
import * as PropTypes from 'prop-types'
import { forwardRef } from 'react'

/**
 * Text input form
 *
 * @param {*} props
 *
 * @return {*}
 */
export const TextInput = forwardRef((props, ref) => {
	const {
			  component,
			  ...newProps
		  } = props

	return component({ ...newProps, ref })
})

TextInput.propTypes = {
	component: PropTypes.func,
}

TextInput.defaultProps = {
	component: () => null,
}
