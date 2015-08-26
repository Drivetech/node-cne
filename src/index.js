"use strict"

import http from "http"
import FUEL_TYPES from "./fuel-types"

export default function cne(options={}) {
  const commune = options.commune || null
  const distributor = options.distributor || null
  const fuelType = options.fuelType || null
  const token = options.token || "6M5jaVAzPS"

  return new Promise(
    function (resolve, reject) {
      http.get(`http://api.cne.cl/api/listaInformacion/${token}`, (response) => {
        let body = ""

        response.on("data", (chunk) => body += chunk)

        response.on("end", () => {
          const res = JSON.parse(body)

          if (res.estado !== "OK") resolve([])

          let data = res.data
          let result = {}

          if (commune) {
            data = data.filter(x => x.nombre_comuna === commune)
          }
          if (distributor) {
            data = data.filter(x => x.nombre_distribuidor === distributor)
          }

          if (FUEL_TYPES.includes(fuelType)) {
            data = data.filter(x => x.precio_por_combustible[fuelType])
            result = data.reduce((x, y) => {
              Math.min(x.precio_por_combustible[fuelType], y.precio_por_combustible[fuelType])
              return y
            })
          }

          resolve(result)
        })
      }).on("error", (err) => reject(err))
    }
  )
}
