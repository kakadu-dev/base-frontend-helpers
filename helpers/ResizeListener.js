import * as PropTypes from 'prop-types'
import {
	useEffect,
	useLayoutEffect,
	useState,
	useCallback,
} from 'react'
import { BaseHelper } from './BaseHelper'

const getScreenSize = () => ({
	width:  BaseHelper.isMobileDevice() ? screen.width : window.innerWidth,
	height: BaseHelper.isMobileDevice() ? screen.height : window.innerHeight,
})

/**
 * Resize window listener
 *
 * @param {function} onChange
 *
 * @returns {null}
 * @constructor
 */
const ResizeListener = ({ onChange }) => {
	const [size, setSize] = useState(getScreenSize())

	const updateSize = useCallback(() => setSize(getScreenSize()), [])

	useLayoutEffect(() => {
		window.addEventListener('resize', updateSize)
		updateSize()

		return () => window.removeEventListener('resize', updateSize)
	}, [])

	useEffect(() => {
		onChange(size)
	}, [size.width, size.height])

	return null
}

ResizeListener.propTypes = {
	onChange: PropTypes.func,
}

ResizeListener.defaultProps = {
	onChange: () => null,
}

export { ResizeListener }
