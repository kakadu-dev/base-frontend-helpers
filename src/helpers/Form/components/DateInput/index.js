/* eslint-disable import/no-extraneous-dependencies */
import * as PropTypes from 'prop-types'
import { forwardRef } from 'react'

/**
 * Date input form
 *
 * @param {*} props
 *
 * @return {*}
 */
export const DateInput = forwardRef((props, ref) => {
	const {
			  component,
			  ...newProps
		  } = props

	return component({ ...newProps, ref })
})

DateInput.propTypes = {
	component: PropTypes.func,
}

DateInput.defaultProps = {
	component: () => null,
}
