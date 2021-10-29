import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {UsuarioJurado, UsuarioJuradoRelations} from '../models';

export class UsuarioJuradoRepository extends DefaultCrudRepository<
  UsuarioJurado,
  typeof UsuarioJurado.prototype.id,
  UsuarioJuradoRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(UsuarioJurado, dataSource);
  }
}
