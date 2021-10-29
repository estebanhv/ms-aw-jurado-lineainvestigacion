import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Jurado,
  UsuarioJurado,
} from '../models';
import {JuradoRepository} from '../repositories';

export class JuradoUsuarioJuradoController {
  constructor(
    @repository(JuradoRepository) protected juradoRepository: JuradoRepository,
  ) { }

  @get('/jurados/{id}/usuario-jurado', {
    responses: {
      '200': {
        description: 'Jurado has one UsuarioJurado',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UsuarioJurado),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<UsuarioJurado>,
  ): Promise<UsuarioJurado> {
    return this.juradoRepository.usuarioJurado(id).get(filter);
  }

  @post('/jurados/{id}/usuario-jurado', {
    responses: {
      '200': {
        description: 'Jurado model instance',
        content: {'application/json': {schema: getModelSchemaRef(UsuarioJurado)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Jurado.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioJurado, {
            title: 'NewUsuarioJuradoInJurado',
            exclude: ['id'],
            optional: ['id_jurado']
          }),
        },
      },
    }) usuarioJurado: Omit<UsuarioJurado, 'id'>,
  ): Promise<UsuarioJurado> {
    return this.juradoRepository.usuarioJurado(id).create(usuarioJurado);
  }

  @patch('/jurados/{id}/usuario-jurado', {
    responses: {
      '200': {
        description: 'Jurado.UsuarioJurado PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioJurado, {partial: true}),
        },
      },
    })
    usuarioJurado: Partial<UsuarioJurado>,
    @param.query.object('where', getWhereSchemaFor(UsuarioJurado)) where?: Where<UsuarioJurado>,
  ): Promise<Count> {
    return this.juradoRepository.usuarioJurado(id).patch(usuarioJurado, where);
  }

  @del('/jurados/{id}/usuario-jurado', {
    responses: {
      '200': {
        description: 'Jurado.UsuarioJurado DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(UsuarioJurado)) where?: Where<UsuarioJurado>,
  ): Promise<Count> {
    return this.juradoRepository.usuarioJurado(id).delete(where);
  }
}
