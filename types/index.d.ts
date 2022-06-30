export type OptionPropertyRequired = boolean

export type OptionPropertyConstructor<T> =
	| { (): T }
	| { new (...args: never[]): T & object }
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	| { new (...args: string[]): any }

export type OptionPropertyTypes<T> =
	| OptionPropertyConstructor<T>
	| OptionPropertyConstructor<T>[]

export type OptionPropertyDefault<T> =
	| T
	| null
	| undefined
	| (() => T | null | undefined)

export interface OptionPropertyValidator<T> {
	(value: T): boolean
}

export type OptionProperty<T> = {
	type: OptionPropertyTypes<T>
	default?: OptionPropertyDefault<T>
	required?: OptionPropertyRequired
	validator?: OptionPropertyValidator<T>
}

export type OptionProperties<Properties> = {
	[Property in keyof Properties]:
		| OptionPropertyTypes<Properties[Property]>
		| OptionProperty<Properties[Property]>
}

export type OptionSettings<Properties> =
	| (keyof Properties)[]
	| OptionProperties<Properties>

export function defineOptions<Properties>(
	properties: Properties,
	settings: OptionSettings<Properties>
): Required<Properties>
