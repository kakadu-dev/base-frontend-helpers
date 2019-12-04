import _ from 'lodash'
import { GeneratorHelper } from '../helpers/GeneratorHelper'

/**
 * Base form
 */
export default class BaseForm
{
	/**
	 * Input types
	 *
	 * @type {{INPUT: string, DROPDOWN: string, CUSTOM: string, AUTOCOMPLETE: string, TOGGLE: boolean, EDITOR: string}}
	 */
	static TYPES = {
		INPUT:        'input',
		DROPDOWN:     'dropdown',
		DATE:         'date',
		IMAGE:        'image',
		CUSTOM:       'custom',
		AUTOCOMPLETE: 'dropdown_autocomplete',
		TOGGLE:       'toggle',
		EDITOR:       'editor',
		BARCODE:      'barcode',
	}

	/**
	 * Input mask types
	 *
	 * @type {{PHONE: string}}
	 */
	static MASK_TYPES = {
		PHONE:         'phone',
		TIME_INTERVAL: 'time_interval',
	}

	/**
	 * Model class
	 *
	 * @type {BaseModel}
	 */
	modelClass = null

	/**
	 * Send form dispatch create
	 *
	 * @type {null|function}
	 */
	dispatchCreateForm = null

	/**
	 * Send form dispatch update
	 *
	 * @type {null|function}
	 */
	dispatchUpdateForm = null

	/**
	 * Response create form state
	 *
	 * @type {null|function}
	 */
	responseCreateState = null

	/**
	 * Response update form state
	 *
	 * @type {null|function}
	 */
	responseUpdateState = null

	/**
	 * Is new form
	 *
	 * @private
	 *
	 * @type {boolean}
	 */
	isNewForm = true

	/**
	 * Form fields
	 *
	 * example:
	 * {
	 * 		label: 'Test',
	 * 		name: 'test',
	 * 		type: 'input',
	 * 		required: false,
	 * 		props: {
	 * 	        common: {},
	 * 		 	native: {},
	 * 		 	web: {}
	 * 		},
	 * 		containerStyle: {
	 * 		 	native: {},
	 * 		 	web: {},
	 * 		}
	 * }
	 *
	 * @private
	 * @type {Array}
	 */
	fields = []

	/**
	 * Default values
	 *
	 * @private
	 * @type {object}
	 */
	defaultValues = {}

	/**
	 * Model with default values
	 * Exist only if isNewForm = false
	 *
	 * @type {null|BaseModel}
	 */
	model = null

	/**
	 * Create form
	 *
	 * @return {BaseForm}
	 */
	static create()
	{
		return new this()
	}

	/**
	 * Generate data for dropdown from enum
	 *
	 * @param {object} obj
	 * @param {boolean} withKey
	 *
	 * @return {{label: any, value: string, key: number}[]}
	 */
	static getDropdownOptions = (obj, withKey = true) => {
		return Object.entries(obj).map(([value, label], index) => {
			return {
				label,
				value,
				...(withKey ? { key: index } : {}),
			}
		})
	}

	/**
	 * Create image upload url helper
	 *
	 * @param {function} createApiUrl
	 * @param {function} updateApiUrl
	 * @param {boolean} addPrimaryKey
	 *
	 * @return {(function(*, *=): *)|(function(*): *)}
	 */
	createImageUrl = (createApiUrl, updateApiUrl, addPrimaryKey = true) => {
		const callback = (searchQuery, id) => {
			const args       = []
			const primaryKey = id || this.model && this.model.primaryKey()

			if (primaryKey && addPrimaryKey) {
				args.push(primaryKey)
			}

			args.push(searchQuery().addCustomParams({ returnRequest: true }))

			return GeneratorHelper.executeCallApi(
				args.length > 1 && updateApiUrl
					? updateApiUrl.apply(this, args)
					: createApiUrl.apply(this, args),
			)
		}

		return (...params) => callback.apply(this, params)
	}

	/**
	 * Get form fields
	 *
	 * @return {Array.<{label, name, props}>}
	 */
	getFields()
	{
		return this.fields || []
	}

	/**
	 * Map fields
	 *
	 * @param {function({label, name, props}, index): undefined} callback
	 *
	 * @return {Array.<object>}
	 */
	map = (callback) => {
		return this.getFields().map(callback)
	}

	/**
	 * Set default values to form from many models
	 *
	 * @param {...object} models
	 *
	 * @return {BaseForm}
	 */
	setDefaultValues(...models)
	{
		Object.entries(this.fields).map(([index, field]) => {
			models.some(model => {
				const value = _.get(model.getRawModel(), field.name)

				if (value) {
					this.setDefault(field.name, value)

					return true
				}

				return false
			})
		})

		return this
	}

	/**
	 * Set default values from model
	 *
	 * @param {BaseForm} model
	 *
	 * @return {BaseForm}
	 */
	setDefaultFromModel(model)
	{
		Object.entries(this.fields).map(([index, field]) => {
			const value = _.get(model.getRawModel(), field.name)

			if (value) {
				this.setDefault(field.name, value)
			}
		})

		this.model = model

		this.setNew(false)

		return this
	}

	/**
	 * Get default values
	 *
	 * @return {*}
	 */
	getDefaultValues()
	{
		return this.defaultValues
	}

	/**
	 * Set default value
	 *
	 * @param {string} field
	 * @param {*} value
	 *
	 * @return {BaseForm}
	 */
	setDefault(field, value)
	{
		this.defaultValues[field] = value

		return this
	}

	/**
	 * Is new form
	 *
	 * @return {boolean}
	 */
	isNew()
	{
		return this.isNewForm
	}

	/**
	 * Change form new state
	 *
	 * @param value
	 *
	 * @return {BaseForm}
	 */
	setNew(value = true)
	{
		this.isNewForm = value

		return this
	}

	/**
	 * Get form dispatcher
	 *
	 * @return {function}
	 */
	getFormDispatcher()
	{
		return this.isNew()
			? this.dispatchCreateForm
			: this.dispatchUpdateForm
	}

	/**
	 * Get form state selector
	 *
	 * @return {function}
	 */
	getFormStateSelector()
	{
		return this.isNew()
			? this.responseCreateState
			: this.responseUpdateState
	}

	/**
	 * Set update dispatcher
	 *
	 * @param {function} dispatcher
	 *
	 * @return {BaseForm}
	 */
	setUpdateDispatcher(dispatcher)
	{
		this.dispatchUpdateForm = dispatcher

		return this
	}

	/**
	 * Set response update state
	 *
	 * @param {function} state
	 *
	 * @return {BaseForm}
	 */
	setUpdateState(state)
	{
		this.responseUpdateState = state

		return this
	}

	/**
	 * Set create dispatcher
	 *
	 * @param {function} dispatcher
	 *
	 * @return {BaseForm}
	 */
	setCreateDispatcher(dispatcher)
	{
		this.dispatchCreateForm = dispatcher

		return this
	}

	/**
	 * Set response create state
	 *
	 * @param {function} state
	 *
	 * @return {BaseForm}
	 */
	setCreateState(state)
	{
		this.responseCreateState = state

		return this
	}

	/**
	 * Get field
	 *
	 * @param  {string} name
	 *
	 * @returns {{label, name, props}[] | {label, name, props} | null}
	 */
	getField = (name) => {
		const fields = this.getFields().filter(e => e.name === name)

		return fields && fields[0] || null
	}
}
