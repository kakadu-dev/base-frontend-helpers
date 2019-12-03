/**
 * Date helper
 */
export class DateHelper
{
	/**
	 * Convert date to YYYY-MM-DD
	 *
	 * @param {Date} date
	 *
	 * @return {string}
	 */
	static toServerFormat = (date) => {
		let month  = (date.getMonth() + 1).toString()
		let day    = (date.getDate()).toString()
		const year = date.getFullYear()

		if (month.length < 2) month = `0${month}`
		if (day.length < 2) day = `0${day}`

		return [year, month, day].join('-')
	}
}
