import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Plan} from './plan.model';
import {Usuario} from './usuario.model';

@model()
export class Mascota extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  especie: string;

  @property({
    type: 'string',
    required: true,
  })
  raza: string;

  @property({
    type: 'string',
    required: true,
  })
  color: string;

  @property({
    type: 'string',
    required: true,
  })
  sexo: string;

  @property({
    type: 'date',
    required: true,
  })
  fecha_nacimiento: string;

  @property({
    type: 'string',
    required: true,
  })
  imagen: string;

  @belongsTo(() => Plan)
  planId: string;

  @belongsTo(() => Usuario)
  usuarioId: string;

  constructor(data?: Partial<Mascota>) {
    super(data);
  }
}

export interface MascotaRelations {
  // describe navigational properties here
}

export type MascotaWithRelations = Mascota & MascotaRelations;
