<h3>Пример конфигурации в src/config/config.js

<pre>
module.exports = {
  host: 'http://192.168.11.48',
  external: '192.168.11.48',
  clientPort: 9080,
  port: 9081,
  srcPort: 9082,
  buildPort: 9083,
  dbURL: 'mongodb://localhost/articles',
  dbOptions: {
    // useMongoClient: true,
    useNewUrlParser: true
  }
}
</pre>