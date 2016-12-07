'use strict';

const expect = require('chai').expect;
const nock = require('nock');

const lib = require('../src');
const pkg = require('../package.json');

describe('cne', () => {
  describe('valid', () => {
    const options = {
      fuelType: 'gasolina_95',
      commune: 'Santiago',
      distributor: 'COPEC'
    };

    beforeEach(() => {
      nock.disableNetConnect();
      nock('http://api.cne.cl')
        .get(`/api/listaInformacion/${pkg.token}`)
        .reply(200, {
          data: [{
            id: 'ul1510101',
            fecha: '2015-07-24 20:29:23',
            direccion_calle: 'Barros Arana',
            direccion_numero: '3081',
            latitud: -18.458676528284,
            longitud: -70.288939476013,
            nombre_comuna: 'Santiago',
            nombre_distribuidor: 'COPEC',
            tienda_conveniencia: '',
            farmacia: '',
            bano_publico: '1',
            servicios_mantencion: '',
            autoservicio: '',
            horario_atencion: 'HH',
            precio_por_combustible: {
              gasolina_95: 700
            },
            metodos_de_pago: {
              efectivo: '1'
            }
          },
          {
            id: 'ul1510102',
            fecha: '2015-07-24 20:29:23',
            direccion_calle: 'Barros Arana',
            direccion_numero: '3081',
            latitud: -18.458676528284,
            longitud: -70.288939476013,
            nombre_comuna: 'Santiago',
            nombre_distribuidor: 'COPEC',
            tienda_conveniencia: '',
            farmacia: '',
            bano_publico: '1',
            servicios_mantencion: '',
            autoservicio: '',
            horario_atencion: 'HH',
            precio_por_combustible: {
              gasolina_95: 650
            },
            metodos_de_pago: {
              efectivo: '1'
            }
          }
          ],
          estado: 'OK',
          'ult. actualizacion': '13-01-2016'
        });
    });

    it('should return a balance data', done => {
      lib.get(options).then(data => {
        expect(data).to.be.a('object');
        expect(data).to.contain.any.keys([
          'id',
          'fecha',
          'direccion_calle',
          'direccion_numero',
          'latitud',
          'longitud',
          'nombre_comuna',
          'nombre_distribuidor',
          'tienda_conveniencia',
          'farmacia',
          'bano_publico',
          'servicios_mantencion',
          'autoservicio',
          'horario_atencion',
          'precio_por_combustible',
          'metodos_de_pago'
        ]);
        done();
      }).catch(err => {
        expect(err).to.be.null;
        done();
      });
    });
    it('should return a empty data', done => {
      lib.get({fuelType: 'gasolina_97'}).then(data => {
        expect(data).to.be.empty;
        done();
      }).catch(err => {
        expect(err).to.be.null;
        done();
      });
    });
    it('should return a empty data', done => {
      lib.get().then(data => {
        expect(data).to.be.empty;
        done();
      }).catch(err => {
        expect(err).to.be.null;
        done();
      });
    });
  });

  describe('invalid', () => {

    const options = {
      fuelType: 'gasolina_95',
      commune: 'Santiago',
      distributor: 'COPEC'
    };

    beforeEach(() => {
      nock.disableNetConnect();
      nock('http://api.cne.cl')
        .get(`/api/listaInformacion/${pkg.token}`)
        .reply(200, {estado: 'error'});
    });

    it('should return a empty data', done => {
      lib.get(options).then(data => {
        expect(data).to.be.empty;
        done();
      }).catch(err => {
        expect(err).to.be.null;
        done();
      });
    });
  });

  describe('error', () => {
    beforeEach(() => {
      nock.disableNetConnect();
      nock('http://api.cne.cl')
        .get(`/api/listaInformacion/${pkg.token}`)
        .reply(301);
    });

    it('should return an error', done => {
      lib.get().catch(err => {
        expect(err).to.eql(new Error('Request Failed. Status Code: 301'));
        done();
      });
    });
  });
});
