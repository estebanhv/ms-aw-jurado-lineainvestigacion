import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Configuracion} from '../key/configuracion';
import {Jurado, NotificacionCorreo} from '../models';
import {JuradoRepository, UsuarioJuradoRepository} from '../repositories';
import {AdministradorClavesService, NotificacionesService} from '../services';
@authenticate("admin","jury")
export class JuradoController {
  constructor(
    @repository(JuradoRepository)
    public juradoRepository: JuradoRepository,
    @repository(UsuarioJuradoRepository)
    public usuarioJuradoRepository: UsuarioJuradoRepository,
    @service(AdministradorClavesService)
    public servicioClaves: AdministradorClavesService,
    @service(NotificacionesService)
    private notificacionesService: NotificacionesService
  ) { }

  @post('/jurados')
  @response(200, {
    description: 'Jurado model instance',
    content: {'application/json': {schema: getModelSchemaRef(Jurado)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Jurado, {
            title: 'NewJurado',
            exclude: ['id'],
          }),
        },
      },
    })
    jurado: Omit<Jurado, 'id'>,
  ): Promise<Boolean> {

    let existe = await this.juradoRepository.findOne({
      where: {
        correo: jurado.correo

      }
    })

    if (!existe) {
      let juradoListo = await this.juradoRepository.create(jurado);

      if (juradoListo) {
        let clave = this.servicioClaves.CrearClaveAleatoria()
        console.log(clave)
        //Enviar clave por correo electronico
        let claveCifrada = this.servicioClaves.CifrarTexto(clave)

        let usuarioj = await this.usuarioJuradoRepository.create({
          usuario: jurado.correo,
          clave: claveCifrada,
          id_jurado: juradoListo.getId(),
          rolJurado: 123
        })
        if (usuarioj) {
          let datos = new NotificacionCorreo()
          datos.destinatario = usuarioj.usuario
          datos.asunto = Configuracion.asuntoCreacionUsuario
          datos.mensaje = `Hola ${juradoListo.nombre} <br/>${Configuracion.mensajeCreacionUsuario} ${clave}`
          this.notificacionesService.EnviarCorreo(datos)
          //Enviar clave por correo electronico
        }
      }
    } else {
      return false
    }

    //Enviar clave por correo electronico y usuario
    return true
  }

  @get('/jurados/count')
  @response(200, {
    description: 'Jurado model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Jurado) where?: Where<Jurado>,
  ): Promise<Count> {
    return this.juradoRepository.count(where);
  }

  @get('/jurados')
  @response(200, {
    description: 'Array of Jurado model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Jurado, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Jurado) filter?: Filter<Jurado>,
  ): Promise<Jurado[]> {
    return this.juradoRepository.find(filter);
  }

  @patch('/jurados')
  @response(200, {
    description: 'Jurado PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Jurado, {partial: true}),
        },
      },
    })
    jurado: Jurado,
    @param.where(Jurado) where?: Where<Jurado>,
  ): Promise<Count> {
    return this.juradoRepository.updateAll(jurado, where);
  }

  @get('/jurados/{id}')
  @response(200, {
    description: 'Jurado model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Jurado, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Jurado, {exclude: 'where'}) filter?: FilterExcludingWhere<Jurado>
  ): Promise<Jurado> {
    return this.juradoRepository.findById(id, filter);
  }

  @patch('/jurados/{id}')
  @response(204, {
    description: 'Jurado PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Jurado, {partial: true}),
        },
      },
    })
    jurado: Jurado,
  ): Promise<void> {
    await this.juradoRepository.updateById(id, jurado);
  }

  @put('/jurados/{id}')
  @response(204, {
    description: 'Jurado PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() jurado: Jurado,
  ): Promise<void> {
    await this.juradoRepository.replaceById(id, jurado);
  }

  @del('/jurados/{id}')
  @response(204, {
    description: 'Jurado DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.juradoRepository.deleteById(id);
  }
}
