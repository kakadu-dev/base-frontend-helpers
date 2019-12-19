/* eslint-disable import/no-extraneous-dependencies */
import * as PropTypes from 'prop-types'
import { forwardRef } from 'react'

/**
 * Autocomplete input form
 *
 * @param {*} props
 *
 * @return {*}
 */
export const AutocompleteInput = forwardRef((props, ref) => {
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
