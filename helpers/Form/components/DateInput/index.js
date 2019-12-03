/* eslint-disable import/no-extraneous-dependencies */
import * as PropTypes from 'prop-types'
import React from 'react'

/**
 * Date input form
 *
 * @param {*} props
 *
 * @return {*}
 */
export const DateInput = React.forwardRef((props, ref) => {
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
