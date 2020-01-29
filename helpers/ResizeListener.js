/* eslint-disable no-restricted-globals */
import * as PropTypes from 'prop-types'
import {
	useEffect,
	useLayoutEffect,
	useState,
} from 'react'
import { BaseHelper } from './BaseHelper'

/**
 * Resize window listener
 *
 * @param {function} onChange
 *
 * @returns {null}
 * @constructor
 */
const ResizeListener = ({onChange}) => {
    const [size, setSize] = useState({
        width:  0,
        height: 0,
    })

    useLayoutEffect(() => {
        function updateSize() {
            setSize({
                width:  BaseHelper.isMobileDevice() ? screen.width : window.innerWidth,
                height: BaseHelper.isMobileDevice() ? screen.height : window.innerHeight,
            })
        }

        window.addEventListener('resize', updateSize)
        updateSize()
        return () => window.removeEventListener('resize', updateSize)
    }, [])

    useEffect(() => {
        onChange(size)
    }, [size])

    return null
}

ResizeListener.propTypes = {
    onChange: PropTypes.func,
}

ResizeListener.defaultProps = {
    onChange: () => null,
}

export { ResizeListener }
