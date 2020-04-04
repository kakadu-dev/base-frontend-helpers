/**
 * Single memory storage
 */
class SingleMemoryStorage
{
	/**
	 * @type {SingleMemoryStorage}
	 */
	static myInstance = null

	/**
	 * @type {Object}
	 */
	memory = {}

	/**
	 * Get instance
	 *
	 * @return {SingleMemoryStorage}
	 */
	static getInstance()
	{
		if (this.myInstance === null) {
			this.myInstance = new SingleMemoryStorage()
		}

		return this.myInstance
	}

	/**
	 * Set value
	 *
	 * @param {string} name
	 * @param {*} value
	 *
	 * @return {SingleMemoryStorage}
	 */
	set(name, value)
	{
		this.memory[name] = value

		return this
	}

	/**
	 * Get value
	 *
	 * @param {string} name
	 *
	 * @return {*}
	 */
	get(name)
	{
		return this.memory[name]
	}

	/**
	 * Remove value
	 *
	 * @param {string} name
	 *
	 * @return {SingleMemoryStorage}
	 */
	remove(name)
	{
		this.memory[name] = null

		return this
	}
}

export default SingleMemoryStorage
