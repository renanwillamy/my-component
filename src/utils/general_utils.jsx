export {
  hasOperator,
  getOperatorAndValue,
  handleExpectedErrors,
  renameProperty,
  updatePropertyValue,
  formatMsg
}

function hasOperator (value) {
  let array = value.split(' ')
  if (array.length > 0) {
    if (array[0].includes('>') || array[0].includes('>=') || array[0].includes('<') ||
            array[0].includes('<=') || array[0].includes('=')) {
      return true
    }
  }

  return false
}
/** Obtém o operador (ex: eq, gt, ge, lt, le) e o valor retornando em um array
 * em que o operator é o primeiro valor do array e o valor é o segundo.
 */
function getOperatorAndValue (value) {
  let array = value.split(' ')
  if (array.length === 2) {
    switch (array[0]) {
      case '>':
        array[0] = 'gt'
        break
      case '<':
        array[0] = 'lt'
        break
      case '>=':
        array[0] = 'ge'
        break
      case '<=':
        array[0] = 'le'
        break
      case '=':
        array[0] = 'eq'
        break
    }
    return array
  }
  return []
}

/**
 * Dado um objeto e uma lista de conversores (name, alias),
 * verifica se o objeto possui a propriedade, caso tenha a mesma
 * tem seu valor transferido para o 'alias' e a propriedade é
 * excluida do objeto. Caso contrário, nada ocorre.
 */

function renameProperty (obj, converterList) {
  obj = { ...obj }
  converterList.forEach(converterObj => {
    let { name, alias } = converterObj
    if (obj[name]) {
      obj[alias] = obj[name]
      delete obj[name]
    }
  })
  return obj
}

/**
 * Dado um objeto e uma lista de conversores (target, converter),
 * verifica se o objeto possui a propriedade. Caso tenha, a mesma
 * tem seu valor atualizado com base no conversor. Caso contrário,
 * nada ocorre.
 */

function updatePropertyValue (obj, converterList) {
  obj = { ...obj }
  converterList.forEach(converterObj => {
    let { target, converter } = converterObj

    let value = obj[target]
    if (value) obj[target] = converter(value)
  })
  return obj
}

function handleExpectedErrors (response) {
  if (response.ok) {
    return response
  }
  switch (response.status) {
    case 401:
      window.location = '/wms/timeout.jsf'
      break
    case 404:
      window.location = '/wms/error.jsf'
      break
    default:
      return Promise.reject(response)
  }
}

function formatMsg (intl, msgId) {
  return intl.formatMessage({ id: msgId })
}
