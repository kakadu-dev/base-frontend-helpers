import _ from 'lodash'

/**
 * Profiling service
 */
export default class ProfilingService
{
	/**
	 * @type {ProfilingService}
	 * @private
	 */
	static myInstance = null

	/**
	 * @type {object}
	 * @private
	 */
	_commands = {}

	/**
	 * Get instance
	 *
	 * @return {ProfilingService}
	 */
	static getInstance()
	{
		if (this.myInstance === null) {
			this.myInstance = new ProfilingService()
		}

		return this.myInstance
	}

	/**
	 * Run command sugar method
	 *
	 * @param {string} commandId
	 * @param {Object} params
	 *
	 * @return {ProfilingService}
	 */
	static run(commandId, params)
	{
		ProfilingService.getInstance().runCommand(commandId, params)

		return ProfilingService
	}

	/**
	 * Run command
	 *
	 * @param {string} commandId
	 * @param {Object} params
	 *
	 * @return {ProfilingService}
	 */
	runCommand(commandId, params)
	{
		Object
			.entries(this._commands?.[commandId] ?? {})
			.map(([key, callback]) => callback(params))

		return this
	}

	/**
	 * Attach to command
	 *
	 * @param {string} commandId
	 * @param {function} callback
	 * @param {string} attachId
	 *
	 * @return {ProfilingService}
	 */
	attach(commandId, callback, attachId = 'common')
	{
		_.set(this._commands, `${commandId}.${attachId}`, callback)

		return this
	}

	/**
	 * Detach command callback
	 *
	 * @param {string} commandId
	 * @param {string} attachId
	 *
	 * @return {ProfilingService}
	 */
	detach(commandId, attachId = 'common')
	{
		if (this._commands?.[commandId]?.[attachId]) {
			delete this._commands?.[commandId]?.[attachId]
		}

		return this
	}
}
