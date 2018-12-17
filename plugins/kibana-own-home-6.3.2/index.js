import initProxy from './server/proxy/init_proxy';
import selectionRoute from './server/selection';

export default function (kibana) {

  return new kibana.Plugin({
    require: ['elasticsearch'],

    // uiExports: {
    //   app: {
    //     title: 'Own Home',
    //     description: 'Add multi-tenancy feature to Kibana',
    //     main: 'plugins/own_home/app',
    //     icon: 'plugins/own_home/icon.svg'
    //   }
    // },

    // config(Joi) {
    //   const { array, boolean, number, object, string } = Joi;

    //   return object({
    //     enabled: boolean().default(true),
    //     remote_user: string(),
    //     proxy_user_header: string().default('x-proxy-user'),
    //     get_username_from_session: object({
    //       enabled: boolean().default(true),
    //       key: string().default('sid')
    //     }).default(),
    //     default_kibana_index_suffix: string(),
    //     ssl: object({
    //       certificate: string(),
    //       key: string()
    //     }).default(),
    //     elasticsearch: object({
    //       url: string().default('http://localhost:9400'),
    //       ssl: object({
    //         certificateAuthorities: array().single().items(string())
    //       }).default()
    //     }).default(),
    //     session: object({
    //       secretkey: string().default('the-password-must-be-at-least-32-characters-long'),
    //       isSecure: boolean().default(true),
    //       timeout: number().default(3600000),
    //       cookie: object({
    //         ttl: number().integer().min(0).default(60 * 60 * 1000)
    //       }).default()
    //     }).default(),
    //     local: object({
    //       enabled: boolean().default(true),
    //       groups: array().items().single().default(['public', 'sandbox'])
    //     }).default(),
    //     ldap: object({
    //       enabled: Joi.boolean().default(false),
    //       url: string().default('ldap://localhost:389'),
    //       userbase: string().default('ou=People,dc=localhost'),
    //       rolebase: string().default('ou=Groups,dc=localhost'),
    //       search_filter: string().default('(cn=*)'),
    //       username_attribute: string().default('cn'),
    //       rolename_attribute: string().default('cn'),
    //       adfs: boolean().default(false),
    //       member_attribute: string().valid('member', 'memberUid', 'uniquemember').default('member'),
    //       get_dn_dynamically: boolean().default(false),
    //       bind: object({
    //         dn: string(),
    //         password: string()
    //       }).default()
    //     }).default(),
    //     explicit_kibana_index_url: object({
    //       enabled: Joi.boolean().default(false),
    //       proxy: object({
    //         url: string().default('http://localhost:15601'),
    //         ssl: object({
    //           certificate: string(),
    //           key: string()
    //         }).default()
    //       }).default(),
    //       kibana: object({
    //         ssl: object({
    //           verificationMode: Joi.boolean().default(true),
    //           certificateAuthorities: string()
    //         }).default()
    //       }).default()
    //     }).default(),
    //     wait_kibana_index_creation: number().default(3000),
    //     force_to_access_by_es_user: boolean().default(false)
    //   }).default();
    // },

    init(server, options) {
      require('./server/tdsauth-local-cookie')(server, options);
      // if (server.config().get('own_home.enabled')) {
      //   initProxy(server);
      //   selectionRoute(server);
      // }
    }
  });
};
