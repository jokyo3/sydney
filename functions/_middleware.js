
// pages/functions/_middleware.js

import { brotli_decode } from "./bjs.js"
const WEB_CONFIG = {
  WORKER_URL: '', // 如无特殊需求请，保持为''
};

function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function fetchAndExtractVariableString(url = 'https://nagse-bingcib.hf.space') {
  try {
    // 使用fetch API获取网页内容
    const response = await fetch(url);
    const htmlContent = await response.text();

    // 检查响应内容中是否包含 '.br.js'
    if (htmlContent.includes('.br.js')) {
      return htmlContent; // 如果包含，返回整个响应内容
    } else {
      // 如果不包含，返回指定的字符串
      return "-Kc8IFliASxPpbk8y8d9exvjtdg"; // 返回的默认字符串不带引号
    }
  } catch (error) {
    // 如果请求失败，返回指定的字符串
    return "-Kc8IFliASxPpbk8y8d9exvjtdg"; // 返回的默认字符串不带引号
  }
}


async function replaceInResponseBody(resBody, originalString, replacementString, headers) {
  // 首先，将 ReadableStream 转换为 ArrayBuffer
  const buffer = await new Response(resBody).arrayBuffer();
  // 然后，将 ArrayBuffer 转换为字符串
  const bodyString = new TextDecoder("utf-8").decode(buffer);
  // 执行替换操作
  const replacedString = bodyString.replace(new RegExp(originalString, 'g'), replacementString);
  // 将替换后的字符串转换回 ReadableStream
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(replacedString));
      controller.close();
    }
  });
  // 创建一个新的 Response 对象并返回
  return new Response(stream, { headers });
}



const rewritetxtBody = async (res) => {
    const content_type = res.headers.get("Content-Type") || "";
    const content_encoding = res.headers.get("Content-Encoding") || "";
    let encoding = null;
    let body = res.body;
    if (content_type.startsWith("text/html")) {
    let bodyres = await replaceInResponseBody(body, "sydney.bing.com", WEB_CONFIG.WORKER_URL,res.headers); 
       bodyres = await replaceInResponseBody(bodyres.body, "r.bing.com", WEB_CONFIG.WORKER_URL,res.headers); 
     //  bodyres = await replaceInResponseBody(bodyres.body, "CodexBundle:cib-bundle\" src=\"https://r.bing.com", "CodexBundle:cib-bundle\" src=\"https://" + WEB_CONFIG.WORKER_URL, res.headers);
       bodyres = await replaceInResponseBody(bodyres.body, "th.bing.com", WEB_CONFIG.WORKER_URL,res.headers); 
      body = bodyres.body;
      return {body, encoding};  
      } 
  return {body, content_encoding};
}


const rewritejsBody = async (res) => {
    const content_type = res.headers.get("Content-Type") || "";
    const content_encoding = res.headers.get("Content-Encoding") || "";
    let encoding = null;
    let body = res.body;
    if (content_type.startsWith("text/html")) {
      body = res.body;
    } else if (res.url.endsWith("js")) {
      if (res.url.includes('/rp/')) {
        let decodedContent = null;
        if (content_encoding == 'br') {
          decodedContent = new TextDecoder("utf-8").decode(brotli_decode(new Int8Array(await res.clone().arrayBuffer())));
          encoding = 'gzip';
        } else {
          decodedContent = new TextDecoder("utf-8").decode(new Int8Array(await res.clone().arrayBuffer()));
        }
        if (decodedContent) {
          // @ts-ignore
          body = decodedContent.replaceAll("www.bing.com", WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", ""));
            let bodyres = await replaceInResponseBody(body, "sydney.bing.com", WEB_CONFIG.WORKER_URL,res.headers); 
              bodyres = await replaceInResponseBody(bodyres.body, "r.bing.com", WEB_CONFIG.WORKER_URL,res.headers); 
            body = bodyres.body;
        }
      }
    }
  return {body, encoding};
}


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
  let uri = new URL(request.url);
     if (WEB_CONFIG.WORKER_URL == '') {
      WEB_CONFIG.WORKER_URL = uri.hostname;
    }

  const cibname = await fetchAndExtractVariableString('https://getbingcibname.pages.dev/GET');
  const ciburl = '/rp/' + cibname ;

if (uri.pathname.includes('/turing/conversation/')){  
     uri.hostname = 'free.nbing.eu.org';
     return fetch(new Request(uri.toString(), request));
}
//  if (uri.pathname.startsWith('/sydney/')){  
//     uri.hostname = 'sydney.bing.com';
//     return fetch(new Request(uri.toString(), request));
}
 if (uri.pathname.startsWith('/designer/')) {
       uri.hostname = 'designer.microsoft.com';
     return fetch(new Request(uri.toString(), request));
}
  if (uri.pathname.startsWith('/th')) {
       uri.hostname = 'th.bing.com';
     return fetch(new Request(uri.toString(), request));
}
    if (uri.pathname.startsWith('/opaluqu')) {
       uri.hostname = 'sr.bing.com';
     return fetch(new Request(uri.toString(), request));
}  
    if (uri.pathname.startsWith('/edgesvc')) {
       uri.hostname = 'edgeservices.bing.com';
     return fetch(new Request(uri.toString(), request));
}
    if (uri.pathname.startsWith('/rewardsapp/')) {
      await fetch('https://getbingcibname.pages.dev/PUT');
       uri.hostname = 'edgeservices.bing.com';
     return fetch(new Request(uri.toString(), request));
}
  
    // 获取原始路径的内容
   uri.hostname = 'sokwith-proxybing.hf.space';
    const chatResponse = await fetch(new Request(uri.toString(), request));
  let newRes ;
 
  if (uri.pathname.includes(ciburl)   && !uri.pathname.includes('rp/wAMGEgzu6dXMQl4NYW_4fU74uOk.br.js')){
   const ovURL = 'https://r.bing.com' + ciburl;
  //  const ovURL = 'https://raw.githubusercontent.com/SokWith/webbing/main/rp/-Kc8IFliASxPpbk8y8d9exvjtdg.br.js';
     const jsResponse = await fetch(ovURL);
     const jsresult = await rewritejsBody(jsResponse);
     newRes = new Response(jsresult.body, {
     status: jsResponse.status,
      statusText: jsResponse.statusText,
     headers: jsResponse.headers
    });
    newRes.headers.set('content-type', 'application/javascript');
          return newRes;
   } 
  
   const { body: modifiedBody, encoding } = await rewritetxtBody(chatResponse);
// 创建一个新的 Response 对象，包含原始响应的其他属性
    newRes = new Response(modifiedBody, {
      status: chatResponse.status,
      statusText: chatResponse.statusText,
      headers: chatResponse.headers,
    });
 
// 设置其他需要的属性
newRes.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
newRes.headers.set('Access-Control-Allow-Credentials', 'true');
newRes.headers.set('Access-Control-Allow-Headers', '*');
newRes.headers.set('Access-Control-Allow-Origin', '*'); //允许所有域的访问
newRes.headers.set('CIBurl', cibname);

      
// 返回新的 Response 对象
return newRes;
}
