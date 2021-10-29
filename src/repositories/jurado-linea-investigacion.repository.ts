import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {JuradoLineaInvestigacion, JuradoLineaInvestigacionRelations} from '../models';

export class JuradoLineaInvestigacionRepository extends DefaultCrudRepository<
  JuradoLineaInvestigacion,
  typeof JuradoLineaInvestigacion.prototype.id,
  JuradoLineaInvestigacionRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(JuradoLineaInvestigacion, dataSource);
  }
}
