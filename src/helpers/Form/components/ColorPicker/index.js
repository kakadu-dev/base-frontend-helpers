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
export const ColorPicker = forwardRef((props, ref) => {
	const {
			  component,
			  ...newProps
		  } = props

	return component({ ...newProps, ref })
})

ColorPicker.propTypes = {
	component: PropTypes.func,
}

ColorPicker.defaultProps = {
	component: () => null,
}
