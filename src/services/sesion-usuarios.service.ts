import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Configuracion} from '../key/configuracion';
import {Credenciales, UsuarioJurado} from '../models';
import {UsuarioJuradoRepository} from '../repositories';
const fetch = require('node-fetch');
@injectable({scope: BindingScope.TRANSIENT})
export class SesionUsuariosService {
  constructor(@repository(UsuarioJuradoRepository)
  public UsuarioJuradoRepository: UsuarioJuradoRepository) {}

  /*
   * Add service methods here
   */
  async IdentificarUsuario(credenciales: Credenciales){
    let usuario = await this.UsuarioJuradoRepository.findOne({
      where: {
        usuario: credenciales.usuario,
        clave: credenciales.clave
      }
    })
    return usuario
  }

  async GenerarToken(datos: UsuarioJurado): Promise<string> {
    let url = `${Configuracion.url_crear_token}?${Configuracion.arg_nombre}=${datos.usuario}&${Configuracion.arg_id_persona}=${datos.id}&${Configuracion.arg_rol}=${datos.rolJurado}`;
    let token = "";
    await fetch(url)
      .then(async (res: any) => {
        token = await res.text()
      })
    return token;

    }
}
