const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};
const servidor=http.createServer((pedido ,respuesta) => {
    const objetourl = url.parse(pedido.url);
  let camino='public'+objetourl.pathname;
  if (camino=='public/')
    camino='public/index.html';
  encaminar(pedido,respuesta,camino);
});

servidor.listen(8888);
function encaminar (pedido,respuesta,camino) {
  console.log(camino);
  switch (camino) {
    case 'public/recuperardatos': {
      recuperar(pedido,respuesta);
      break;
    }	
    default : {  
      fs.stat(camino, error => {
        if (!error) {
        fs.readFile(camino,(error, contenido) => {
          if (error) {
            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
            respuesta.write('Error interno');
            respuesta.end();					
          } else {
            const vec = camino.split('.');
            const extension=vec[vec.length-1];
            const mimearchivo=mime[extension];
            respuesta.writeHead(200, {'Content-Type': mimearchivo});
            respuesta.write(contenido);
            respuesta.end();
          }
        });
      } else {
        respuesta.writeHead(404, {'Content-Type': 'text/html'});
        respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
        respuesta.end();
        }
      });	
    }
  }	
}


function recuperar(pedido,respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
    });
  pedido.on('end', () => {
    const formulario = querystring.parse(info);
    const cd=formulario['cd'];
    const num=formulario['num'];
    const pCadena=formulario['cadena'];
    let cadena=Cifrar(cd,num,pCadena);
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    const pagina=`<!doctype html><html><head></head><body>${cadena}</body></html>`;
    respuesta.end(pagina);
    });
    
    
    function Cifrar(cd,num,cadena){
    let ncadena="";
    let abeced="abcdefghijklmnopqrstuvwxyz";
    if(cd=="c"){
        cd=1;
    }else if(cd=="d"){
        cd=-1;
    }else{
    alert("Error, un valor ingresado no es correcto.");
    }
        for(let x=0;x<cadena.length;x++){
                let pos=abeced.search(cadena[x]);
                pos+=num*cd;
            if(pos>25){
                pos-=26;
            }else if(pos<0){
                pos+=26;
            }
                ncadena+=abeced[pos];
            }
    return ncadena;
        }
    }
console.log('Servidor web iniciado');