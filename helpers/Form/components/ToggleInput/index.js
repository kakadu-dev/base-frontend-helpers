import * as PropTypes from 'prop-types'
import React from 'react'

/**
 * Toggle input form
 *
 * @param {*} props
 *
 * @return {*}
 */
export const ToggleInput = React.forwardRef((props, ref) => {
	const {
			  component,
			  ...newProps
		  } = props

	return component({ ...newProps, ref })
})

ToggleInput.propTypes = {
	component: PropTypes.func,
}

ToggleInput.defaultProps = {
	component: () => null,
}
