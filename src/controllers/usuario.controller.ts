import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Llaves} from '../config/llaves';
import {Credenciales, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
import {AutenticacionService} from '../services';
const fetch = require('node-fetch'); //importamos para acceder a urls externas

export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,

    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService,
  ) {}

  @post('/validarUsuario', {
    responses: {
      '200': {
        descripcion: 'Validar credenciales del Usuario (identificarlo)',
      },
    },
  })
  async validarUsuario(@requestBody() credenciales: Credenciales) {
    let usuva = await this.servicioAutenticacion.IdentificarUsuario(
      credenciales.usuario,
      credenciales.contrasena,
    );
    if (usuva) {
      let token = this.servicioAutenticacion.GenerarTokenJWT(usuva);
      return {
        datos: {
          id: usuva.id,
          nombre: usuva.nombre,
          correo: usuva.correo,
        },
        tk: token,
      };
    } else {
      throw new HttpErrors[401]('Datos inválidos'); // usuario NO autorizado
    }
  }

  @post('/usuarios')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ): Promise<Usuario> {
    let clave = this.servicioAutenticacion.GenerarClave();
    let claveCifrada = this.servicioAutenticacion.CifrarClave(clave);
    usuario.contrasena = claveCifrada; //asignada a la usuario (en ese campo de la base de datos es ilegible)
    let u = await this.usuarioRepository.create(usuario);

    //NOTIFICAR AL USUARIO:
    let destino = usuario.correo;
    let asunto = 'Registro exitoso en nuestra aplicación ';
    //let contenido = `Hola ${usuario.nombres}, su nombre de usuario es: ${usuario.correo} y su contraseña es: ${usuarios.clave}`;
    let contenido = `Hola ${usuario.nombre}, su nombre de usuario es: ${usuario.correo} y su contraseña es: ${clave}`; ////como lo modifiqué, si muestra el texto plano, pero con esto que tenía el profe Jefferson ${usuario.clave}` sería para mostrar la clave cifrada que no sirve;//los string templates(``) son usados aquí para dinamizar. Se hace login con el correo
    //fetch(`http://127.0.0.1:5000/envio-correo?correo_destino=${destino}&asunto=${asunto}&contenido=${contenido}`)//el ? se usa para el get. & se usa para agregar más parámetros a la petición
    fetch(
      `${Llaves.urlServicioNotificaciones}/kemail?correod=${destino}&asunto=${asunto}&contenido=${contenido}`,
    ).then((data: any) => {
      //any es un tipo genérico de datos en typescript
      console.log(data); //controlando: para darse cuenta que fue enviado o no
    }); //.then usado para obtener la respuesta del fetch
    return u; //retorna la usuario que fue creada
    //YA CON LO ANTERIOR SE CORRE LA APP (ejecutando npm start en la terminal) y luego probando la funcionalidad con Postman
  }

  @get('usuarios-xRol/{rol}')
  @response(200, {
    description: 'Genera el listado de usuarios segun el rol dado',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async usuariosxRol(@param.path.string('rol') krol: string) {
    return this.servicioAutenticacion.getUsuarioxRol(krol);
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Usuario) where?: Where<Usuario>): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'})
    filter?: FilterExcludingWhere<Usuario>,
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }
}
