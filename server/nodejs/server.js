  //
 // file-uploader node.js-demo
//

var connect = require('connect') 
  , fs = require('fs')
  , formidable = require('formidable')
  , uploadDir = __dirname+'/../uploads/'
  , port = 3000
  , files = []
  , fields = []
  , body, fileStream, server, socket, uploader, form
  
uploader = function(req, res, next) {
  if (req.headers['content-type'].match(/multipart\/form-data/i)) {
    form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.uploadDir = uploadDir
    form.parse(req, function(err, fields, files){
      body = '{"success":"true"}'
      res.writeHead(200, 
        { 'Content-Type':'text/html'
        , 'Content-Length':body.length
        })
      res.end(body)
    })
  }
  else if (req.headers['content-type'].match(/application\/octet-stream/i)) {
    fileStream = fs.createWriteStream(uploadDir+req.headers['x-file-name'])
    req.pipe(fileStream)
    req.on('end', function() {
      body = '{"success":"true"}'
      res.writeHead(200, 
        { 'Content-Type':'text/html'
        , 'Content-Length':body.length
        })
      res.end(body)
    })
  }
}                                                
  
server = module.exports = connect.createServer
  ( connect.staticProvider({root: __dirname+'/public', cache:true})
  , connect.staticProvider({root: __dirname+'/../../client', cache:true})
  , connect.router(function(app){app.post('/upload', uploader)})
  ).listen(port)

console.log('Connect server listening on port %s.', port)
                                                                  
