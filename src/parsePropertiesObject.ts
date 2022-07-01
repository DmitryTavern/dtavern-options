/* eslint-disable @typescript-eslint/no-explicit-any */
import { OptionProperties, OptionProperty, OptionPropertyTypes } from '@types'
import { hasOwn, isFunction, isArray, isObject } from './utils'
import { isEqualConstructor } from './isEqualConstructor'

export const parsePropertiesObject = <Properties>(
	properties: Properties,
	propertiesSettings: OptionProperties<Properties>
): Required<Properties> => {
	for (const propertyKey in propertiesSettings) {
		const propertySetting = propertiesSettings[propertyKey]
		let propertyValue = properties[propertyKey]
		let propertyExists = hasOwn(properties, propertyKey)

		/**
		 * If property setting is null, skip other checkers
		 */
		if (propertySetting === null) continue

		/**
		 * If property setting have false required option,
		 * skip checker of exists in properties
		 */
		if (!propertyExists && hasOwn(propertySetting, 'required'))
			if (propertySetting['required'])
				throw `property "${propertyKey}" not exists`

		/**
		 * If property not exists, set default value, if it exists
		 * in setting
		 */
		if (!propertyExists && hasOwn(propertySetting, 'default')) {
			const settings = propertySetting as OptionProperty<any>

			properties[propertyKey] = isFunction(settings.default)
				? settings.default.apply(null)
				: settings.default

			propertyExists = true
			propertyValue = properties[propertyKey]
		}

		/**
		 * If property exists, check property types form
		 * setting
		 */
		if (propertyExists) {
			const types = isArray(propertySetting)
				? propertySetting
				: isObject(propertySetting)
				? (propertySetting as OptionProperty<any>).type
				: (propertySetting as OptionPropertyTypes<any>)

			if (!isEqualConstructor(propertyValue, types))
				throw `property "${propertyKey}" is not "${propertySetting}" type`
		}

		/**
		 * If setting have custom validator, call this function
		 */
		if (
			hasOwn(propertySetting, 'validator') &&
			isFunction(propertySetting['validator'])
		) {
			if (!propertySetting['validator'].call(null, propertyValue))
				throw `property "${propertyKey}" did not pass the validator. Value: ${propertyValue}`
		}
	}

	return properties as Required<Properties>
}
