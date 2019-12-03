import * as PropTypes from 'prop-types'
import React from 'react'

/**
 * Barcode input
 *
 * @param {*} props
 *
 * @return {*}
 */
export const BarcodeInput = React.forwardRef((props, ref) => {
	const {
			  component,
			  ...newProps
		  } = props

	return component({ ...newProps, ref })
})

BarcodeInput.propTypes = {
	component: PropTypes.func,
}

BarcodeInput.defaultProps = {
	component: () => null,
}
