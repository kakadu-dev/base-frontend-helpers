/**
 * Base helper
 */
export class BaseHelper
{
	/**
	 * @private
	 * @type {{}}
	 */
	static DoublePressTime = {}

	/**
	 * String to hash
	 *
	 * @param {string} str
	 *
	 * @return {number}
	 */
	static strToHash = str => {
		let hash = 0

		if (typeof str !== 'string' || str.length === 0) {
			return hash
		}

		for (let i = 0; i < str.length; i++) {
			let char = str.charCodeAt(i)
			hash     = ((hash << 5) - hash) + char
			hash     = hash & hash // Convert to 32bit integer
		}

		return hash
	}

	/**
	 * Double press handler
	 *
	 * @param {function} callback
	 * @param {string} key
	 * @param {number} delay
	 *
	 * @return {Function}
	 */
	static onDoublePress = (callback, key = 'c', delay = 300) => {
		return (...args) => {
			const time  = Date.now()
			const delta = time - (BaseHelper.DoublePressTime[key] || 0)

			if (delta < delay) {
				callback(...args)
			}

			BaseHelper.DoublePressTime[key] = time
		}
	}

	/**
	 * Clear string
	 *
	 * @param {string} str
	 * @param {boolean} toLower
	 *
	 * @return {string}
	 */
	static clearString = (str, toLower = false) => {
		const clearString = `${str}`
			.replace(/^A-zА-я0-9.\s+/g, '')
			.replace(/\s\s+/g, ' ')
			.trim()

		if (toLower) {
			return clearString.toLowerCase()
		}

		return clearString
	}

	/**
	 * Compare strings
	 *
	 * @param {number|string} str1
	 * @param {number|string} str2
	 *
	 * @return {string|null}
	 */
	static compareString = (str1, str2) => {
		if (!str1 && str2) {
			return str2
		}

		if (!str2 && str1) {
			return str1
		}

		if (!str1 && !str2) {
			return null
		}

		const clean1 = BaseHelper.clearString(str1, true)
		const clean2 = BaseHelper.clearString(str2, true)

		// Compare as numbers
		if (!isNaN(clean1) && !isNaN(clean2)) {
			const num1 = Number(str1)
			const num2 = Number(str2)

			if (num1 === num2) {
				return null
			}

			return num1 > num2 ? str1 : str2
		}

		const words1 = clean1.split(' ').sort()
		const words2 = clean2.split(' ').sort()

		// Compare as array
		const result = words1
			.map((val, i) => words2[i] === val)
			.every(isSame => isSame)

		if (result) {
			return null
		}

		// Compare as numbers. Check if strings is numbers
		if (
			!isNaN(parseFloat(clean1)) && !isNaN(parseFloat(clean2))
			&& words1.length >= 2 && words2.length >= 2
			&& words1.length <= 4 && words2.length <= 4
		) {
			const float1 = parseFloat(clean1)
			const float2 = parseFloat(clean2)

			if (float1 === float2) {
				return clean1.length > clean2.length
					? str1
					: str2
			}

			return float1 > float2 ? str1 : str2
		}

		// String equals or strings contain only one word
		if (
			clean1.length === clean2.length
			|| words1.length === 1 && words2.length === 1
		) {
			// Compare as strings
			return clean1 > clean2 ? str1 : str2
		}

		return clean1.length > clean2.length
			? str1
			: str2
	}

	/**
	 * Get query params from url link
	 *
	 * @param {string} query
	 *
	 * @return {*}
	 */
	static getQueryStringParams = query => {
		return query
			? (/^[?#]/.test(query) ? query.slice(1) : query)
				.split('&')
				.reduce(
					(params, param) => {
						const [key, value] = param.split('=')
						params[key]        = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : ''

						// Check if string is json
						if (params[key].slice(0, 1) === '{' && params[key].slice(-1) === '}') {
							try {
								params[key] = JSON.parse(params[key])
							} catch (e) {
								//
							}
						}

						return params
					}, {},
				)
			: {}
	}

	/**
	 * Detect mobile browsers
	 *
	 * @return {boolean}
	 */
	static isMobileDevice = () => {
		const wind      = typeof(window) !== 'undefined' ? window : {}
		const nav       = global && global.navigator || {}
		const userAgent = nav.userAgent || nav.vendor || wind.opera || ''

		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4)))
			return true

		return false
	}
}
