const { log } = require('console');
let http = require('http');
let hostname = '127.0.0.1';
let port = 8080

let server = http.createServer( (req, res) => {
    let path = req.url;
    let method = req.method
    if( path === "/products"){
        if( method === 'GET'){
            res.writeHead(200, {"Content-type":"application/json"});
            const products = JSON.stringify([
                {
                    name:'농구공',
                    price: 5000,
                }
            ])
            res.end( products )
        } else if( method === "POST"){
            res.end("생성되었습니다.")
        }
    }
    res.end("Good Bye")
});

server.listen(port, hostname)

console.log('grap market server on!');