import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CambioClave, UsuarioJurado} from '../models';
import {UsuarioJuradoRepository} from '../repositories';
const generator = require('generate-password');

var CryptoJS = require("crypto-js");
@injectable({scope: BindingScope.TRANSIENT})
export class AdministradorClavesService {
  constructor(@repository(UsuarioJuradoRepository)
  public usuarioJuradoRepository: UsuarioJuradoRepository) {}

  /*
   * Add service methods here
   */

  async CambiarClave(credencialesClave: CambioClave): Promise<UsuarioJurado|null> {
    let usuario = await this.usuarioJuradoRepository.findOne({
      where: {
        id: credencialesClave.id_usuario,
        clave: credencialesClave.clave_actual
      }
    })
    if (usuario) {
      usuario.clave = credencialesClave.nueva_clave
      await this.usuarioJuradoRepository.updateById(credencialesClave.id_usuario, usuario);
      //Generar token y añadirlo a la respuesta
      return usuario
    } else {
      return null
    }
  }

  async RecuperarClave(correo: string): Promise<UsuarioJurado | null> {
    let usuario = await this.usuarioJuradoRepository.findOne({
      where: {

        usuario: correo
      }
    })
    if (usuario) {
      let clave = this.CrearClaveAleatoria()
      usuario.clave = this.CifrarTexto(clave)
      await this.usuarioJuradoRepository.updateById(usuario.id, usuario);
      usuario.clave=""
      return usuario
    } else {
      return null
    }
  }

  CrearClaveAleatoria(): string{

    let password = generator.generate({
      length: 8,
      numbers: true,
      uppercase: true
    });
    return password
  }

  CifrarTexto(texto: string){
    let textoCifrado =  CryptoJS.MD5(texto).toString()
    return textoCifrado

  }
}
