import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    foreignKeys: {
      fk_juradoU: {
        name: 'fk_juradoU',
        entity: 'Jurado',
        entityKey: 'id',
        foreignKey: 'id_jurado',
      }
    },
  },
})
export class UsuarioJurado extends Entity {
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
  usuario: string;

  @property({
    type: 'number',
  })
  rolJurado?: number;



  @property({
    type: 'string',
    required: false,
  })
  clave?: string;

  @property({
    type: 'number',
  })
  id_jurado?: number;

  constructor(data?: Partial<UsuarioJurado>) {
    super(data);
  }
}

export interface UsuarioJuradoRelations {
  // describe navigational properties here
}

export type UsuarioJuradoWithRelations = UsuarioJurado & UsuarioJuradoRelations;
