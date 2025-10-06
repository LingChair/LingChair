<div align="center">
  <img style="width: 128px; height: 128px;" src="./icon.png" alt="logo" />
  <h1> 铃之椅 </h1>
</div>

---

铃之椅, 一个普通的即时通讯项目——简单, 轻量, 纯粹, 时而天真

*目前还没有发布正式版本, 仍在积极开发中*

项目代号: TheWhiteSilk

### 基本功能

<details>
  <summary>客户端</summary>

- 消息
  - [x] 收发消息
  - [x] 富文本 (based on Marked)
    - [x] 图片
    - [x] 视频
    - [x] 文件
    - [ ] 测试其他 Markdown 语法的可用性
  - [ ] 撤回消息
  - [ ] 修改消息

- 对话
  - [x] 最近对话
  - [x] 添加对话
    - [x] 添加用户
    - [x] 添加群组
  - [ ] 群组管理

- 帐号
  - [x] 登录注册
  - [x] 资料编辑
    - [x] 用户名
    - [x] 昵称
    - [x] 头像
  - [ ] 帐号管理
    - [ ] 重设密码
    - [ ] 绑定邮箱

</details>

<details>
  <summary>服务端</summary>

- 基本对话类型
  - [x] 私聊
  - [x] 群组

- 消息
  - [x] 收发消息
  - [ ] 撤回消息
  - [ ] 修改消息

- 对话
  - [x] 最近对话
  - [x] 添加对话

- 帐号
  - [x] 登录注册
  - [x] 资料编辑
  - [ ] 帐号管理
    - [ ] 重设密码
    - [ ] 绑定邮箱

</details>

### 快速上手

```bash
git clone https://codeberg.org/CrescentLeaf/LingChair
cd LingChair
# 编译前端
deno task build
# 运行服务
deno task server
```

#### 配置

[thewhitesilk_config.json 是什么?](./server/config.ts)

### 使用的项目 / 技术栈

本项目由 Deno 强力驱动 

*当然, 由于没有使用 Deno Api, 只有 Node Api, 因此理论上 Node.js 也能运行, 但需要另外安装依赖*

- 前端
  - 编译
    - vite
    - vite-plugin-babel
  - react
  - socket.io-client
  - mdui
  - split.js
  - react-json-view
  - dompurify
  - marked

- 后端
  - express
  - socket.io
  - chalk
  - file-type
  - cookie-parser

### License

[MIT License](./license)
