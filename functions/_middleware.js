// pages/functions/_middleware.js

import { brotli_decode } from "./bjs.js"
const WEB_CONFIG = {
  WORKER_URL: '', // 如无特殊需求请，保持为''
};

async function fetchAndExtractVariableString(url = 'https://www.bing.com/chat?q=Microsoft+Copilot&FORM=hpcodx') {
  try {
    // 使用fetch API获取网页内容
    const response = await fetch(url);
    const htmlContent = await response.text();
    // 正则表达式匹配特定的data-ajaxResKey和变化的src属性
    // 注意：由于 HTML 可能包含换行符，我们使用 [\s\S]*? 来匹配任意字符，包括换行符
    const regex = /data-ajaxResKey="rms:answers:CodexBundle:cib-bundle"[\s\S]*?src="https:\/\/r\.bing\.com\/rp\/(.*?\.br\.js)"/;
    const match = htmlContent.match(regex);
    // 如果匹配成功，返回变化的字符串
    if (match) {
      return match[1];
    } else {
      console.log('No matching string found. Returning default string.');
      return "-Kc8IFliASxPpbk8y8d9exvjtdg"; // 返回的默认字符串不带引号
    }
  } catch (error) {
    console.error('Fetching failed:', error);
    return "-Kc8IFliASxPpbk8y8d9exvjtdg"; // 返回的默认字符串不带引号
  }
}

// 调用函数，如果不传入任何参数，它将使用默认的网页地址
// fetchAndExtractVariableString().then(matchedString => console.log(matchedString));


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
     // body = res.body;
        let bodyres = await replaceInResponseBody(body, "r.bing.com", WEB_CONFIG.WORKER_URL,res.headers); 
         bodyres = await replaceInResponseBody(bodyres.body, "sydney.bing.com", WEB_CONFIG.WORKER_URL,res.headers); 
        body = bodyres.body;
    } 
  return {body, encoding};
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
            const bodyres = await replaceInResponseBody(body, "sydney.bing.com", WEB_CONFIG.WORKER_URL,res.headers); 
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

if (uri.pathname.includes('/turing/')){
     uri.hostname = 'bing.cf03-b29.workers.dev';
     return fetch(new Request(uri.toString(), request));
}
// 如果请求的是 /chat 路径，则创建一个 blob 来加载 JavaScript 文件
// if (uri.pathname === '/chat') {
 
    // 获取原始 /chat 路径的内容
   uri.hostname = 'sokwith-proxybing.hf.space';
    const chatResponse = await fetch(new Request(uri.toString(), request));

  let newRes ;

  const cibname = await fetchAndExtractVariableString();
  console.log('CIB Name:', cibname);
  
//  let cibname;
//  fetchAndExtractVariableString()
//  .then(result => {
//    cibname = result; // 将结果赋值给cibname变量
//    console.log('CIB Name:', cibname); // 打印结果
//  })
//  .catch(error => {
//    console.error('Error:', error);
//  });

  
 
   if (uri.pathname.includes('/rp/-Kc8IFliASxPpbk8y8d9exvjtdg.br.js') && !uri.pathname.includes('/rp/lmu8EBCaPRMKtay8LSArGyY3mv4.br.js')) {
     const ovURL = 'https://r.bing.com/rp/-Kc8IFliASxPpbk8y8d9exvjtdg.br.js';
   const   jsResponse = await fetch(ovURL);
     const jsresult = await rewritejsBody(jsResponse);
    newRes = new Response(jsresult.body, {
      status: jsResponse.status,
      statusText: jsResponse.statusText,
      headers: jsResponse.headers
    });
    newRes.headers.set('content-type', 'application/javascript');
      return newRes;
    } else {
   const { body: modifiedBody, encoding } = await rewritetxtBody(chatResponse);
// 创建一个新的 Response 对象，包含原始响应的其他属性
    newRes = new Response(modifiedBody, {
      status: chatResponse.status,
      statusText: chatResponse.statusText,
      headers: chatResponse.headers,
    });
   }
// 设置其他需要的属性
newRes.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
newRes.headers.set('Access-Control-Allow-Credentials', 'true');
newRes.headers.set('Access-Control-Allow-Headers', '*');

// 添加其他自定义属性
//newRes.headers.set('Custom-Header', 'Custom Value');

// 返回新的 Response 对象
return newRes;

//  } else {
    // 如果不是，执行原有的加载逻辑
//    uri.hostname = 'sokwith-proxybing.hf.space';
//    return fetch(new Request(uri.toString(), request));
//  }
}
