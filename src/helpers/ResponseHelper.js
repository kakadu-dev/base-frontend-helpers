import { TYPE } from './Client';

/**
 * Response helper
 */
export default class ResponseHelper
{
	/**
	 * Parse header key
	 *
	 * @param {object} object
	 * @param {string} key
	 *
	 * @return {object}
	 */
	static parseHeaders(object, key, defaultValue = null) {
		if (!object) {
			return defaultValue;
		}

		const obj = object && object.response && object.response.headers
					|| object && object.headers
					|| object;

		if (typeof obj.get === 'function') {
			return ResponseHelper.parseEncodedHeader(obj.get(key)) || defaultValue;
		} else if (obj && obj.map) {
			return obj.map[key.toLowerCase()] || defaultValue;
		}

		return defaultValue;
	}

	/**
	 * Parse encoded header value
	 *
	 * @param {string} value
	 *
	 * @return {(object | null)}
	 */
	static parseEncodedHeader(value) {
		if (!value) {
			return null;
		}

		if (value.indexOf('=') === -1) {
			return value;
		}

		const properties = value && value.split('; ') || [];
		const obj        = {};

		properties.forEach(property => {
			const [k, v] = property.split('=');

			obj[k] = v;
		});

		return obj;
	}

	/**
	 * Clean response object
	 *
	 * @param {object} response
	 *
	 * @return {object}
	 */
	static cleanResponse(response) {
		const {
				  status,
				  ok,
				  headers,
			  } = response || {};

		if (headers && TYPE !== 'web') {
			if (typeof headers.delete === 'function') {
				headers.delete('link');
			} else if (headers.map) {
				headers.map.link = undefined;
			}
		}

		return {
			status,
			ok: status >= 200 && status <= 299,
			headers,
		};
	}
}
