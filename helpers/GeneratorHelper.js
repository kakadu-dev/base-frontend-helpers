/**
 * Generator helper
 */
export class GeneratorHelper
{
	/**
	 * Execute call api generator
	 *
	 * @param {function} callback
	 *
	 * @return {*}
	 */
	static executeCallApi(generator, value)
	{
		let genVal = generator.next(value)

		if (genVal.done) {
			return genVal.value
		}

		return GeneratorHelper.executeCallApi(generator, genVal.value)
	}
}
