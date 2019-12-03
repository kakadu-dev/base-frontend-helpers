import Fingerprint2 from 'fingerprintjs2'
import { BaseHelper } from '../BaseHelper'

export const TYPE        = 'web'
export const getClientId = () => new Promise(resolve => {
	Fingerprint2.get({}, async components => {
		const result = await components.map((item) => {
			return item.value
		})
		const finger = await Fingerprint2.x64hash128(result.join(''), 31)

		resolve(finger)
	})
})
export const PLATFORM    = BaseHelper.isMobileDevice() ? 'mobile_browser' : 'browser'
