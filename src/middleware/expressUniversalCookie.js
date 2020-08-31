import Cookies from 'universal-cookie'

const setCookies = function () {
	Object.entries(this.req?.universalCookies?.needcookies || {}).map(([name, { value, options }]) => {
		this.res.cookie(name, value, options)
	})
}

export default function main() {
	return function(req, res, next) {
		req.universalCookies = new Cookies(req.headers.cookie || '')
		req.universalCookies.addChangeListener((change) => {
			if (!res.cookie || res.headersSent) {
				return
			}

			const cookies = req.universalCookies.needcookies || {}

			if (change.value === undefined && cookies?.[change.name]) {
				delete cookies[change.name]
			} else {
				const expressOpt = Object.assign({}, change.options)
				if (expressOpt.maxAge && change.options && change.options.maxAge) {
					// the standard for maxAge is seconds but express uses milliseconds
					expressOpt.maxAge = change.options.maxAge * 1000
				}

				cookies[change.name] = {
					value: change.value,
					options: expressOpt,
				}
			}

			req.universalCookies.needcookies = cookies
		})
		req.universalCookies.setCookies = setCookies.bind({ req, res })
		next()
	}
}
