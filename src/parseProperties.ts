import { OptionSettings } from '@types'
import { isArray, isObject } from './utils'
import { parsePropertiesArray } from './parsePropertiesArray'
import { parsePropertiesObject } from './parsePropertiesObject'

export const parseProperties = <Properties>(
	properties: Properties,
	propertiesSettings: OptionSettings<Properties>
): Required<Properties> => {
	if (isArray(propertiesSettings)) {
		// @ts-ignore
		return parsePropertiesArray(properties, propertiesSettings)
	}

	if (isObject(propertiesSettings)) {
		return parsePropertiesObject(properties, propertiesSettings)
	}

	throw new Error('Settings is not array or object.')
}
