# Windows 10 风格个人主页

这是一个模拟Windows 10系统界面的个人主页项目，包含多个指向不同网站的桌面图标。

## 功能特点

- Windows 10桌面界面
- 可点击的桌面图标，链接到您的各个网站
- 功能齐全的任务栏，包括开始菜单
- 搜索框（使用Bing搜索）
- 右键菜单
- 可拖拽的桌面图标
- 自动更新的时间和日期
- 响应式设计，适配各种屏幕尺寸

## 部署指南

### 方法一：使用Cloudflare Pages部署

1. 右上角fork本项目

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
