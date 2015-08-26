#! /usr/bin/env node

import cne from "./"
import pkg from "../package"
import yargs from "yargs"
import communes from "./communes"
import distributors from "./distributors"
import fuelTypes from "./fuel-types"

const args = yargs
  .usage("Get lower fuel price from cne api\n\nUsage: cne")
  .example("cne -f gasolina_95 -c Santiago")
  .example("cne -f gasolina_95 -c Santiago --ldt COPEC")
  .demand(["f"])
  .default("f", "gasolina_95")
  .alias("f", "fuel-type").describe("f", "Choose a fuel type")
  .alias("c", "commune").describe("c", "Choose a commune")
  .alias("dt", "distributor").describe("dt", "Choose a distributor")
  .alias("lf", "list-fuel-types").describe("lf", "List all fuel types").boolean("lf")
  .alias("lc", "list-communes").describe("lc", "List all communes").boolean("lc")
  .alias("ldt", "list-distributors").describe("ldt", "List all distributors").boolean("ldt")
  .version(pkg.version, "version").alias("version", "V")
  .help("help").alias("help", "h")

const options = {
  fuelType: args.argv.f,
  commune: args.argv.c,
  distributor: args.argv.dt
}

if (args.argv.lf) {
  console.log(fuelTypes.join(", "))
} else if (args.argv.lc) {
  console.log(communes.join(", "))
} else if (args.argv.ldt) {
  console.log(distributors.join(", "))
} else {
  cne(options)
    .then((data) => {
      console.log(data)
    })
    .catch((err) => console.log("An error has occurred"))
}
