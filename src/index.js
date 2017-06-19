'use strict'

const http = require('http')
const fuelTypes = require('./fuel-types')
const communes = require('./communes')
const distributors = require('./distributors')
const pkg = require('../package.json')

const request = token => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.cne.cl',
      port: 80,
      path: `/api/listaInformacion/${token}`,
      method: 'GET'
    }
    const req = http.request(options, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`Request Failed. Status Code: ${res.statusCode}`))
      }
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', chunk => {
        rawData += chunk
      })
      res.on('end', () => {
        try {
          resolve(JSON.parse(rawData))
        } catch (err) {
          reject(err)
        }
      })
    })
    req.on('error', reject)
    req.end()
  })
}

const get = options => {
  options = options || {}
  const commune = options.commune ? options.commune.toLowerCase() : null
  const dist = options.distributor ? options.distributor.toLowerCase() : null
  const fuelType = options.fuelType ? options.fuelType.toLowerCase() : null
  const token = options.token || pkg.token

  return request(token).then(res => {
    if (res.estado !== 'OK') return {}
    let data = res.data
    let result = {}

    if (commune) {
      data = data.filter(x => x.nombre_comuna.toLowerCase() === commune)
    }
    if (dist) {
      data = data.filter(x => x.nombre_distribuidor.toLowerCase() === dist)
    }
    if (fuelTypes.indexOf(fuelType) > -1) {
      data = data.filter(x => x.precio_por_combustible[fuelType])
      if (data.length) {
        result = data.reduce((x, y) => {
          Math.min(
            x.precio_por_combustible[fuelType],
            y.precio_por_combustible[fuelType]
          )
          return y
        })
      }
    }
    return result
  })
}

module.exports = {
  get: get,
  fuelTypes: fuelTypes,
  communes: communes,
  distributors: distributors
}
