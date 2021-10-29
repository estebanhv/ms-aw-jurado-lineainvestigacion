import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {JuradoLineaInvestigacion} from './jurado-linea-investigacion.model';
import {LineaInvestigacion} from './linea-investigacion.model';
import {UsuarioJurado} from './usuario-jurado.model';

@model()
export class Jurado extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

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
  correo: string;

  @property({
    type: 'string',
    required: true,
  })
  entidad: string;

  @property({
    type: 'string',
    required: true,
  })
  telefono: string;

  @hasOne(() => UsuarioJurado, {keyTo: 'id_jurado'})
  usuarioJurado: UsuarioJurado;

  @hasMany(() => LineaInvestigacion, {through: {model: () => JuradoLineaInvestigacion, keyFrom: 'id_Jurado', keyTo: 'id_lineainvestigacion'}})
  lineaInvestigacions: LineaInvestigacion[];

  constructor(data?: Partial<Jurado>) {
    super(data);
  }
}

export interface JuradoRelations {
  // describe navigational properties here
}

export type JuradoWithRelations = Jurado & JuradoRelations;
