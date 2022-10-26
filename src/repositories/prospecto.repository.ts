import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongatlasDataSource} from '../datasources';
import {Prospecto, ProspectoRelations} from '../models';

export class ProspectoRepository extends DefaultCrudRepository<
  Prospecto,
  typeof Prospecto.prototype.id,
  ProspectoRelations
> {
  constructor(
    @inject('datasources.mongatlas') dataSource: MongatlasDataSource,
  ) {
    super(Prospecto, dataSource);
  }
}
