import {
	useEffect,
	useState,
} from 'react'
import { Animated } from 'react-native'

/**
 * Animation create helper
 *
 * @param {function} doAnimation
 * @param {number} duration
 * @param {boolean} useNativeDriver
 *
 * @return {unknown}
 */
export const useAnimation = ({ doAnimation, duration, useNativeDriver = false }) => {
	const [animation] = useState(new Animated.Value(0))

	useEffect(() => {
		Animated.timing(animation, {
			toValue: doAnimation ? 1 : 0,
			duration,
			useNativeDriver,
		}).start()
	}, [doAnimation])

	return animation
}
