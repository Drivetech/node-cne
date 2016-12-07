'use strict';

const http = require('http');
const fuelTypes = require('./fuel-types');
const communes = require('./communes');
const distributors = require('./distributors');
const pkg = require('../package.json');

const request = url => {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`Request Failed. Status Code: ${res.statusCode}`));
      }
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(rawData));
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
};

const get = options => {
  options = options || {};
  const commune = options.commune ? options.commune.toLowerCase() : null;
  const dist = options.distributor ? options.distributor.toLowerCase() : null;
  const fuelType = options.fuelType ? options.fuelType.toLowerCase() : null;
  const token = options.token || pkg.token;
  const url = `http://api.cne.cl/api/listaInformacion/${token}`;

  return request(url).then(res => {
    if (res.estado !== 'OK') return {};
    let data = res.data;
    let result = {};

    if (commune) {
      data = data.filter(x => x.nombre_comuna.toLowerCase() === commune);
    }
    if (dist) {
      data = data.filter(x => x.nombre_distribuidor.toLowerCase() === dist);
    }
    if (fuelTypes.indexOf(fuelType) > -1) {
      data = data.filter(x => x.precio_por_combustible[fuelType]);
      if (data.length) {
        result = data.reduce((x, y) => {
          Math.min(x.precio_por_combustible[fuelType], y.precio_por_combustible[fuelType]);
          return y;
        });
      }
    }
    return result;
  });
};

module.exports = {
  get: get,
  fuelTypes: fuelTypes,
  communes: communes,
  distributors: distributors
};
