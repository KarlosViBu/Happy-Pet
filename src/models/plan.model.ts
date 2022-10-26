import {Entity, model, property, hasMany} from '@loopback/repository';
import {Mascota} from './mascota.model';

@model()
export class Plan extends Entity {
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
  cobertura: string;

  @property({
    type: 'string',
    required: true,
  })
  categoria: string;

  @property({
    type: 'number',
    required: true,
  })
  precio: number;

  @property({
    type: 'string',
    required: true,
  })
  descripcion: string;

  @hasMany(() => Mascota)
  mascotas: Mascota[];

  constructor(data?: Partial<Plan>) {
    super(data);
  }
}

export interface PlanRelations {
  // describe navigational properties here
}

export type PlanWithRelations = Plan & PlanRelations;
