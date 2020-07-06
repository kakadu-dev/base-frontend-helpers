/* eslint-disable import/no-extraneous-dependencies */
import * as PropTypes from 'prop-types'
import { forwardRef } from 'react'

/**
 * Toggle input form
 *
 * @param {*} props
 *
 * @return {*}
 */
export const ToggleInput = forwardRef((props, ref) => {
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
