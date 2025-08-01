import { DatabaseSync } from "node:sqlite"
import fs from 'node:fs/promises'

await fs.mkdir('data', { recursive: true })

const db = new DatabaseSync("data/users.db")
const TABEL_NAME = "Users"

// 初始化表格
db.exec(
  `
    CREATE TABLE IF NOT EXISTS ${TABEL_NAME} (
      /* 伺服器中 ID */ id INTEGER PRIMARY KEY AUTOINCREMENT,
      /* 用戶名, 可選 */ username TEXT,
      /* 姓名 */ nickname TEXT NOT NULL,
      /* 头像, 可选 */ avatar BLOB
    );
  `,
)

// 插入测试数据
db.prepare(
  `
    INSERT INTO ${TABEL_NAME} (username, nickname, avatar) VALUES (?, ?, ?);
  `,
).run("SisterWen", "文姐", await fs.readFile('in.webp'))

let rows = db.prepare(`SELECT id, username, nickname, avatar FROM ${TABEL_NAME}`).all();
for (const row of rows) {
  console.log(row)
}

// 更新用户名
// 用户名要合规, 以免导致 SQL 注入！
db.prepare(
  `
    UPDATE ${TABEL_NAME} SET username = '${ "Sister_Wen" }' WHERE ${ "username" } = ${ "'SisterWen'" };
  `,
).run()

rows = db.prepare(`SELECT id, username, nickname, avatar FROM ${TABEL_NAME}`).all();
for (const row of rows) {
    console.log(row)
    await fs.writeFile('out.webp', row.avatar)
}

db.close()
