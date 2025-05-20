# Windows 10 风格个人主页

这是一个模拟Windows 10系统界面的个人主页项目，包含多个指向不同网站的桌面图标。

## 功能特点

- 逼真的Windows 10桌面界面
- 可点击的桌面图标，链接到您的各个网站
- 功能齐全的任务栏，包括开始菜单
- 搜索框（使用Bing搜索）
- 右键菜单
- 可拖拽的桌面图标
- 自动更新的时间和日期
- 响应式设计，适配各种屏幕尺寸

## 部署指南

### 方法一：使用Cloudflare Pages部署

1. 首先在GitHub上创建一个新仓库，并上传本项目的所有文件

2. 登录您的Cloudflare账户 (https://dash.cloudflare.com/)

3. 进入"Pages"部分

4. 点击"创建项目"

5. 选择"连接到Git"

6. 授权Cloudflare访问您的GitHub账户，然后选择包含本项目的仓库

7. 在部署设置中：
   - 构建设置：选择"无"（None）
   - 构建命令：留空
   - 构建输出目录：留空
   - Root directory：留空

8. 点击"保存并部署"

9. 等待部署完成后，Cloudflare会提供一个URL供访问您的个人主页

### 方法二：使用Cloudflare Workers部署

1. 登录您的Cloudflare账户

2. 进入"Workers"部分

3. 点击"创建Worker"

4. 在编辑界面中，使用以下代码（将内容替换为您的文件内容）：

```js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  if (url.pathname === '/' || url.pathname === '/index.html') {
    return new Response(`<!DOCTYPE html>
    <!-- 这里粘贴您的index.html内容 -->
    `, {
      headers: { 'Content-Type': 'text/html' },
    })
  } 
  else if (url.pathname === '/styles.css') {
    return new Response(`
    /* 这里粘贴您的styles.css内容 */
    `, {
      headers: { 'Content-Type': 'text/css' },
    })
  }
  else if (url.pathname === '/script.js') {
    return new Response(`
    // 这里粘贴您的script.js内容
    `, {
      headers: { 'Content-Type': 'application/javascript' },
    })
  }
  
  return new Response('Not Found', { status: 404 })
}
```

5. 点击"保存并部署"

6. 点击"触发器"，添加自定义域名（可选）

## 自定义指南

- 修改`index.html`中的图标和链接信息
- 在`styles.css`中自定义Windows 10界面样式
- 在`script.js`中添加更多交互功能

## 使用的技术

- HTML5
- CSS3
- JavaScript (ES6+)
- Font Awesome 图标库

## 许可证

MIT 