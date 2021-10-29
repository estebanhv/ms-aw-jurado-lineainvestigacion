import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    foreignKeys: {
      fk_jurado: {
        name: 'fk_jurado',
        entity: 'Jurado',
        entityKey: 'id',
        foreignKey: 'id_Jurado',
      },
      fk_lineainvestigacion: {
        name: 'fk_lineainvestigacion',
        entity: 'LineaInvestigacion',
        entityKey: 'id',
        foreignKey: 'id_lineainvestigacion'
      }
    },
  },
})
export class JuradoLineaInvestigacion extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  id_Jurado?: number;

  @property({
    type: 'number',
  })
  id_lineainvestigacion?: number;

  constructor(data?: Partial<JuradoLineaInvestigacion>) {
    super(data);
  }
}

export interface JuradoLineaInvestigacionRelations {
  // describe navigational properties here
}

export type JuradoLineaInvestigacionWithRelations = JuradoLineaInvestigacion & JuradoLineaInvestigacionRelations;
