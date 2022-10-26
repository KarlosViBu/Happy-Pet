import {Entity, model, property, hasMany} from '@loopback/repository';
import {Mascota} from './mascota.model';

@model()
export class Usuario extends Entity {
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
  documento: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  apellidos: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  celular: string;

  @property({
    type: 'string',
    required: true,
  })
  direccion: string;

  @property({
    type: 'date',
    required: true,
  })
  fecha_inicio: string;

  @property({
    type: 'string',
    default: '',
  })
  imagen: string;
  
  @property({
    type: 'string',
    required: true,
  })
  rol: string;

  @property({
    type: 'number',
    default: 0,
  })
  salario: number;

  @property({
    type: 'number',
    default: 0,
  })
  comision?: number;

  @property({
    type: 'number',
    default: 0,
  })
  pagos_plan?: number;

  @property({
    type: 'number',
    default: 0,
  })
  pagos_prodservicio?: number;

  @hasMany(() => Mascota)
  mascotas: Mascota[];

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
