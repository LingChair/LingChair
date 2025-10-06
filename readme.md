## 铃之椅

一个即时通讯项目——简单, 轻量, 纯粹, 时而天真

_仍在积极开发中. 目前是第四代, 版本代号为: the_white_silk_

### 目前實現了什麽?

<details>
  <summary>客戶端實現</summary>

- 消息
  - [x] 收發消息
  - [x] 富文本 (based on Marked)
    - [x] 圖片
    - [x] 視頻
    - [x] 文件
  - [ ] 撤回消息
  - [ ] 修改消息

- 對話
  - [x] 最近對話
  - [x] 添加對話
    - [x] 添加用戶
    - [x] 添加群組
  - [ ] 群组管理

- 賬號
  - [x] 登錄注冊 (廢話)
  - [x] 資料編輯
    - [x] 用戶名
    - [x] 昵稱
    - [x] 頭像
  - [ ] 賬號管理
    - [ ] 重設密碼
    - [ ] 綁定郵箱

</details>

<details>
  <summary>伺服器端實現</summary>

- 基本對話類型
  - [x] 雙用戶私聊
  - [x] 群組

- 消息
  - [x] 收發消息
  - [ ] 撤回消息
  - [ ] 修改消息

- 對話
  - [x] 最近對話
  - [x] 添加對話

- 賬號
  - [x] 登錄注冊
  - [x] 資料編輯
  - [ ] 賬號管理
    - [ ] 重設密碼
    - [ ] 綁定郵箱

</details>

### 伺服器端運行

```bash
git clone https://codeberg.org/LingChair/LingChair
cd LingChair
# 編譯前端網頁
deno task build
# 運行服務
deno task server
```

#### 配置

[thewhitesilk_config.json 是怎麽來的, 又有什麽用?](./server/config.ts)

### License

[MIT License](./license)
