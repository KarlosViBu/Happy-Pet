import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongatlasDataSource} from '../datasources';
import {Mascota, MascotaRelations, Plan, Usuario} from '../models';
import {PlanRepository} from './plan.repository';
import {UsuarioRepository} from './usuario.repository';

export class MascotaRepository extends DefaultCrudRepository<
  Mascota,
  typeof Mascota.prototype.id,
  MascotaRelations
> {

  public readonly plan: BelongsToAccessor<Plan, typeof Mascota.prototype.id>;

  public readonly usuario: BelongsToAccessor<Usuario, typeof Mascota.prototype.id>;

  constructor(
    @inject('datasources.mongatlas') dataSource: MongatlasDataSource, @repository.getter('PlanRepository') protected planRepositoryGetter: Getter<PlanRepository>, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>,
  ) {
    super(Mascota, dataSource);
    this.usuario = this.createBelongsToAccessorFor('usuario', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuario', this.usuario.inclusionResolver);
    this.plan = this.createBelongsToAccessorFor('plan', planRepositoryGetter,);
    this.registerInclusionResolver('plan', this.plan.inclusionResolver);
  }
}
