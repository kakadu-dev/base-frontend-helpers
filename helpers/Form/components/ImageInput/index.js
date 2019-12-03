/* eslint-disable import/no-extraneous-dependencies */
import * as PropTypes from 'prop-types'
import React from 'react'

/**
 * Image input form
 *
 * @param {*} props
 *
 * @return {*}
 */
export const ImageInput = React.forwardRef((props, ref) => {
	const {
			  component,
			  ...newProps
		  } = props

	return component({ ...newProps, ref })
})

ImageInput.propTypes = {
	component: PropTypes.func,
}

ImageInput.defaultProps = {
	component: () => null,
}
