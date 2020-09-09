import _ from 'lodash'
import * as PropTypes from 'prop-types'
import React, { Component } from 'react'
import BaseForm from '../../forms/BaseForm'
import { TYPE } from '../Client'
import {
	HelperText,
	scrollToInput,
	WrapView,
} from './components'
import { AutocompleteInput } from './components/AutocompleteInput'
import { BarcodeInput } from './components/BarcodeInput'
import { ColorPicker } from './components/ColorPicker'
import { DateInput } from './components/DateInput'
import { DropdownInput } from './components/Dropdown'
import { Editor } from './components/Editor'
import { ImageInput } from './components/ImageInput'
import { TextInput } from './components/TextInput'
import { ToggleInput } from './components/ToggleInput'

const client = TYPE === 'web' ? 'web' : 'native'
const isWeb  = client === 'web'

/**
 * Form component class
 */
export class FormComponent extends Component
{
	/**
	 * On change values event
	 *
	 * @type {debounced}
	 */
	onChangeValueEvent = _.debounce((element, prevValue, nexValue) => {
		const { onChangeValue } = this.props

		if (typeof onChangeValue === 'function') {
			onChangeValue(element, prevValue, nexValue)
		}
	}, 500)

	/**
	 * Form constructor
	 *
	 * @param {object} props
	 *
	 * @return {undefined}
	 */
	constructor(props)
	{
		super(props)

		const form          = this.getFormInstance()
		const defaultValues = form.getDefaultValues()

		// Set default values
		if (props.values) {
			Object.entries(props.values).map(([name, v]) => {
				defaultValues[name] = v.value || ''

				return null
			})
		}

		this.inputs       = {}
		this.nativeInputs = {}
		this.imagesInputs = {}

		this.dynamicExcludeFields = []
		this.dynamicHiddenFields  = []

		this.state = {
			values:     defaultValues,
			labels:     {},
			validation: {},
		}
	}

	/**
	 * Get element props
	 *
	 * @param {object} element
	 *
	 * @return {object}
	 */
	static getElementContainerStyles(element)
	{
		return element && element.containerStyle && element.containerStyle[client] || {}
	}

	/**
	 * Clear input props
	 *
	 * @param {object} props
	 *
	 * @return {*}
	 */
	static clearProps = (props) => {
		return _.omit(props, [
			// Remove custom attributes
			'labelValue',
			'maskType',
		])
	}

	componentDidUpdate(prevProps)
	{
		const { requestState: { error } } = this.props

		if (error !== prevProps.requestState.error && (error && error.length)) {
			this.scrollToInput(error[0].field)
		}
	}

	/**
	 * Get input label
	 *
	 * @param {object} element
	 *
	 * @return {*}
	 */
	getLabel = (element) => {
		const { requiredSymbol }  = this.props
		const { required, label } = element

		return required && `${label}${requiredSymbol}` || label
	}

	/**
	 * Get element props
	 *
	 * @param {object} element
	 *
	 * @return {object}
	 */
	getElementProps = (element) => {
		const nativeProps = element && element.props && element.props[client]
		const commonProps = element && element.props && element.props.common

		return {
			...(commonProps || {}),
			...(nativeProps || {}),
		}
	}

	/**
	 * Get unique key element
	 *
	 * @param {object} element
	 * @param {number} index
	 *
	 * @return {string}
	 */
	getUniqueKey = (element, index) => {
		return element.name || index
	}

	/**
	 * Change input value
	 *
	 * @param {object} element
	 * @param {string} value
	 * @param {string} label
	 *
	 * @return {boolean}
	 */
	setValue = (element, value, label) => {
		const {
				  values:     prevValues,
				  labels:     prevLabels,
				  validation: prevValidation,
			  } = this.state

		const { name, trim } = element
		let newValue         = value

		if (trim && typeof newValue === 'string') {
			newValue = newValue.trim()
		}

		this.setState({
			values:     { ...prevValues, [name]: newValue },
			labels:     { ...prevLabels, [name]: label },
			validation: { ...prevValidation, [name]: '' },
		}, () => this.onChangeValueEvent(element, prevValues[name] || null, newValue))

		return true
	}

	/**
	 * Get input error
	 *
	 * @param {object} element
	 *
	 * @return {string|null}
	 */
	getError = (element) => {
		const { validation }              = this.state
		const { requestState: { error } } = this.props

		const { name } = element

		// Return error from state
		if (validation[name]) {
			return validation[name]
		}

		// Return error from backend
		if (error && error.length && typeof error === 'object') {
			const err = error.find(e => e.field === name)

			return err && err.message || null
		}

		return null
	}

	/**
	 * Get input hint
	 *
	 * @param {object} element
	 *
	 * @return {string}
	 */
	getHint = (element) => {
		return element.hint
	}

	/**
	 * Get form fields values
	 *
	 * @param {boolean} removeImages Remove images fields from values
	 *
	 * @return {Form.state.values|{}}
	 */
	getValues = (removeImages = false) => {
		const { values } = this.state
		const {
				  renderOnly,
				  fieldsKeep,
				  isStringifyValues,
			  }          = this.props

		const formValues  = {}
		let handledValues = _.omit(values, this.dynamicExcludeFields)

		if (renderOnly) {
			handledValues = _.pick(handledValues, [...renderOnly, ...fieldsKeep])
		}

		Object.entries(handledValues).forEach(([field, value]) => {
			// Remove specified image inputs
			if (removeImages) {
				if (this.imagesInputs[field]) {
					return
				}
			}

			// Normalize dot notation fields
			if (field.indexOf('.') !== -1) {
				_.set(formValues, field, value)
				return
			}

			formValues[field] = value
		})

		return formValues
	}

	/**
	 * Get input type
	 *
	 * @param {object} element
	 *
	 * @return {string}
	 */
	getInputType = (element) => {
		return element.type || BaseForm.TYPES.INPUT
	}

	/**
	 * If empty value
	 *
	 * @param {*} value
	 *
	 * @return {boolean}
	 */
	isEmptyValue = (value) => {
		return _.isEmpty(value) && !_.isNumber(value) || _.isNaN(value)
	}

	/**
	 * Is exclude field from form
	 *
	 * @param {object} element
	 *
	 * @return {boolean}
	 */
	isExclude = element => {
		const { renderOnly } = this.props
		const { name }       = element

		if (this.dynamicHiddenFields.includes(name)) {
			return true
		}

		if (!renderOnly) {
			return false
		}

		return !renderOnly.includes(name)
	}

	/**
	 * Get form instance
	 *
	 * @return {BaseForm}
	 */
	getFormInstance = () => {
		const { form } = this.props

		if (!this.formInstance) {
			this.formInstance = form && typeof form.create === 'function' && form.create() || form
		}

		return this.formInstance
	}

	/**
	 * Get input props
	 *
	 * @param {object} element
	 *
	 * @return {object}
	 */
	getInputProps = element => {
		const { values, labels } = this.state
		const { inputProps }     = this.props
		const { name }           = element

		const props      = this.getElementProps(element)
		const value      = values && values[name] || ''
		const labelValue = labels && labels[name] || ''

		const resultProps = {
			...props,
			value,
			labelValue,
			name,
			label: this.getLabel(element),
			...(
				isWeb
					? { onChange: (v) => this.setValue(element, v) }
					: { onChangeText: (v) => this.setValue(element, v) }
			),
		}

		return inputProps(element, resultProps)
	}

	/**
	 * Validate form
	 *
	 * @param {boolean} scrollToFirstError
	 * @param {boolean} setErrorFocus
	 *
	 * @return {boolean}
	 */
	validate = (scrollToFirstError = true, setErrorFocus = true) => {
		const { values } = this.state
		const instance   = this.getFormInstance()
		const errors     = {}
		let firstError   = null

		instance.map(element => {
			const { required, label, name } = element

			if (required && !this.isExclude(element) && this.isEmptyValue(values[name])) {
				errors[name] = `Необходимо заполнить «${label}»`

				if (firstError === null) {
					firstError = name
				}
			}

			return null
		})

		this.setState({
			validation: errors,
		})

		if (!_.isEmpty(errors)) {
			if (scrollToFirstError === true) {
				this.scrollToInput(firstError, setErrorFocus)
			}

			return false
		}

		return true
	}

	/**
	 * Scroll to input
	 *
	 * @param {string} name
	 * @param {boolean} setErrorFocus
	 *
	 * @return {undefined}
	 */
	scrollToInput = (name, setErrorFocus = true) => {
		const { scrollView } = this.props

		const errorInput       = this.inputs[name]
		const errorNativeInput = this.nativeInputs[name]

		if (errorInput && scrollView) {
			const scrollObj = typeof scrollView === 'function'
				? scrollView()
				: scrollView

			scrollToInput(errorInput, scrollObj, () => {
				if (setErrorFocus && errorNativeInput && errorNativeInput.focus) {
					errorNativeInput.focus()
				}
			})
		}
	}

	/**
	 * Handle element logick props
	 *
	 * @param {Object} element
	 *
	 * @return {undefined}
	 */
	handleLogicProps = element => {
		const {
				  name,
				  isHidden,
				  fieldKeep,
			  } = element

		if (fieldKeep === false) {
			this.dynamicExcludeFields.push(name)
		}

		if (isHidden === true) {
			this.dynamicHiddenFields.push(name)
		}
	}

	/**
	 * For override in parent class
	 *
	 * @param {object} element
	 * @param {object} addProps
	 *
	 * @return {*}
	 */
	parentGetInputProps = (element, addProps) => addProps

	/**
	 * For override in parent class
	 *
	 * @param {object} props
	 *
	 * @return {*}
	 */
	parentGetHelper = (element, props) => props

	/**
	 * For override in parent class
	 *
	 * @param {object} props
	 *
	 * @return {*}
	 */
	parentGetWrapper = (props) => props

	/**
	 * Render custom element
	 *
	 * @param {object} element
	 * @param {object} addProps
	 *
	 * @return {*}
	 */
	renderCustom = (element, addProps) => {
		const { values }       = this.state
		const { customInputs } = this.props

		const { name } = element

		const props = this.getElementProps(element)
		const value = values && values[name] || ''

		if (customInputs && typeof customInputs[name] === 'function') {
			return customInputs[name](element, value, this.setValue, {
				...props, ...addProps,
				label: this.getLabel(element),
				name,
			})
		}

		return null
	}

	/**
	 * Render text input
	 *
	 * @param {object} element
	 * @param {object} addProps
	 *
	 * @return {*}
	 */
	renderTextInput = (element, addProps) => {
		const inputProps = {
			...this.getInputProps(element),
			...addProps,
		}

		if (isWeb) {
			inputProps.onChange = (v) => this.setValue(element, v.target.value)
		}

		return (
			<TextInput
				ref={i => {
					this.nativeInputs[element.name] = i
				}}
				{...inputProps}
			/>
		)
	}

	/**
	 * Render dropdown input
	 *
	 * @param {object} element
	 * @param {object} addProps
	 *
	 * @return {*}
	 */
	renderDropdown = (element, addProps) => {
		const { values }             = this.state
		const { values: fieldsData } = this.props

		const { name } = element

		const props       = { ...this.getElementProps(element), ...addProps }
		const data        = fieldsData && fieldsData[name] && fieldsData[name].data || props && props.data || []
		const selectValue = values && values[name]
							|| fieldsData && fieldsData[name] && fieldsData[name].value
							|| ''

		const mergeProps = {
			...props,
			...{
				data,
				name,
				selectedValue: selectValue,
				inputLabel:    this.getLabel(element),
				...(
					isWeb
						? { onChange: (v) => this.setValue(element, v.value || '') }
						: { onValueChange: (v) => this.setValue(element, v) }
				),
			},
		}

		return (
			<DropdownInput {...mergeProps} />
		)
	}

	/**
	 * Render autocomplete dropdown input
	 *
	 * @param {object} element
	 * @param {object} addProps
	 *
	 * @return {*}
	 */
	renderAutocomplete = (element, addProps) => {
		const inputProps = {
			...this.getInputProps(element),
			...addProps,
		}

		return (
			<AutocompleteInput
				ref={i => {
					this.nativeInputs[element.name] = i
				}}
				{...inputProps}
			/>
		)
	}

	/**
	 * Render date input
	 *
	 * @param {object} element
	 * @param {object} addProps
	 *
	 * @return {*}
	 */
	renderDate = (element, addProps) => {
		const inputProps = {
			...this.getInputProps(element),
			...addProps,
		}

		return (
			<DateInput
				ref={i => {
					this.nativeInputs[element.name] = i
				}}
				{...inputProps}
			/>
		)
	}

	/**
	 * Render image input
	 *
	 * @param {object} element
	 * @param {object} addProps
	 *
	 * @return {*}
	 */
	renderImage = (element, addProps) => {
		const inputProps = {
			...this.getInputProps(element),
			...addProps,
		}

		return (
			<ImageInput
				ref={i => {
					this.nativeInputs[element.name] = i
					this.imagesInputs[element.name] = true
				}}
				{...inputProps}
			/>
		)
	}

	/**
	 * Get images inputs
	 *
	 * @return {{}|*}
	 */
	getImagesInputs = () => {
		return Object.keys(this.imagesInputs).map(name => (this.nativeInputs[name]))
	}

	/**
	 * Render toggle input
	 *
	 * @param {object} element
	 * @param {object} addProps
	 *
	 * @return {*}
	 */
	renderToggleInput = (element, addProps) => {
		const inputProps = {
			...this.getInputProps(element),
			...addProps,
		}

		return (
			<ToggleInput
				ref={i => {
					this.nativeInputs[element.name] = i
				}}
				{...inputProps}
			/>
		)
	}

	/**
	 * Render editor texarea
	 *
	 * @param {object} element
	 * @param {object} addProps
	 *
	 * @return {*}
	 */
	renderEditor = (element, addProps) => {
		const inputProps = {
			...this.getInputProps(element),
			...addProps,
		}

		return (
			<Editor
				ref={i => {
					this.nativeInputs[element.name] = i
				}}
				{...inputProps}
			/>
		)
	}

	/**
	 * Render barcode reader input
	 *
	 * @param {object} element
	 * @param {object} addProps
	 *
	 * @return {*}
	 */
	renderBarcodeInput = (element, addProps) => {
		const inputProps = {
			...this.getInputProps(element),
			...addProps,
		}

		return (
			<BarcodeInput
				ref={i => {
					this.nativeInputs[element.name] = i
				}}
				{...inputProps}
			/>
		)
	}

	/**
	 * Render color picker
	 *
	 * @param {object} element
	 * @param {object} addProps
	 *
	 * @return {*}
	 */
	renderColorPicker = (element, addProps) => {
		const inputProps = {
			...this.getInputProps(element),
			...addProps,
		}

		return (
			<ColorPicker
				ref={i => {
					this.nativeInputs[element.name] = i
				}}
				{...inputProps}
			/>
		)
	}

	/**
	 * Render form inputs
	 *
	 * @return {*}
	 */
	render()
	{
		const { helperProps: modifyHelperProps } = this.props

		const instance = this.getFormInstance()

		return instance.map((element, index) => {
			this.handleLogicProps(element)

			if (this.isExclude(element)) {
				return false
			}

			const error        = this.getError(element)
			const hint         = this.getHint(element)
			const resultProps  = this.parentGetInputProps(element, { error })
			const helperProps  = modifyHelperProps(element, this.parentGetHelper(element, {
				type:    error && 'error' || 'info',
				visible: error || hint,
				text:    error || hint,
			}))
			const wrapperProps = this.parentGetWrapper({
				ref:   i => {
					this.inputs[element.name] = i
				},
				key:   this.getUniqueKey(element, index),
				style: this.constructor.getElementContainerStyles(element),
			})

			return (
				<WrapView {...wrapperProps}>
					{{
						[BaseForm.TYPES.INPUT]:        this.renderTextInput,
						[BaseForm.TYPES.DROPDOWN]:     this.renderDropdown,
						[BaseForm.TYPES.CUSTOM]:       this.renderCustom,
						[BaseForm.TYPES.AUTOCOMPLETE]: this.renderAutocomplete,
						[BaseForm.TYPES.DATE]:         this.renderDate,
						[BaseForm.TYPES.IMAGE]:        this.renderImage,
						[BaseForm.TYPES.TOGGLE]:       this.renderToggleInput,
						[BaseForm.TYPES.EDITOR]:       this.renderEditor,
						[BaseForm.TYPES.BARCODE]:      this.renderBarcodeInput,
						[BaseForm.TYPES.COLOR_PICKER]: this.renderColorPicker,
					}[this.getInputType(element)](element, resultProps)}

					<HelperText {...helperProps} />
				</WrapView>
			)
		})

	}
}

FormComponent.propTypes = {
	/**
	 * @type BaseForm
	 */
	form:              PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
	requestState:      PropTypes.object,
	values:            PropTypes.object,
	customInputs:      PropTypes.object,
	scrollView:        PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
	requiredSymbol:    PropTypes.string,
	renderOnly:        PropTypes.array,
	fieldsKeep:        PropTypes.array,
	onChangeValue:     PropTypes.func,
	inputProps:        PropTypes.func,
	helperProps:       PropTypes.func,
	isStringifyValues: PropTypes.bool,
}

FormComponent.defaultProps = {
	requestState:      {},
	values:            {},
	customInputs:      {},
	requiredSymbol:    '*',
	renderOnly:        null,
	fieldsKeep:        [],
	scrollView:        null,
	onChangeValue:     null,
	isStringifyValues: true,
	inputProps:        (element, props) => props,
	helperProps:       (element, props) => props,
}
