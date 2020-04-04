import FetchService from '../services/FetchService'

export default function expressFetchHelper() {
	return function(req, res, next) {
		const headers = {
			...req.headers,
			'x-forwarded-for': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
		}
		const protocol = req.secure
			? 'https'
			: (req.headers['x-forwarded-proto'] || req.protocol)

		FetchService
			.getInstance()
			.setClientHeaders(headers, protocol)
			.setClientCookiesHandler(req.universalCookies)

		next()
	}
}
