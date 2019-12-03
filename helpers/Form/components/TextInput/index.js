import * as PropTypes from 'prop-types'
import React from 'react'

/**
 * Text input form
 *
 * @param {*} props
 *
 * @return {*}
 */
export const TextInput = React.forwardRef((props, ref) => {
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
