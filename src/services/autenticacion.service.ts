import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Llaves} from '../config/llaves';
import {UsuarioRepository} from '../repositories';
import {Usuario} from './../models/usuario.model';
const generador = require('password-generator');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
  ) {}

  GenerarClave = () => generador(8, false);
  CifrarClave = (clave: string) => cryptoJS.MD5(clave).toString();

  IdentificarUsuario(usuario: string, clave: string) {
    try {
      let usu = this.usuarioRepository.findOne({
        where: {correo: usuario, contrasena: clave},
      });
      if (usu) {
        //si existe
        return usu; //se retorna el usuario
      }
      return false; //no hay nada
    } catch (error) {
      return false; //no hay nada
    }
  }

  // Json Web Token
  GenerarTokenJWT(usuario: Usuario) {
    let token = jwt.sign(
      {
        data: {
          id: usuario.id,
          correo: usuario.correo,
          nombre: usuario.nombre + ' ' + usuario.apellido,
          rol: usuario.rol,
        },
      },
      Llaves.claveJWT,
    ); //da esa llave (única que va a acceder a la info )
    return token;
  }

  ValidarTokenJWT(token: string) {
    try {
      let datos = jwt.verify(token, Llaves.claveJWT); //verifico token contra una llave
      return datos; //retorno los datos obtenidos
    } catch (error) {
      return false;
    }
  }

  getUsuarioxRol = (krol: string) => {
    let usuariosxRol = this.usuarioRepository.find({
      where: {rol: krol},
    });
    return usuariosxRol;
  };
}
