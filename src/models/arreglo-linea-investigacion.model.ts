import {Model, model, property} from '@loopback/repository';

@model()
export class ArregloLineaInvestigacion extends Model {
  @property({
    type: 'array',
    itemType: 'number',
    required: true,
  })
  lineas_investigacion: number[];


  constructor(data?: Partial<ArregloLineaInvestigacion>) {
    super(data);
  }
}

export interface ArregloLineaInvestigacionRelations {
  // describe navigational properties here
}

export type ArregloLineaInvestigacionWithRelations = ArregloLineaInvestigacion & ArregloLineaInvestigacionRelations;
