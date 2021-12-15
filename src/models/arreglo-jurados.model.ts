import {Model, model, property} from '@loopback/repository';
import {Jurado} from '.';

@model()
export class ArregloJurados extends Model {
  @property({
    type: 'array',
    itemType: Jurado,
    required: true,
  })
  jurados: Jurado[];


  constructor(data?: Partial<ArregloJurados>) {
    super(data);
  }
}

export interface ArregloJuradosRelations {
  // describe navigational properties here
}

export type ArregloJuradosWithRelations = ArregloJurados & ArregloJuradosRelations;
