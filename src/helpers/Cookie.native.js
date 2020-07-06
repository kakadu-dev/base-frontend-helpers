import storage from '../storage/AsyncStorage'

export async function getCookie(name)
{
	try {
		return await storage.getItem(`@${name}`)
	} catch (e) {
		return null
	}
}

export async function setCookie(name, value, allSubdomain = false, options)
{
	if (value === null || value === undefined) {
		return await deleteCookie(name)
	}

	try {
		return await storage.setItem(`@${name}`, value)
	} catch (e) {
		return null
	}
}

export async function deleteCookie(name)
{
	try {
		return await storage.removeItem(`@${name}`)
	} catch (e) {
		return null
	}
}
