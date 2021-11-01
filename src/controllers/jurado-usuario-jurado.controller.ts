import {service} from '@loopback/core';
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
import {Configuracion} from '../key/configuracion';
import {
  CambioClave, Credenciales, CredencialesRecuperarClave, Jurado, NotificacionCorreo, NotificacionSms, UsuarioJurado
} from '../models';
import {JuradoRepository, UsuarioJuradoRepository} from '../repositories';
import {AdministradorClavesService, NotificacionesService, SesionUsuariosService} from '../services';

export class JuradoUsuarioJuradoController {
  constructor(
    @repository(JuradoRepository) protected juradoRepository: JuradoRepository,
    @repository(UsuarioJuradoRepository) protected usuarioJuradoRepository: UsuarioJuradoRepository,
    @service(AdministradorClavesService)
    public servicioClaves: AdministradorClavesService,
    @service(NotificacionesService)
    private notificacionesService: NotificacionesService,
    @service(SesionUsuariosService)
    private servicioSesionUsuario: SesionUsuariosService,
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
    let usuario= await this.servicioSesionUsuario.IdentificarUsuario(credenciales)
    let tk=""
    if (usuario) {
      usuario.clave=""
       tk = await this.servicioSesionUsuario.GenerarToken(usuario)
      //Generar token y añadirlo a la respuesta

    }return {
      token: tk,
      usuario:usuario
    }

  }







  @post('/cambiar-clave')
  @response(200, {
    description: 'Reconocer los usuarios',
    content: {'application/json': {schema: getModelSchemaRef(CambioClave)}},
  })
  async cambiarClave(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CambioClave, {
            title: 'Cambiar clave'
          }),
        },
      },
    })
    credencialesClave: CambioClave,
  ): Promise<Boolean> {
    let usuario = await this.servicioClaves.CambiarClave(credencialesClave)
    let jura = await this.juradoRepository.findById(usuario?.id_jurado)
    if (usuario) {
      let datos = new NotificacionCorreo()
      datos.destinatario = usuario.usuario
      datos.asunto = Configuracion.asuntoCambioClave
      datos.mensaje = `Hola ${jura.nombre} <br/>${Configuracion.mensajeCambioClave}`
      this.notificacionesService.EnviarCorreo(datos)
      //Invocar al servicio de notificaciones para enviar correo al usuario

    }


    return usuario != null

  }


  @post('/recuperar-clave')
  @response(200, {
    description: 'Recuperar clave de los usuarios',
    content: {'application/json': {schema: {}}},
  })
  async recuperarClave(
    @requestBody({
      content: {
        'application/json': {
        },
      },
    })
    credenciales: CredencialesRecuperarClave,
  ): Promise<UsuarioJurado | null> {
    let usuario = await this.usuarioJuradoRepository.findOne({
      where: {

        usuario: credenciales.correo
      }
    })
    let jura = await this.juradoRepository.findById(usuario?.id_jurado)

    if (usuario) {
      let clave = this.servicioClaves.CrearClaveAleatoria()
      usuario.clave = this.servicioClaves.CifrarTexto(clave)
      await this.usuarioJuradoRepository.updateById(usuario.id, usuario);

      let datos = new NotificacionSms()
      datos.destino = jura.telefono
      datos.mensaje = Configuracion.asuntoCambioClave
      datos.mensaje = `Hola ${jura.nombre} ${Configuracion.mensajeRecuperarClave} ${clave}`



      this.notificacionesService.EnviarSms(datos)
    }


    return usuario

  }




}
