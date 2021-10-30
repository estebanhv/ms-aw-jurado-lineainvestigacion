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
  requestBody,
  response
} from '@loopback/rest';
import {
  Credenciales, Jurado,
  UsuarioJurado
} from '../models';
import {JuradoRepository, UsuarioJuradoRepository} from '../repositories';

export class JuradoUsuarioJuradoController {
  constructor(
    @repository(JuradoRepository) protected juradoRepository: JuradoRepository,
    @repository(UsuarioJuradoRepository) protected usuarioJuradoRepository:UsuarioJuradoRepository
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

  @get('/usuario-jurados')
  @response(200, {
    description: 'Array of Jurado model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UsuarioJurado, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UsuarioJurado) filter?: Filter<UsuarioJurado>,
  ): Promise<UsuarioJurado[]> {
    return this.usuarioJuradoRepository.find(filter);
  }
///////

@post('/reconocer-usuario')
@response(200, {
  description: 'Reconocer los usuarios',
  content: {'application/json': {schema: getModelSchemaRef(Credenciales)}},
})
async reconocerUsuario(
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Credenciales, {
          title: 'Identificar Usuario'
        }),
      },
    },
  })
  credenciales: Credenciales,
): Promise<object | null> {

  let usuario = await this.usuarioJuradoRepository.findOne({
    where: {
      usuario: credenciales.usuario,
      clave: credenciales.clave
    }
  })


  if (usuario) {
    //Generar token y añadirlo a la respuesta
    let jurado = await this.juradoRepository.findOne({
      where:{
        id:  usuario?.id_jurado,

      }
    })

    return jurado
  }


  return {respuesta :"Datos incorrectos"}




}







}
