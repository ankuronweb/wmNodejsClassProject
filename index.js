let http = require('http')
let request = require('request')
let path = require('path')
let fs = require('fs')

let argv = require('yargs')
    .default('host', '127.0.0.1:8000')
    .argv
let scheme = 'http://'
let port = argv.port || (argv.host === '127.0.0.1' ? 8000 : 80)
let destinationUrl = argv.url || scheme + argv.host + ':' + port

let logPath = argv.log && path.join(__dirname, argv.log)
let logStream = logPath ? fs.createWriteStream(logPath) : process.stdout

http.createServer((req, res) => {
	for (let header in req.headers) {
	    res.setHeader(header, req.headers[header])
	}
	req.pipe(res)

}).listen(8000)

http.createServer((req, res) => {
    // Proxy code
    let options = {
        headers: req.headers,
        url: `http://${destinationUrl}${req.url}`
    }
    options.method = req.method
    req.pipe(request(options)).pipe(res)
    logStream.write('Request headers: ' + JSON.stringify(req.headers))
    req.pipe(logStream, {end: false})



}).listen(8001)