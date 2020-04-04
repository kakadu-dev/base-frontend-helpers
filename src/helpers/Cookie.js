import FetchService from '../services/FetchService'

const doc = typeof (document) !== 'undefined' ? document : null

/**
 * Get cookie subdomains pattern
 *
 * @param {string} host
 *
 * @return {*}
 */
const getCookieDomain = host => {
	const clearHost = (host || '').replace(/:[0-9]*/, '')
	const isIp      = !clearHost.match(/[^0-9.:]/)

	if (isIp || clearHost.includes('localhost')) {
		return clearHost
	}

	const domains = clearHost.split('.')

	if (domains.length > 2) {
		domains[0] = ''
	} else {
		domains.unshift('')
	}

	return domains.join('.')
}

export function getCookie(name)
{
	if (!doc) {
		return FetchService
			.getInstance()
			.getClientCookiesHandler()
			.get(name)
	}

	const matches = doc.cookie.match(new RegExp(
		`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`,
	))
	return matches ? decodeURIComponent(matches[1]) : undefined
}

export function setCookie(name, value, allSubdomain = false, options)
{
	options         = options || {}
	let { expires } = options

	// Set default expires
	if (!expires) {
		expires = 86400 * 5 // 5 day
	}

	// Set default path
	if (!options.path) {
		options.path = '/'
	}

	if (typeof expires === 'number' && expires) {
		const d = new Date()
		d.setTime(d.getTime() + expires * 1000)
		expires = options.expires = d
	}
	if (expires && expires.toUTCString && doc) {
		options.expires = expires.toUTCString()
	}

	value = encodeURIComponent(value)

	let updatedCookie = `${name}=${value}`

	if (allSubdomain) {
		const host = doc
			? location.host
			: FetchService
				.getInstance()
				.getClientHeaders()
				.Host

		options.domain = getCookieDomain(host)
	}

	if (!doc) {
		return FetchService
			.getInstance()
			.getClientCookiesHandler()
			.set(name, value, options)
	}

	for (const propName in options) {
		updatedCookie += `; ${propName}`
		const propValue = options[propName]
		if (propValue !== true) {
			updatedCookie += `=${propValue}`
		}
	}

	doc.cookie = updatedCookie

	return true
}

export function deleteCookie(name)
{
	if (!doc) {
		FetchService
			.getInstance()
			.getClientCookiesHandler()
			.remove(name)
	}

	return setCookie(name, undefined, true, {
		expires: -1,
	})
}
