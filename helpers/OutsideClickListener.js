import {
	forwardRef,
	useEffect,
} from 'react'

/**
 * Outer click listener
 *
 * @param {function} onOuterClick
 *
 * @return {undefined}
 */
export const OuterClickListener = forwardRef(({ onOuterClick }, ref) => {
	const handleClickOutside = e => {
		if (!ref.current.contains(e.target)) {
			onOuterClick()
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	})
})
