## 代理NewBing 官方站点 www.bing.com
## 部署在 cf pages上

# 目前遗留问题：
~~1. 核心CIB js文件 CodexBundle:cib-bundle 名的获取错误，采用一般fetch（）不能获得动态加载的数据；目前采用硬编码，需要在官方更改后跟随手工修正；~~
2. 画图错误，CIB没有触发 /image/create；
3. /search？触发后CIBjs的改写的chatHub失效，被引流回官方sydney了。
