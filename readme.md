# JS Options Parser

A very light-weight options parser for node or web. How props in
vue.js. Includes:

- **Checking for options existence**
- **Checking for options types**
- **Default value setter**
- **Custom validator**

## **Usage**

```
npm i @dtavern/options
```

```js
const { defineOptions } = require('@dtavern/options')

function someFunction(options) {
  defineOptions(options, {
    name: String,
    age: [String, Number],
    colors: {
      type: Array,
      required: false,
      default: () => ['red', 'blue'],
      validator: (value) => value.length > 0,
    },
  })

  console.log(options)
}

someFunction({
  name: 'Rocket',
  age: '17',
})

/* Output:
{
  name: 'Rocket',
  age: '17',
  colors: ['red', 'blue']
}
*/
```

How you can see, `defineOptions` **overwrite original object**.
If you need clone object, use spread operator or set clone option
in config.

# Documentation

## **Table of Contents**

1. [Set plugin settings as array](#settings-as-array)
1. [Set plugin settings as object](#settings-as-object)
1. [Set options settings as object](#options-settings-as-object)
    1. [Option setting API](#option-setting-api)
        1. [type](#type)
        1. [required](#required) 
        1. [default](#default)
        1. [validator](#validator)
    1. [Checkers execution order](#checkers-execution-order)
        1. [Exists checker](#1-exists-checker)
        1. [Default setter](#2-default-setter)
        1. [Type option checker](#3-type-option-checker)
        1. [Type checker](#4-type-checker)
        1. [Validator](#5-validator)
1. [Config API](#config-api)
   1. [mode](#mode)
   1. [clone](#clone)
1. [Using typescript](#using-typescript)

## **Settings as array**

If you need to use only existing checkers, you can use settings
as an array.

Example:

```js
const { defineOptions } = require('@dtavern/options')

// throw error
defineOptions({}, ['name'])

// throw error
defineOptions({ name: 'any type' }, [])

// Returns { name: 'any type' }
defineOptions({ name: 'any type' }, ['name'])
```

## **Settings as object**

If you need to use checkers of existing and typing, you can
use settings as an object.

Example:

```js
const { defineOptions } = require('@dtavern/options')

// Returns { name: 'any type' }
defineOptions({ name: 'any type' }, { name: String })

// Returns { age: 17 }
defineOptions({ age: 17 }, { age: [String, Number] })

// Returns { _null: 17 } - skip type checker
defineOptions({ _null: 17 }, { _null: null })
```

You need to use **classes** as the value of settings.

## **Options settings as object**

if you need more fine tuning you can use option settings as
object.

Example:

```js
const { defineOptions } = require('@dtavern/options')

// Returns { name: 'hello' }
defineOptions(
  {},
  {
    name: {
      type: String,
      required: false,
      default: 'hello',
      validator: (value) => value.length > 0,
    },
  }
)
```

### **Option setting API**

#### **type**

Type: `class` | `array` of Classes | `null`\
Default: `null`

Use for checking property value on the class constructor.

Note: If the type is `null` - this property will skip **only**
type checking. But if your options have no this property -
this will result in an error. To prevent it use the `required`
option.

```js
name: {} // skip type checker

name: {
  type: String,
}

age: {
  type: [String, Number],
}
```

You can use any classes.

#### **required**

Type: `boolean`\
Default: `true`

If required is false and properties have no needs key,
throw error will not happen

```js
root: {
  required: false
}
```

#### **default**

Type: `function` | `any`\
Arguments: `null`\
Returns: `any`\
Default: `null`

If required is false and properties have no needs key, you
can set a default value. It can be both primitives and objects.

Note: for objects, I recommend using the function. Also,
if the default value will not be the correct type or if
the validator doesn't miss it, this will result in an error.

```js
color: {
  required: false,
  default: 'red'
}

colors: {
  required: false,
  default: () => ['red', 'blue']
}
```

#### **validator**

Type: `function`\
Arguments: `(value: any)`\
Returns: `boolean`\
Default: `null`

If you need to check property value to allowable values,
you can use a custom validator.

```js
colors: {
  required: false,
  default: () => 'red',
  validator: (value) => ['red', 'blue'].includes(value)
}
```

### **Checkers execution order**

If you use settings as object, script complicates option checking.

#### **1. Exists checker**

The script checks if a property does exist in options and
is it necessary.

If the property does not exist but the setting `required`
is `false` verification will be completed successfully.
Otherwise, it will result in an error.

#### **2. Default setter**

The script checks if a property does not exist in options
and has its default value.

If the property does not exist, the script set the default
value if it exists.

#### **3. Type option checker**

Before the type checker, the script checks if the type input
is correct in the setting. If the type is `null` - skip,
if another type - check.

#### **4. Type checker**

The script checks the property value on the correct type if
the type does not equal to `null` and the property does exist
in options.

#### **5. Validator**

If the validator does exist in options, the script calls it.
If the validator returns `true` - the script moves to the
next property or ends work. But if returns `false` - this
will result in an error

## **Config API**

### **mode**

Type: `strict`, `log`, `disabled`\
Default: `strict`

Mode option needs for changes the way errors are output.

- **strict** - error will be throw script
- **log** - error will be output to console
- **disabled** - error will be ignored

Example:

```js
// Error without throw script
defineOptions({}, ['name'], { mode: 'log' })
```

### **clone**

Type: `boolean`\
Default: `false`

Clone option needed if you don't want to change the original
options object.

```js
const originalObject = {}

const newObject = defineOptions(
  originalObject,
  { name: { required: false, default: 'Dmitry' } },
  { clone: true }
)

console.log(originalObject) // Returns: {}
console.log(newObject) // Returns: { name: 'Dmitry' }
```

## **Using typescript**

If you using typescript, you can use generic type in plugin:

```ts
defineOptions<Options, Return>(options: Options, settings): Return;
```

Example:

```ts
import { defineOptions } from '@dtavern/options'

interface Options {
  name?: string
}

function someFunction(options: Options = {}) {
  // Returns { name: 'hello' }
  const newOptions = defineOptions<Options>(options, {
    name: {
      type: String,
      required: false,
      default: 'Dmitry',
    },
  })

  // Valid
  console.log(newOptions.name)
}

someFunction()
```

# **License**

MIT - check repo files

Copyright (c) 2022-present, Dmitry Tavern
