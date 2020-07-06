/**
 * Generator helper
 */
export class GeneratorHelper
{
	/**
	 * Execute call api generator
	 *
	 * @param {function} callback
	 * @param {*} val
	 *
	 * @return {*}
	 */
	static executeCallApi(generator, val)
	{
		const {done, value} = generator.next(val)

		if (done) {
			return value
		}

		let newValue = value

		if (value && value.next) {
			newValue = GeneratorHelper.executeCallApi(value)
		}

		return GeneratorHelper.executeCallApi(generator, newValue)
	}
}
