const cne = require('cne');

const options = {
  fuelType: 'gasolina_95',
  commune: 'Santiago',
  distributor: 'COPEC'
};

const data = await cne.get(options)
