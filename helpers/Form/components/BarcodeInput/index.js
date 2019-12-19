/* eslint-disable import/no-extraneous-dependencies */
import * as PropTypes from 'prop-types'
import { forwardRef } from 'react'

/**
 * Barcode input
 *
 * @param {*} props
 *
 * @return {*}
 */
export const BarcodeInput = forwardRef((props, ref) => {
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
