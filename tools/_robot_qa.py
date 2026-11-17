import base64,json,os,socket,struct,time,urllib.request,subprocess,tempfile,threading,http.server,functools
from pathlib import Path
from urllib.parse import urlsplit
OUT=Path(tempfile.gettempdir())/'portfolio-robot-qa';OUT.mkdir(exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(Path.cwd())))
threading.Thread(target=server.serve_forever,daemon=True).start()
subprocess.Popen([r'C:\Program Files\Google\Chrome\Application\chrome.exe','--headless=new','--no-first-run','--remote-debugging-port=9225','--user-data-dir='+str(OUT/'profile'),'about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
for _ in range(60):
 try:
  targets=json.load(urllib.request.urlopen('http://127.0.0.1:9225/json/list'));break
 except OSError:time.sleep(.2)
u=urlsplit(next(t['webSocketDebuggerUrl'] for t in targets if t['type']=='page'))
sock=socket.create_connection((u.hostname,u.port),timeout=25)
key=base64.b64encode(os.urandom(16)).decode()
sock.sendall((f'GET {u.path} HTTP/1.1\r\nHost: {u.netloc}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n').encode());buf=b''
while b'\r\n\r\n' not in buf:buf+=sock.recv(4096)
buf=buf.split(b'\r\n\r\n',1)[1];seq=0;errors=[]
def read(n):
 global buf
 while len(buf)<n:
  c=sock.recv(max(4096,n-len(buf)))
  if not c:raise EOFError()
  buf+=c
 r,buf=buf[:n],buf[n:];return r
def cdp(method,params=None):
 global seq
 seq+=1;p=json.dumps({'id':seq,'method':method,'params':params or {}}).encode();n=len(p)
 h=bytes([129,128+n]) if n<126 else bytes([129,254])+struct.pack('!H',n)
 mask=os.urandom(4);sock.sendall(h+mask+bytes(b^mask[i%4] for i,b in enumerate(p)));parts=b''
 while True:
  a,b=read(2);n=b&127
  if n==126:n=struct.unpack('!H',read(2))[0]
  elif n==127:n=struct.unpack('!Q',read(8))[0]
  p=read(n)
  if a&15 not in (0,1):continue
  parts+=p
  if not a&128:continue
  m=json.loads(parts);parts=b''
  if m.get('method') in ('Runtime.exceptionThrown',):errors.append(m)
  if m.get('id')==seq:
   if 'error' in m:raise RuntimeError(m['error'])
   return m.get('result',{})
def ev(s):
 r=cdp('Runtime.evaluate',{'expression':s,'awaitPromise':True,'returnByValue':True})
 if 'exceptionDetails' in r:raise RuntimeError(r)
 return r['result'].get('value')
def shot(name):
 r=cdp('Page.captureScreenshot',{'format':'png'});(OUT/(name+'.png')).write_bytes(base64.b64decode(r['data']))
def viewport(w):cdp('Emulation.setDeviceMetricsOverride',{'width':w,'height':1000,'deviceScaleFactor':1,'mobile':w<768})
def visit(path=''):
 cdp('Page.navigate',{'url':f'http://127.0.0.1:{server.server_port}/'+path});time.sleep(1)
 ev('document.fonts.ready.then(()=>true)')
def ready():
 for _ in range(80):
  if ev('document.querySelector("[data-hero-robot]").dataset.state') in ['ready','unavailable']:break
  time.sleep(.25)
 assert ev('document.querySelector("[data-hero-robot]").dataset.state')=='ready'
try:
 cdp('Runtime.enable');cdp('Page.enable');cdp('Network.enable')
 cdp('Page.addScriptToEvaluateOnNewDocument',{'source':'''window.drawCount=0;for(const proto of [WebGLRenderingContext.prototype,WebGL2RenderingContext.prototype]){const draw=proto.drawElements;proto.drawElements=function(...args){window.drawCount++;return draw.apply(this,args)}}'''})
 results=[]
 for w in [1440,1024,768,390,320]:
  viewport(w);visit();ready();time.sleep(.3)
  ev('document.documentElement.dataset.theme="light"');shot(f'hero-{w}')
  r=ev('''(()=>{let h=document.querySelector('.hero-robot'),c=document.querySelector('.hero-copy'),r=h.getBoundingClientRect(),t=c.getBoundingClientRect();return {width:innerWidth,ready:h.dataset.state,overflow:document.documentElement.scrollWidth>innerWidth,overlap:r.bottom>t.top,robot:[r.x,r.y,r.width,r.height],heroHeight:document.querySelector('#home').clientHeight,canvasCount:document.querySelectorAll('canvas').length,legacy:!!document.querySelector('.hero-atmosphere'),font:getComputedStyle(document.querySelector('h1')).fontFamily}})()''')
  assert not r['overflow'] and not r['overlap'] and not r['legacy'] and r['canvasCount']==1,r
  if w==1440:
   ev('document.documentElement.dataset.theme="dark"');shot('hero-dark')
   cdp('Input.dispatchMouseEvent',{'type':'mouseMoved','x':1400,'y':300});time.sleep(.6);shot('look-right')
   for progress in [0,.2,.45,.7,.9,0]:
    ev(f'scrollTo(0,document.querySelector("#home").offsetHeight*{progress})');time.sleep(.2)
    opacity=ev('Number(document.querySelector(".hero-robot").style.opacity)')
    assert abs(opacity-(1 if progress<=.2 else .5 if progress==.45 else 0))<.01,(progress,opacity)
   ev('scrollTo(0,document.querySelector("#overview").offsetTop)');time.sleep(.3)
   count=ev('drawCount');time.sleep(.5);assert ev('drawCount')==count
   assert ev('document.querySelector(".hero-robot").dataset.active')=='false'
   shot('about-no-robot');ev('scrollTo(0,0)');time.sleep(.3);assert ev('drawCount')>count
  results.append(r)
 # Reduced motion renders on demand, without an idle loop.
 cdp('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-motion','value':'reduce'}]})
 viewport(1440);visit();ready();time.sleep(.3);count=ev('drawCount');time.sleep(.4);assert count==ev('drawCount')
 # Context restoration and failed CDN must leave portfolio content usable.
 ev('window.gl=document.querySelector("#hero-model").getContext("webgl2");window.ext=gl.getExtension("WEBGL_lose_context");ext.loseContext()');time.sleep(.2)
 assert ev('document.querySelector(".hero-robot").dataset.state')=='unavailable'
 ev('ext.restoreContext()');time.sleep(.5);ready()
 cdp('Network.setBlockedURLs',{'urls':['*cdn.jsdelivr.net/npm/three*']});visit();time.sleep(.5)
 assert ev('document.querySelector(".hero-robot").dataset.state')=='unavailable'
 assert ev('getComputedStyle(document.querySelector("#hero-title")).opacity')=='1'
 assert ev('document.querySelector(".hero-actions a").getAttribute("href")')=='./projects/'
 cdp('Network.setBlockedURLs',{'urls':[]})
 visit('projects/');assert ev('document.querySelector("#hero-model")') is None
 assert ev('document.querySelectorAll(".project-showcase-card").length')>0
 print(json.dumps(results));print('Runtime errors:',json.dumps(errors));assert not errors
 (OUT/'results.json').write_text(json.dumps(results,indent=2),encoding='utf8')
finally:
 try:cdp('Browser.close')
 except (OSError,EOFError):pass
 sock.close();server.shutdown();server.server_close()
