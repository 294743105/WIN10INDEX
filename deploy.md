# Windows 10 风格个人主页部署指南

## 项目文件清单

确保您的项目包含以下文件：

- `index.html` - 主页面文件
- `styles.css` - 样式文件
- `script.js` - JavaScript 脚本文件
- `README.md` - 项目说明文档

## 部署到 Cloudflare Pages 的步骤

### 方法一：通过 GitHub 部署

1. 首先将代码上传到 GitHub：

```bash
# 创建本地 Git 仓库
git init
git add .
git commit -m "初始提交"

# 推送到 GitHub
git remote add origin https://github.com/您的用户名/您的仓库名.git
git push -u origin main
```

2. 登录 Cloudflare 账户：https://dash.cloudflare.com/

3. 进入 "Pages" 部分，点击 "创建项目"

4. 选择 "连接到 Git"，授权访问您的 GitHub 账户

5. 选择包含本项目的仓库

6. 配置构建设置：
   - 构建命令：留空
   - 构建输出目录：留空
   - 环境变量：无需添加

7. 点击 "保存并部署"，等待部署完成

### 方法二：直接上传文件

1. 登录 Cloudflare 账户

2. 进入 "Pages" 部分，点击 "创建项目"

3. 选择 "直接上传"

4. 将项目文件（index.html, styles.css, script.js）拖放到上传区域

5. 点击 "部署站点"

### 方法三：通过 Cloudflare Workers 部署

1. 登录 Cloudflare 账户

2. 进入 "Workers & Pages"

3. 点击 "创建应用程序"

4. 选择 "创建 Worker"

5. 在编辑器中粘贴以下代码（需要替换文件内容）：

```js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  if (url.pathname === '/' || url.pathname === '/index.html') {
    return new Response(`
    <!DOCTYPE html>
    <!-- 这里粘贴您的 index.html 内容 -->
    `, {
      headers: { 'Content-Type': 'text/html' },
    })
  } 
  else if (url.pathname === '/styles.css') {
    return new Response(`
    /* 这里粘贴您的 styles.css 内容 */
    `, {
      headers: { 'Content-Type': 'text/css' },
    })
  }
  else if (url.pathname === '/script.js') {
    return new Response(`
    // 这里粘贴您的 script.js 内容
    `, {
      headers: { 'Content-Type': 'application/javascript' },
    })
  }
  
  return new Response('Not Found', { status: 404 })
}
```

6. 点击 "保存并部署"

7. 选择自定义域名（可选）

## 自定义域名设置

部署成功后，您可以为您的页面添加自定义域名：

1. 在 Pages 项目中，点击 "自定义域"

2. 点击 "设置自定义域"

3. 输入您的域名，然后按照指示配置 DNS 记录

4. 验证域名所有权后，您的网站将通过该域名访问

## 验证部署

部署完成后：

1. 访问 Cloudflare 提供的 URL 或您的自定义域名

2. 确认所有功能正常工作：
   - 桌面图标可点击并跳转到正确的链接
   - 开始菜单可以打开和关闭
   - 设置面板功能正常
   - 搜索框可以正常使用
   - 右键菜单显示正确

如果发现任何问题，您可以在 Cloudflare Pages 仪表板中查看构建日志和部署详情。

## 故障排除

如果您遇到问题：

1. **样式或脚本未加载**：检查文件路径是否正确，确认 CSS 和 JS 文件已正确上传

2. **页面交互不正常**：打开浏览器开发者工具，查看控制台是否有错误信息

3. **图标不显示**：确认 Font Awesome 库是否成功加载（检查网络连接）

4. **图片背景加载失败**：picsum.photos 服务可能暂时不可用，可以考虑使用其他图片源 