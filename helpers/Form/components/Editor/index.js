import * as PropTypes from 'prop-types'
import React from 'react'

/**
 * Editor textarea form
 *
 * @param {*} props
 *
 * @return {*}
 */
export const Editor = React.forwardRef((props, ref) => {
	const {
			  component,
			  ...newProps
		  } = props

	return component({ ...newProps, ref })
})

Editor.propTypes = {
	component: PropTypes.func,
}

Editor.defaultProps = {
	component: () => null,
}
