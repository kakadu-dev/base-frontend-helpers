import { hp } from 'base-frontend-components/helpers/Responsive'

/**
 * Loader helper
 */
export class LoaderHelper
{
	/**
	 * Get "y" property for next part of loader
	 *
	 * @param {object} prevElement
	 * @param {number} currentY
	 *
	 * @returns {number}
	 */
	static getNextY = (prevElement, currentY = hp(1.563)) => {
		const height    = prevElement.height
		const marginTop = prevElement.y

		return height + marginTop + currentY
	}

	/**
	 * Set element on center
	 *
	 * @param {number} fullWidth
	 * @param {number} elementWidth
	 *
	 * @returns {number}
	 */
	static setOnCenter = (fullWidth, elementWidth) => {
		return (fullWidth - elementWidth) / 2
	}

	/**
	 * Set element on end
	 *
	 * @param {object} prevElement
	 * @param {number} containerWidth
	 * @param {number} currentWidth
	 */
	static setOnEnd = (prevElement, containerWidth, currentWidth) => {
		const prevElementSpace = prevElement.x + prevElement.width

		return prevElementSpace + (containerWidth - (prevElementSpace + currentWidth))
	}
}
