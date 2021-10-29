import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Jurado, JuradoRelations, UsuarioJurado, LineaInvestigacion, JuradoLineaInvestigacion} from '../models';
import {UsuarioJuradoRepository} from './usuario-jurado.repository';
import {JuradoLineaInvestigacionRepository} from './jurado-linea-investigacion.repository';
import {LineaInvestigacionRepository} from './linea-investigacion.repository';

export class JuradoRepository extends DefaultCrudRepository<
  Jurado,
  typeof Jurado.prototype.id,
  JuradoRelations
> {

  public readonly usuarioJurado: HasOneRepositoryFactory<UsuarioJurado, typeof Jurado.prototype.id>;

  public readonly lineaInvestigacions: HasManyThroughRepositoryFactory<LineaInvestigacion, typeof LineaInvestigacion.prototype.id,
          JuradoLineaInvestigacion,
          typeof Jurado.prototype.id
        >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UsuarioJuradoRepository') protected usuarioJuradoRepositoryGetter: Getter<UsuarioJuradoRepository>, @repository.getter('JuradoLineaInvestigacionRepository') protected juradoLineaInvestigacionRepositoryGetter: Getter<JuradoLineaInvestigacionRepository>, @repository.getter('LineaInvestigacionRepository') protected lineaInvestigacionRepositoryGetter: Getter<LineaInvestigacionRepository>,
  ) {
    super(Jurado, dataSource);
    this.lineaInvestigacions = this.createHasManyThroughRepositoryFactoryFor('lineaInvestigacions', lineaInvestigacionRepositoryGetter, juradoLineaInvestigacionRepositoryGetter,);
    this.registerInclusionResolver('lineaInvestigacions', this.lineaInvestigacions.inclusionResolver);
    this.usuarioJurado = this.createHasOneRepositoryFactoryFor('usuarioJurado', usuarioJuradoRepositoryGetter);
  }
}
