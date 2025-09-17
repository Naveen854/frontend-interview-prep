const http = require('http');
const url = require('url');

/** 
    @description An End to End implementation of an Express-like framework
    need to add middleware support, error handling, Routers, use , static file serving, etc.
*/
class MyExpress {
    constructor() {
        this.routes = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {}
        };
    }

    get(path, handler) {
        this.routes.GET[path] = handler;
    }

    post(path, handler) {
        this.routes.POST[path] = handler;
    }

    put(path, handler) {
        this.routes.PUT[path] = handler;
    }
    delete(path, handler) {
        this.routes.DELETE[path] = handler;
    }

    listen(port, callback) {
        const server = http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url, true);
            const method = req.method;
            const path = parsedUrl.pathname;

            const handler = this.routes[method] && this.routes[method][path];
            if (handler) {
                // Simple body parsing for POST and PUT requests
                if (method === 'POST' || method === 'PUT') {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });
                    req.on('end', () => {
                        req.body = body ? JSON.parse(body) : {};
                        handler(req, res);
                    });
                }   else { 
                    handler(req, res);
                }
            } else {
                res.statusCode = 404;
                res.end('Not Found');
            }
        });

        server.listen(port, callback);
    }

    use(middleware) {
        // Middleware support can be implemented here
        // This is a placeholder for future middleware functionality
    }

    useStatic(staticPath) {
        // Static file serving can be implemented here
        // This is a placeholder for future static file serving functionality
    }

    useRouter(router) {
        // Router support can be implemented here
        // This is a placeholder for future router functionality
    }
}

class Router extends MyExpress {}          

module.exports = MyExpress;