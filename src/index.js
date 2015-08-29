"use strict"

import http from "http"
import fuelTypes from "./fuel-types"
import communes from "./communes"
import distributors from "./distributors"
import Q from "q"

function get(options={}, callback) {
  const commune = options.commune ? options.commune.toLowerCase() : null
  const dist = options.distributor ? options.distributor.toLowerCase() : null
  const fuelType = options.fuelType ? options.fuelType.toLowerCase() : null
  const token = options.token || "6M5jaVAzPS"
  const deferred = Q.defer()

  http.get(`http://api.cne.cl/api/listaInformacion/${token}`, (response) => {
    let body = ""

    response.on("data", (chunk) => body += chunk)

    response.on("end", () => {
      const res = JSON.parse(body)

      if (res.estado !== "OK") deferred.resolve({})

      let data = res.data
      let result = {}

      if (commune) {
        data = data.filter(x => x.nombre_comuna === commune)
      }
      if (dist) {
        data = data.filter(x => x.nombre_distribuidor === dist)
      }
      if (fuelTypes.indexOf(fuelType) > -1) {
        data = data.filter(x => x.precio_por_combustible[fuelType])
        if (data.length) {
          result = data.reduce((x, y) => {
            Math.min(x.precio_por_combustible[fuelType], y.precio_por_combustible[fuelType])
            return y
          })
        }
      }
      deferred.resolve(result)
    })
  }).on("error", (err) => deferred.reject(err))
  deferred.promise.nodeify(callback)
  return deferred.promise
}

export default {
  get: get,
  fuelTypes: fuelTypes,
  communes: communes,
  distributors: distributors
}
