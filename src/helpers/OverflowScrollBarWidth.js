import * as PropTypes from 'prop-types'
import { useEffect } from 'react'

/**
 * Toggle scrollbar width for padding in "overflow: hidden"
 *
 * @param isOverflowed
 *
 * @return {null}
 * @constructor
 */
const OverflowScrollBarWidth = ({ isOverflowed }) => {
	/**
	 * Scrollbar width
	 *
	 * @type {number}
	 */
	const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

	useEffect(() => {
		if (isOverflowed) {
			document.body.style.overflow     = 'hidden'
			document.body.style.paddingRight = `${scrollbarWidth}px`
		} else {
			document.body.style.overflow     = ''
			document.body.style.paddingRight = ''
		}
	}, [isOverflowed])

	return null
}

OverflowScrollBarWidth.propTypes = {
	isOverflowed: PropTypes.bool,
}

OverflowScrollBarWidth.defaultProps = {
	isOverflowed: false,
}

export { OverflowScrollBarWidth }
