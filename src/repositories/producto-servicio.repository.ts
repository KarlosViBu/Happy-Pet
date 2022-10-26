import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongatlasDataSource} from '../datasources';
import {ProductoServicio, ProductoServicioRelations} from '../models';

export class ProductoServicioRepository extends DefaultCrudRepository<
  ProductoServicio,
  typeof ProductoServicio.prototype.id,
  ProductoServicioRelations
> {
  constructor(
    @inject('datasources.mongatlas') dataSource: MongatlasDataSource,
  ) {
    super(ProductoServicio, dataSource);
  }
}
