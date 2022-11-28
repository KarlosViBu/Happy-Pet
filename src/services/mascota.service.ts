import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Mascota} from '../models';
import {MascotaRepository} from './../repositories/mascota.repository';

@injectable({scope: BindingScope.TRANSIENT})
export class MascotaService {
  constructor(
    @repository(MascotaRepository)
    public mascotaRepository: MascotaRepository,
  ) {}

  getMascotasAprobadas(): Promise<Mascota[]> {
    let mascotasActivas = this.mascotaRepository.find({
      where: {estado: 'Aprobado'},
    });
    return mascotasActivas;
  }

  // include: ['usuarios', 'planes'],
  getMascotaxEstado = (kestado: string) => {
    let mascotaxEstado = this.mascotaRepository.find({
      where: {estado: kestado},
    });
    return mascotaxEstado;
  };
}
