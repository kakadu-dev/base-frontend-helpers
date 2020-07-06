/**
 * Options helper
 */
export class OptionsHelper
{
	static colorTypes = {
		color:    'color',
		gradient: 'gradient',
	}

	static cellTypes = {
		single: 'single',
		double: 'double',
	}

	/**
	 * Get properties colors
	 *
	 * @param {string} colors
	 *
	 * @return {object}
	 */
	static getPropertyColors = colors => {
		const values = colors.split(';')

		/* Single color */
		if (values.length === 1) {
			let type = this.colorTypes.color

			if (colors.length > 10) {
				type = this.colorTypes.gradient
			}

			return {
				type:      this.cellTypes.single,
				value:     colors,
				colorType: type,
			}
		}

		/* Double color */
		let firstType  = this.colorTypes.color
		let secondType = this.colorTypes.color

		const firstValue  = values[0]
		const secondValue = values[1]

		if (firstValue.length > secondValue.length) {
			firstType = this.colorTypes.gradient
		}

		if (firstValue.length < secondValue.length) {
			secondType = this.colorTypes.gradient
		}

		return {
			type:   this.cellTypes.double,
			top:    {
				value: firstValue,
				type:  firstType,
			},
			bottom: {
				value: secondValue,
				type:  secondType,
			},
		}
	}
}
