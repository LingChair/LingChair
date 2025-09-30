## TheWhiteSilk

這一個即時通訊項目————簡單, 輕量, 純粹, 時而天真

後續會考慮改名為月之鴿

### 目前*客戶端*實現了什麽?

* 消息
  * [x] 收發消息
  * [x] 富文本 (based on Marked)
    * [x] 圖片
    * [ ] 視頻
    * [ ] 文件
  * [ ] 撤回消息
  * [ ] 修改消息

* 對話
  * [ ] ***最近對話***
  * [x] 添加對話
    * [x] 添加用戶
    * [ ] 添加群組 (伺服器端群組都還沒做, 想什麽呢)

* 賬號
  * [x] 登錄注冊 (廢話)
  * [x] 資料編輯
    * [x] 用戶名
    * [x] 昵稱
    * [x] 頭像
  * [ ] 賬號管理
    * [ ] 重設密碼
    * [ ] 綁定郵箱

### 伺服器端運行

```bash
git clone https://codeberg.org/CrescentLeaf/TheWhiteSilk
cd TheWhiteSilk
# 編譯前端網頁
deno task build
# 運行服務
deno task server
```

### License

[MIT License](./license)
