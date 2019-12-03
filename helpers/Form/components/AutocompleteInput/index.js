import * as PropTypes from 'prop-types'
import React from 'react'

/**
 * Autocomplete input form
 *
 * @param {*} props
 *
 * @return {*}
 */
export const AutocompleteInput = React.forwardRef((props, ref) => {
	const {
			  component,
			  ...newProps
		  } = props

	return component({ ...newProps, ref })
})

AutocompleteInput.propTypes = {
	component: PropTypes.func,
}

AutocompleteInput.defaultProps = {
	component: () => null,
}
