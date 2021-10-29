import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  ArregloLineaInvestigacion, Jurado,
  JuradoLineaInvestigacion,
  LineaInvestigacion
} from '../models';
import {JuradoLineaInvestigacionRepository, JuradoRepository} from '../repositories';

export class JuradoLineaInvestigacionController {
  constructor(
    @repository(JuradoRepository) protected juradoRepository: JuradoRepository,
    @repository(JuradoLineaInvestigacionRepository) protected JuradoLineaInvestigacionRepository: JuradoLineaInvestigacionRepository,
  ) { }

  @get('/jurados/{id}/linea-investigacions', {
    responses: {
      '200': {
        description: 'Array of Jurado has many LineaInvestigacion through JuradoLineaInvestigacion',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LineaInvestigacion)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<LineaInvestigacion>,
  ): Promise<LineaInvestigacion[]> {
    return this.juradoRepository.lineaInvestigacions(id).find(filter);
  }

  @post('/jurados/{id}/linea-investigacions', {
    responses: {
      '200': {
        description: 'create a LineaInvestigacion model instance',
        content: {'application/json': {schema: getModelSchemaRef(LineaInvestigacion)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Jurado.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LineaInvestigacion, {
            title: 'NewLineaInvestigacionInJurado',
            exclude: ['id'],
          }),
        },
      },
    }) lineaInvestigacion: Omit<LineaInvestigacion, 'id'>,
  ): Promise<LineaInvestigacion> {
    return this.juradoRepository.lineaInvestigacions(id).create(lineaInvestigacion);
  }

  @patch('/jurados/{id}/linea-investigacions', {
    responses: {
      '200': {
        description: 'Jurado.LineaInvestigacion PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LineaInvestigacion, {partial: true}),
        },
      },
    })
    lineaInvestigacion: Partial<LineaInvestigacion>,
    @param.query.object('where', getWhereSchemaFor(LineaInvestigacion)) where?: Where<LineaInvestigacion>,
  ): Promise<Count> {
    return this.juradoRepository.lineaInvestigacions(id).patch(lineaInvestigacion, where);
  }

  @del('/jurados/{id}/linea-investigacions', {
    responses: {
      '200': {
        description: 'Jurado.LineaInvestigacion DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(LineaInvestigacion)) where?: Where<LineaInvestigacion>,
  ): Promise<Count> {
    return this.juradoRepository.lineaInvestigacions(id).delete(where);
  }



  //////////////
@post('/jurados-area-investigacions', {
  responses: {
    '200': {
      description: 'create a AreaInvestigacion model instance',
      content: {'application/json': {schema: getModelSchemaRef(JuradoLineaInvestigacion)}},
    },
  },
})
async createRelation(

  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(JuradoLineaInvestigacion, {
          title: 'NewAreaInvestigacionInJurado',
          exclude: ['id'],
        }),
      },
    },
  }) datos: Omit<JuradoLineaInvestigacion, 'id'>,
): Promise<JuradoLineaInvestigacion | null> {
  let registro = await this.JuradoLineaInvestigacionRepository.create(datos)
    return registro


}
//////////////
@post('/relacionar-jurados-linea-investigacions', {
  responses: {
    '200': {
      description: 'create a AreaInvestigacion model instance',
      content: {'application/json': {schema: getModelSchemaRef(JuradoLineaInvestigacion)}},
    },
  },
})
async createRelations(
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(ArregloLineaInvestigacion,{}),
      },
    },
  }) datos:ArregloLineaInvestigacion,
  @param.path.number('id') id_Jurado: typeof Jurado.prototype.id

): Promise<Boolean> {

  if (datos.lineas_investigacion.length>0) {

    datos.lineas_investigacion.forEach((id_linea:number)=>{
      this.JuradoLineaInvestigacionRepository.create({
        id_Jurado: id_Jurado,
        id_lineainvestigacion: id_linea
      })
    })
    return true
  }
    return false
}
}
