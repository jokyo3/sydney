// pages/functions/_middleware.js
import { bingapiModels, bingapiModel, bingapiChat, bingapiImage, getRandomIP } from "./bingapi.js"

// 同查找 _U 一样, 查找 KievRPSSecAuth 的值并替换下方的xxx
const CUSTOM_OPTIONS = {
  KievRPSSecAuth: '',
  _RwBf: '',
  MUID: '',
  _U: '',

  BYPASS_SERVER: 'https://cct.nbing.eu.org',
  APIKEY: '',
  Go_Proxy_BingAI_BLANK_API_KEY: true,

  Go_Proxy_BingAI_AUTH_KEY: '',

  INFO: '',
  NIGHTLY: false,
}

const WEB_CONFIG = {
  WORKER_URL: '', // 如无特殊需求请，保持为''
};

const RAND_IP_COOKIE_NAME = 'BingAI_Rand_IP';
const AUTH_KEY_COOKIE_NAME = 'BingAI_Auth_Key';

const SYDNEY_ORIGIN = 'https://sydney.bing.com';
const SYDNEY_PROXY = 'https://prosydney.nbing.eu.org';
const BING_ORIGIN = 'https://www.bing.com';
const BING_PROXY = 'https://sokwith-proxybing.hf.space';
const BING_FREE = 'https://free.nbing.eu.org';
const BING_SOURCE_ORIGIN = 'https://th.bing.com';
const BING_SR_ORIGIN = 'https://sr.bing.com';
const EDGE_ORIGIN = 'https://edgeservices.bing.com';
const DESIGNER_ORIGIN = 'https://designer.microsoft.com';
const DESIGNER_CDN_ORIGIN = 'https://cdn.designerapp.osi.office.net';
const DESIGNER_APP_ORIGIN = 'https://designerapp.officeapps.live.com';
const DESIGNER_APP_EDOG_ORIGIN = 'https://designerapp.edog.officeapps.live.com';
const DESIGNER_DOCUMENT_ORIGIN = 'https://document.designerapp.officeapps.live.com';
const DESIGNER_USERASSETS_ORIGIN = 'https://userassets.designerapp.officeapps.live.com';
const DESIGNER_MEDIASUGGESTION_ORIGIN = 'https://mediasuggestion.designerapp.officeapps.live.com';
const DESIGNER_RTC_ORIGIN = 'https://rtc.designerapp.officeapps.live.com';
const KEEP_REQ_HEADERS = [
  'accept',
  'accept-encoding',
  'accept-language',
  'authorization',
  'connection',
  'cookie',
  'upgrade',
  'user-agent',
  'sec-websocket-extensions',
  'sec-websocket-key',
  'sec-websocket-version',
  'x-request-id',
  'content-length',
  'content-type',
  'access-control-request-headers',
  'access-control-request-method',
  'sec-ms-gec',
  'sec-ms-gec-version',
  'x-client-data',
  'x-ms-client-request-id',
  'x-ms-useragent',
];


/**
 * 随机整数 [min,max)
 * @param {number} min
 * @param {number} max
 * @returns
 */
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

/**
 * 生成随机字符串
 * @param {number} e
 * @returns
 */
const randomString = (e) => {
  e = e || 32;
  const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678_-+";
  var n = "";
  for (let i = 0; i < e; i++) n += t.charAt(getRandomInt(0, t.length));
  return n;
}

const replaceURL = (body) => {
  body = body.replaceAll(BING_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", ""));
  body = body.replaceAll(SYDNEY_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", ""));
  body = body.replaceAll(EDGE_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", ""));
  body = body.replaceAll(BING_SOURCE_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/th');
  body = body.replaceAll(DESIGNER_CDN_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-cdn');
  body = body.replaceAll(DESIGNER_APP_EDOG_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-app-edog');
  body = body.replaceAll(DESIGNER_DOCUMENT_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-document');
  body = body.replaceAll(DESIGNER_USERASSETS_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-userassets');
  body = body.replaceAll(DESIGNER_MEDIASUGGESTION_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-mediasuggestion');
  body = body.replaceAll(DESIGNER_RTC_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-rtc');
  body = body.replaceAll(DESIGNER_APP_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-app');
  body = body.replaceAll(DESIGNER_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer');
  return body
}

const rewriteBody = async (res) => {
  const content_type = res.headers.get("Content-Type") || "";
  let encoding = null;
  let body = res.body;
  if (content_type.startsWith("text/html") || res.url.endsWith("js")) {
    let decodedContent = new TextDecoder("utf-8").decode(new Int8Array(await res.clone().arrayBuffer()));
    if (decodedContent) {
      // @ts-ignore
      body = replaceURL(decodedContent);
    }
  }
  return { body, encoding };
}

/**
 * home
 * @param {string} pathname
 * @returns
 */
const home = async (pathname) => {
  let url = 'https://sokwith-proxybing.hf.space/';
  const res = await fetch(url);
  const result = await rewriteBody(res);
  const newRes = new Response(result.body, res);
  if (pathname.endsWith('.js')) {
    newRes.headers.set('content-type', 'application/javascript');
  } else if (pathname.endsWith('.css')) {
    newRes.headers.set('content-type', 'text/css');
  } else if (pathname.endsWith('.svg')) {
    newRes.headers.set('content-type', 'image/svg+xml');
  } else if (pathname.endsWith('.ico') || pathname.endsWith('.png')) {
    newRes.headers.set('content-type', 'image/png');
  } else {
    newRes.headers.set('content-type', 'text/html; charset=utf-8');
  }
  newRes.headers.delete('content-security-policy');
  return newRes;
};

/**
 * challenge
 * @param {Request} request
 * @returns
 */
const challenge = async (request) => {
  if (request.method != 'GET') {
    return Response.json({ code: 405, message: 'Method Not Allowed', data: null }, { status: 405 });
  }

  const currentUrl = new URL(request.url);
  const newRes = new Response(challengeResponseBody.replaceAll('{{%s}}', currentUrl.searchParams.get('iframeid')));
  newRes.headers.set('Content-Type', 'text/html; charset=utf-8');
  return newRes
};

/**
 * verify
 * @param {Request} request
 * @param {String} cookie
 * @returns
 */
const verify = async (request, cookie) => {
  if (request.method != 'GET') {
    return Response.json({ code: 405, message: 'Method Not Allowed', data: null }, { status: 405 });
  }

  let reqCookies = request.headers.get('Cookie').split('; ');
  let bypassServer = CUSTOM_OPTIONS.BYPASS_SERVER;
  for (let i = 0; i < reqCookies.length; i++) {
    let cookie = reqCookies[i];
    if (cookie.startsWith('BingAI_Pass_Server')) {
      let tmp = cookie.replace('BingAI_Pass_Server=', '');
      if (tmp !== '') {
        bypassServer = tmp;
        break;
      }
    }
  }

  const currentUrl = new URL(request.url);
  let req = {
    'IG': currentUrl.searchParams.get('IG'),
    'iframeid': currentUrl.searchParams.get('iframeid'),
    'cookies': cookie,
    'convId': currentUrl.searchParams.get('convId'),
    'rid': currentUrl.searchParams.get('rid'),
    'T': currentUrl.searchParams.get('T'),
    'host': WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", ""),
  }
  const newReq = new Request(bypassServer, {
    method: 'POST',
    body: JSON.stringify(req),
  });
  const res = await fetch(newReq)
  if (res.status != 200) {
    if (res.status === 451) {
      return Response.json({ code: 451, message: "Verification Failed", data: null }, { status: 451 })
    }
    return Response.json({ code: 500, message: "Server Error", data: null }, { status: res.status })
  }
  const resData = await res.json();

  const cookies = resData.result.cookies.split('; ')
  const newRes = Response.json(JSON.stringify(resData));
  for (let v of cookies) {
    newRes.headers.append('Set-Cookie', v + '; path=/');
  }
  return newRes;
};

/**
 * pass
 * @param {Request} request
 * @param {String} cookie
 * @returns
 */
const pass = async (request, cookie) => {
  if (request.method != 'POST') {
    return Response.json({ code: 405, message: 'Method Not Allowed', data: null }, { status: 405 });
  }

  let resqBody = JSON.parse(await request.text());

  let reqCookies = request.headers.get('Cookie').split('; ');
  let bypassServer = CUSTOM_OPTIONS.BYPASS_SERVER;
  for (let i = 0; i < reqCookies.length; i++) {
    let cookie = reqCookies[i];
    if (cookie.startsWith('BingAI_Pass_Server')) {
      let tmp = cookie.replace('BingAI_Pass_Server=', '');
      if (tmp !== '') {
        bypassServer = tmp;
        break;
      }
    }
  }

  let req = {
    'IG': resqBody['IG'],
    'iframeid': "local-gen-" + crypto.randomUUID(),
    'cookies': cookie,
    'convId': '',
    'rid': '',
    'T': resqBody['T'],
  }
  const newReq = new Request(bypassServer, {
    method: 'POST',
    body: JSON.stringify(req),
  });
  return await fetch(newReq);
};

const login = async (url, headers) => {
  // 解析URL以获取hostname作为domain
  const uri = new URL(url);
  const domain = uri.hostname; // 获取请求的主机名

  // 发送请求以获取cookies
  const cctresp = await fetch('https://jokyone-cookiesvr.hf.space/GET?pwd=234567');
  let bBING_COOKIE = await cctresp.text();
  let data = JSON.parse(bBING_COOKIE);
  let Uallcookies = data.result.cookies;
  const keyValuePairs = Uallcookies.split(';');

  // 创建一个新的 Headers 对象
  let newHeaders = new Headers(headers); // 使用传入的headers
  // 清除原有的 Set-Cookie 头部
  newHeaders.delete('Set-Cookie');
  // 为每个键值对添加 Set-Cookie 头部
  keyValuePairs.forEach(pair => {
    const [key, value] = pair.trim().split('=');
    newHeaders.append('Set-Cookie', `${key}=${value}; Domain=${domain}; Path=/`);
  });

  // 创建一个新的请求对象
  const newReq = new Request(url, {
    method: 'GET', // 或者根据需要的HTTP方法
    headers: newHeaders
  });

  // 创建并返回新的 Response 对象，不包含body
  return new Response(null, {
    status: 204, // 204 No Content
    headers: newHeaders
  });
};

function processHeaders(request, targetHost) {
  const newHeaders = new Headers();
  request.headers.forEach((value, key) => {
    if (KEEP_REQ_HEADERS.includes(key)) {
      newHeaders.set(key, value);
    }
  });
  newHeaders.set('host', targetHost);
  newHeaders.set('origin', BING_ORIGIN);
  if (request.headers.has('referer') && request.headers.get('referer').indexOf('web/compose.html') != -1) {
    newHeaders.set('referer', 'https://edgeservices.bing.com/edgesvc/compose');
  } else {
    newHeaders.set('referer', 'https://www.bing.com/chat?q=Bing+AI&showconv=1&FORM=hpcodx');
  }
  const randIP = getRandomIP();
  newHeaders.set('X-Forwarded-For', randIP);
  const cookie = request.headers.get('Cookie') || '';
  let cookies = cookie;

  if (!cookie.includes('KievRPSSecAuth=')) {
    if (CUSTOM_OPTIONS.KievRPSSecAuth.length !== 0) {
      cookies += '; KievRPSSecAuth=' + CUSTOM_OPTIONS.KievRPSSecAuth;
    } else {
      cookies += '; KievRPSSecAuth=' + randomString(512);
    }
  }
  if (!cookie.includes('_RwBf=')) {
    if (CUSTOM_OPTIONS._RwBf.length !== 0) {
      cookies += '; _RwBf=' + CUSTOM_OPTIONS._RwBf
    }
  }
  if (!cookie.includes('MUID=')) {
    if (CUSTOM_OPTIONS.MUID.length !== 0) {
      cookies += '; MUID=' + CUSTOM_OPTIONS.MUID
    }
  }
  if (!cookie.includes('_U=')) {
    if (CUSTOM_OPTIONS._U.length !== 0) {
      const _Us = CUSTOM_OPTIONS._U.split(',');
      cookies += '; _U=' + _Us[getRandomInt(0, _Us.length)];
    }
  }  
  const cookieStr = cookies;
  let cookieObjects = {};
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return;
    }
    const arr = item.split('=');
    const key = arr[0].trim();
    const val = arr.slice(1, arr.length+1).join('=').trim();
    cookieObjects[key] = val;
  })
  delete cookieObjects[RAND_IP_COOKIE_NAME];

  cookies = Object.keys(cookieObjects).map(key => key + '=' + cookieObjects[key]).join('; ');

  newHeaders.set('Cookie', cookies);
  const oldUA = request.headers.get('user-agent') || '';
  let isMobile = oldUA.includes('Mobile') || oldUA.includes('Android');
  if (isMobile) {
    newHeaders.set(
      'user-agent',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.7 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.410427012'
    );
  } else {
    newHeaders.set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.35');
  }

  return newHeaders;
}

      
/**
 * bingapi
 * @param {Request} request
 * @param {String} cookie
 * @returns
 */
const bingapi = async (request, cookie) => {
  if (!CUSTOM_OPTIONS.Go_Proxy_BingAI_BLANK_API_KEY && CUSTOM_OPTIONS.APIKEY == '') {
    CUSTOM_OPTIONS.APIKEY = 'sk-' + randomString(32);
  }
  const currentUrl = new URL(request.url);
  if ((currentUrl.pathname.startsWith('/v1/models/')) || (currentUrl.pathname.startsWith('/api/v1/models/'))) {
    return bingapiModel(request, Object.assign({ cookie: cookie }, CUSTOM_OPTIONS));
  }
  if (currentUrl.pathname.startsWith('/v1/models') || currentUrl.pathname.startsWith('/api/v1/models')) {
    return bingapiModels(request, Object.assign({ cookie: cookie }, CUSTOM_OPTIONS));
  }
  if (currentUrl.pathname.startsWith('/v1/chat/completions') || currentUrl.pathname.startsWith('/api/v1/chat/completions')) {
    if (request.method == 'OPTIONS') {
      return Response.json({ code: 200, message: 'OPTIONS', data: null }, {
        headers: {
          "Allow": "POST, OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
        }
      });
    }
    if (request.method != 'POST') {
      return Response.json({ code: 405, message: 'Method Not Allowed', data: null }, { status: 405 });
    }
    return bingapiChat(request, Object.assign({ cookie: cookie }, CUSTOM_OPTIONS));
  }
  if (currentUrl.pathname.startsWith('/v1/images/generations') || currentUrl.pathname.startsWith('/api/v1/images/generations')) {
    if (request.method == 'OPTIONS') {
      return Response.json({ code: 200, message: 'OPTIONS', data: null }, {
        headers: {
          "Allow": "POST, OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
        }
      });
    }
    if (request.method != 'POST') {
      return Response.json({ code: 405, message: 'Method Not Allowed', data: null }, { status: 405 });
    }
    return bingapiImage(request, Object.assign({ cookie: cookie }, CUSTOM_OPTIONS));
  }
  return Response.json({ code: 404, message: 'API No Found', data: null }, { status: 404 });
};

export async function onRequest(context) {
  const { request, env } = context;

  // 处理 CORS 请求
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  // 处理 WebSocket 请求
//  if (request.headers.get('Upgrade') === 'websocket') {
//    return handleWebSocket(request);
//  }

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
  let serverUrl = "https://prosydney.nbing.eu.org";
  const currentUrl = new URL(request.url);
  const fetchUrl = new URL(serverUrl + currentUrl.pathname + currentUrl.search);
  let serverRequest = new Request(fetchUrl, request);
  serverRequest.headers.set('origin', 'https://www.bing.com');
  serverRequest.headers.set('referer', 'https://www.bing.com/search?q=Bing+AI');
     const oldUA = request.headers.get('user-agent') || '';
    let isMobile = oldUA.includes('Mobile') || oldUA.includes('Android');
    if (isMobile = true) {
      newHeaders.set(
        'user-agent',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.7 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.410427012'
      );
    } else {
      newHeaders.set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.35');
    }

  const newRes = new Response(res.body, res);
  newRes.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
  newRes.headers.set('Access-Control-Allow-Credentials', 'true');
  newRes.headers.set('Access-Control-Allow-Headers', '*');
  newRes.headers.set('Access-Control-Allow-Origin', '*'); //允许所有域的访问

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
 const currentUrl = new URL(request.url);
    if (WEB_CONFIG.WORKER_URL == '') {
      WEB_CONFIG.WORKER_URL = currentUrl.origin;
    }
    // if (currentUrl.pathname === '/' || currentUrl.pathname.startsWith('/github/')) {
  //  if (currentUrl.pathname === '/') {
  //    return home(currentUrl.pathname);
  //  }
    if (currentUrl.pathname.startsWith('/sysconf')) {
      let isAuth = true;
      if (CUSTOM_OPTIONS.Go_Proxy_BingAI_AUTH_KEY.length !== 0) {
        const cookieStr = request.headers.get('Cookie') || '';
        let cookieObjects = {};
        cookieStr.split(';').forEach(item => {
          if (!item) {
            return;
          }
          const arr = item.split('=');
          const key = arr[0].trim();
          const val = arr.slice(1, arr.length+1).join('=').trim();
          cookieObjects[key] = val;
        })
        if (cookieObjects[AUTH_KEY_COOKIE_NAME] !== CUSTOM_OPTIONS.Go_Proxy_BingAI_AUTH_KEY) {
          isAuth = false;
        }
      }
      return Response.json({ code: 200, message: 'success', data: { isSysCK: false, isAuth: isAuth, info: CUSTOM_OPTIONS.INFO } })
    }

    let targetUrl;
    if (currentUrl.pathname.startsWith('/sydney')) {
      targetUrl = new URL(SYDNEY_PROXY + currentUrl.pathname + currentUrl.search);
    
    } else if (currentUrl.pathname.startsWith('/turing')) {
      targetUrl = new URL(BING_FREE + currentUrl.pathname + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/images/create')) {
      targetUrl = new URL(BING_ORIGIN + currentUrl.pathname + currentUrl.search);
    
    } else if (currentUrl.pathname.startsWith('/th')) {
      targetUrl = new URL(BING_SOURCE_ORIGIN + currentUrl.pathname.replaceAll('/th/th', '/th') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/edgesvc')) {
      targetUrl = new URL(EDGE_ORIGIN + currentUrl.pathname + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/opaluqu')) {
      targetUrl = new URL(BING_SR_ORIGIN + currentUrl.pathname + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer/')) {
      targetUrl = new URL(DESIGNER_ORIGIN + currentUrl.pathname.replaceAll('/designer/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer-cdn/')) {
      targetUrl = new URL(DESIGNER_CDN_ORIGIN + currentUrl.pathname.replaceAll('/designer-cdn/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer-app/')) {
      targetUrl = new URL(DESIGNER_APP_ORIGIN + currentUrl.pathname.replaceAll('/designer-app/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer-app-edog/')) {
      targetUrl = new URL(DESIGNER_APP_EDOG_ORIGIN + currentUrl.pathname.replaceAll('/designer-app-edog/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer-document/')) {
      targetUrl = new URL(DESIGNER_DOCUMENT_ORIGIN + currentUrl.pathname.replaceAll('/designer-document/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer-userassets/')) {
      targetUrl = new URL(DESIGNER_USERASSETS_ORIGIN + currentUrl.pathname.replaceAll('/designer-userassets/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer-mediasuggestion/')) {
      targetUrl = new URL(DESIGNER_MEDIASUGGESTION_ORIGIN + currentUrl.pathname.replaceAll('/designer-mediasuggestion/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer-rtc/')) {
      targetUrl = new URL(DESIGNER_RTC_ORIGIN + currentUrl.pathname.replaceAll('/designer-rtc/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/api/ms/login')) {
      targetUrl = new URL(CUSTOM_OPTIONS.BYPASS_SERVER + currentUrl.pathname + currentUrl.search);
    } else {
      targetUrl = new URL(BING_PROXY + currentUrl.pathname + currentUrl.search);
    }

    let newHeaders = processHeaders(request, targetUrl.host);
    let cookiesValue = newHeaders.get('Cookie');
 
    if (currentUrl.pathname.startsWith('/v1') || currentUrl.pathname.startsWith('/api/v1')) {
      return bingapi(request, cookiesValue);
    }
  
    if (currentUrl.pathname.startsWith('/fd/auth/signin')) {
      return login(currentUrl, newHeaders);
    }

    // newHeaders.forEach((value, key) => console.log(`${key} : ${value}`));
    const newReq = new Request(targetUrl, {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: 'manual',
    });

    // console.log('request url : ', newReq.url);
    const res = await fetch(newReq);
    const result = await rewriteBody(res);
    const newRes = new Response(result.body, res);
    let setCookies = res.headers.getAll('set-cookie')
    if (setCookies.length > 0) {
      newRes.headers.set('set-cookie', '')
      setCookies.forEach(v => {
        const tmp = v.split('; ')
        newRes.headers.append('set-cookie', tmp[0] + '; path=/')
      })
    }
    result.encoding && newRes.headers.set("Content-Encoding", result.encoding);
    newRes.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin'));
    newRes.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
    newRes.headers.set('Access-Control-Allow-Credentials', 'true');
    newRes.headers.set('Access-Control-Allow-Headers', '*');
    return newRes;
  }
