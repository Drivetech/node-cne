'use strict';

import fuelTypes from './fuel-types';
import communes from './communes';
import distributors from './distributors';
import Q from 'q';
import rp from 'request-promise';
import pkg from '../package.json';

const get = (options={}, callback) => {
  const commune = options.commune ? options.commune.toLowerCase() : null;
  const dist = options.distributor ? options.distributor.toLowerCase() : null;
  const fuelType = options.fuelType ? options.fuelType.toLowerCase() : null;
  const token = options.token || pkg.token;
  const deferred = Q.defer();

  const rpOptions = {
    url: `http://api.cne.cl/api/listaInformacion/${token}`,
    json: true
  };

  rp(rpOptions).then(res => {
    if (res.estado !== 'OK') deferred.resolve({});
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
    deferred.resolve(result);
  }).catch(deferred.reject);

  deferred.promise.nodeify(callback);

  return deferred.promise;
};

module.exports = {
  get: get,
  fuelTypes: fuelTypes,
  communes: communes,
  distributors: distributors
};
