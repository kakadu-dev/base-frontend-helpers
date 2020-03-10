import FetchService from '../services/FetchService'

export default function expressFetchHelper() {
	return function(req, res, next) {
		const headers = {
			...req.headers,
			'x-forwarded-for': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
		}

		FetchService
			.getInstance()
			.setClientHeaders(headers, req.protocol)
			.setClientCookiesHandler(req.universalCookies)

		next()
	}
}
