"use strict"

import cne from "../"
import assert from "assert"

describe("Cne", () => {
  describe("is a object", () => {
    it("should return a object", () => {
      const options = {fuelType: "gasolina_95"}
      cne.get(options).then((data) => {
        assert.isObject(data)
      }).catch((err) => {
        assert.isNull(err)
      })
    })
  })
})
