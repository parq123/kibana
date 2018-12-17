const crypto = require('crypto');
//import { uiModules } from 'ui/modules';
// const modulesec = uiModules.get('security', []);

//console.log(module);

// console.log(">>>>>>>>>>>>>>>>><");
// console.log(modulesec);
// console.log("<<<<<<<<<<<<<<<<<<<<<<<<");


module.exports = function (server, options) {

    server.state('dcookie', {
        ttl: null,
        isSecure: true,
        isHttpOnly: true,
        encoding: 'base64json',
        clearInvalid: false, // remove invalid cookies
        strictHeader: true // don't allow violations of RFC 6265
    });
    

    // server.plugins.tdkauth.username = "aassa ttA";
    // console.log(server.plugins.tdkauth.username);

    const encode = function(pwd) {
        return crypto.createHash('sha256').update(pwd).digest('hex');
    };

    const login = function (request, reply) {

        if (request.auth.isAuthenticated) {
            return reply.continue();
        }

        let message;
        let username;
        let password;
        let checked = false;
        let processing = true;

        let loginForm = function(reply){
            return reply('<!DOCTYPE html>' +
                '<html>' +
                    '<head>' +
                        '<title>Login Required</title>' +
                        '<link rel="stylesheet" href="/qlc/bundles/commons.style.css">' +
                        '<link rel="stylesheet" href="/qlc/bundles/kibana.style.css">' +
                    '</head>' +
                    '<body>' +
                        '<center>' +
                            '<div class="container" style="width: 20%;margin-left: auto;margin-right:auto;margin-top: 10%;">' +
                                '<h1 style="background-color: #e8488b"><img width="60%" src="/qlc/bundles/src/ui/public/images/kibana.svg"></h1>' +
                                (message ? '<h3>' + message + '</h3><br/>' : '') +
                                '<form id="login-form" method="get" action="/qlc/login">' +
                                    '<div class="form-group inner-addon left-addon">' +
                                    '<input type="text" style="margin-bottom:8px;font-size: 1.25em;height: auto;" name="username" placeholder="Username" class="form-control">' +
                                    '<input type="password" style="font-size: 1.25em;height: auto;" name="password" placeholder="Password" class="form-control">' +
                                    '</div><div style="width:200px;margin-left:auto;margin-right:auto;">' +
                                    '<input type="submit" value="Login" class="btn btn-default login" style="width: 80%;font-size: 1.5em;">' +
                                    '</div>' +
                                '</form>' +
                            '</div>' +
                        '</center>' +
                    '</body>' +
                '</html>');

        };

        if (request.method === 'post') {
            username = request.payload.username;
            password = request.payload.password;
        } else if (request.method === 'get') {
            username = request.query.username;
            password = request.query.password;
        }

        if (!username && !password) {
            processing = false;
        }

        if (username || password){
            let encPass = encode(password);
            // let client = server.plugins.elasticsearch.client;
            // console.log(client);
                // if (true) {
                //     checked = true;
                //     let uuid = 1;
                //     const sid = String(++uuid);
                //     console.log(request.session);
                //     request.server.app.cache.set(sid, { username: username }, 0, (err) => {
                //         if (err) {
                //             reply(err);
                //         }
                        
                //         request.server.app.cache.set(sid, { sid: sid }, 0);
                //         request.cookieAuth.set({ sid });
                //         //request.auth.session.set({ sid: sid });
                //         // var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
                //         return reply.redirect("/nth");
                //     });
                // } else {
                //     message = 'Invalid username or password';
                //     loginForm(reply);
                // }

                let c = server.plugins.elasticsearch.getCluster('data');
                
                request.auth["credentials"]= { sid: username, pwd: password};
                c.callWithRequest(request, 'search', {
                    allowNoIndices: false,
                    index: "movies",
                    body: {
                        "size": 1,
                        "query": {
                            "match_all": {}
                        }
                    }
                }).then(function (res) {
                        console.log(res);
                        if (res.hits.total>=0) {
                            checked = true;
                            let uuid = username;
                            const sid = String(uuid);
                            request.server.app.cache.set(sid, { username: username }, 0, (err) => {
                                if (err) {
                                    reply(err);
                                }
                                
                                request.server.app.cache.set(sid, { sid: sid, pwd: password}, 0);
                                request.cookieAuth.set({ sid: sid, pwd: password});
                                return reply.redirect("/");
                            });
                        } else {
                            message = 'Invalid username or password';
                            loginForm(reply);
                        }
                    },
                    function (error) {
                        checked = false;
                        message = 'Invalid username or password (' + error + ')';
                        loginForm(reply);
                    });
                // });
            
            // .then(function (res) {
            //         if (res.hits.hits[0] && res.hits.hits[0]._source.password == encPass) {
            //             checked = true;
            //             let uuid = 1;
            //             const sid = String(++uuid);
            //             request.server.app.cache.set(sid, { username: username }, 0, (err) => {
            //                 if (err) {
            //                     reply(err);
            //                 }

            //                 request.auth.session.set({ sid: sid });
            //                 // var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
            //                 return reply.redirect("/");
            //             });
            //         } else {
            //             message = 'Invalid username or password';
            //             loginForm(reply);
            //         }
            //     },
                // function (error) {
                //     checked = false;
                //     message = 'Invalid username or password';
                //     loginForm(reply);
                // });
        } else if (request.method === 'post') {
            processing = false;
            message = 'Missing username or password';
        }

        if (!checked && !processing) {
            loginForm(reply);
        }
    };

    const logout = function (request, reply) {
        request.auth.session.clear();
        return reply.redirect('/');
    };

    server.register(require('hapi-auth-cookie'), (err) => {
	const authHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const salt = "RJMIgyv5P8gxiylnd7z5vrHj3a91ILBe";

        if (err) {
            throw err; 
        }
        //{{ getHref('/app/kibana#/home') }}
        const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
        server.app.cache = cache;

        server.auth.strategy('session', 'cookie', true, {
            password: "suyhenapajusakmsasajsayhsuajskal",
            cookie: 'sid',
            redirectTo: '/qlc/login',
            isSecure: false,
            validateFunc: function (request, session, callback) {

                cache.get(session.sid, (err, cached) => {

                    if (err) {
                        return callback(err, false);
                    }

                    if (!cached) {
                        return callback(null, false);
                    }

                    return callback(null, true, cached.username);
                });
            }
        });

        server.route([
            {
                method: ['GET', 'POST'],
                path: '/login',
                config: {
                    handler: login,
                    auth: { mode: 'try' },
                    plugins: { 'hapi-auth-cookie': { redirectTo: false } }
                }
            },
            { method: 'GET', path: '/logout', config: { handler: logout } }
        ]);
    });
};
