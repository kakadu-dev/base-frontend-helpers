/**
 * Run command once service
 */
export class RunOnceService
{
	/**
	 * @type {RunOnceService}
	 */
	static myInstance = null

	/**
	 * @type {object}
	 */
	commands = {}

	/**
	 * Get instance
	 *
	 * @return {RunOnceService}
	 */
	static getInstance()
	{
		if (this.myInstance === null) {
			this.myInstance = new RunOnceService()
		}

		return this.myInstance
	}

	/**
	 * Run command
	 *
	 * @param {string} commandId
	 * @param {function} command
	 *
	 * @return {RunOnceService}
	 */
	runOnce(commandId, command)
	{
		if (!this.commands[commandId]) {
			this.commands[commandId] = true
			command()
		}

		return this
	}

	/**
	 * Delete command from memory
	 *
	 * @param {string} commandId
	 *
	 * @return {RunOnceService}
	 */
	clearCommand(commandId)
	{
		if (this.commands[commandId]) {
			delete this.commands[commandId]
		}

		return this
	}
}
