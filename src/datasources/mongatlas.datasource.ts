import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongatlas',
  connector: 'mongodb',
  url: 'mongodb+srv://Karlos:Karatlas11@clusterprogweb.rtknzz0.mongodb.net/MascotasBD?retryWrites=true&w=majority',
  host: '',
  port: 0,
  user: '',
  password: '',
  database: '',
  useNewUrlParser: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongatlasDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'mongatlas';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongatlas', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
