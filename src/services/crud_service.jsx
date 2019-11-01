/* global fetch */
export default {
  getList,
  create,
  read,
  update,
  delete: deleteObj
}

function getList (baseUrl, offset, max, filters, sorter) {
  let url = `${baseUrl}?offset=${offset}`
  if (max) url += `&max=${max}`

  url += compileRestrictions(filters)
  url += compileRestrictions(sorter)

  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
}

function create (baseUrl, data) {
  return fetch(baseUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(data)
  })
}

function read (baseUrl, id) {
  let url = `${baseUrl}/${id}`
  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
}

function update (baseUrl, id, data) {
  let url = `${baseUrl}/${id}`
  return fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(data)
  })
}

function deleteObj (baseUrl, id) {
  let url = `${baseUrl}/${id}`
  return fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
}

function compileRestrictions (restrictions) {
  if (!restrictions) return ''
  let params = Object.entries(restrictions)
    .filter(param => param)
    .map(entrie => entrie.join('='))
    .join('&')

  return params === '' ? '' : `&${params}`
}
