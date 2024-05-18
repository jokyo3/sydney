// pages/functions/_middleware.js

export async function onRequest(context) {
  const { request, env } = context;

  // 处理 CORS 请求
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  // 处理 WebSocket 请求
  if (request.headers.get('Upgrade') === 'websocket') {
    return handleWebSocket(request);
  }

  // 处理普通 HTTP 请求
  return handleRequest(request, env);
}

function handleOptions(request) {
  // 设置 CORS 头部
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || '',
    'Access-Control-Max-Age': '86400',
  };

  return new Response(null, { headers: corsHeaders });
}

async function handleWebSocket(request) {
  // 在这里添加您的 WebSocket 处理逻辑
  let serverUrl = "https://sydney.bing.com";
  const currentUrl = new URL(request.url);
  const fetchUrl = new URL(serverUrl + currentUrl.pathname + currentUrl.search);
  let serverRequest = new Request(fetchUrl, request);
  serverRequest.headers.set('origin', 'https://www.bing.com');
  serverRequest.headers.set('referer', 'https://www.bing.com/search?q=Bing+AI');
  const cookie = serverRequest.headers.get('Cookie') || '';
  let cookies = cookie; 
  if (!cookie.includes('_U=')) {
      cookies += '; _U=' + 'xxxxxx';
  }
  serverRequest.headers.set('Cookie', cookies);
  serverRequest.headers.set('user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.7 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.410427012');
  const res = await fetch(serverRequest);
  const newRes = new Response(res.body, res);
  newRes.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
  newRes.headers.set('Access-Control-Allow-Credentials', 'true');
  newRes.headers.set('Access-Control-Allow-Headers', '*');

  // 调试输出连接 IP
  let Ipurl = new URL("http://ipecho.net/plain");
  let Ipresponse = await fetch(Ipurl);
  let textip = await Ipresponse.text();
  newRes.headers.set('TestLog', "This is Sydney@" + textip);
  const Guestip = request.headers.get('cf-connecting-ip');
  newRes.headers.set('Guestip', Guestip); 

  return newRes;
}


async function handleRequest(request, env) {
  // 在这里添加您的 HTTP 请求处理逻辑
  const uri = new URL(request.url)
   uri.hostname = 'sydney.bing.com'
  return fetch(new Request(uri.toString(), request))
}
