import fs from 'node:fs/promises'
import chalk from 'chalk'

let config = {
    data_path: "./thewhitesilk_data"
}

try {
    config = JSON.parse(await fs.readFile('thewhitesilk_config.json'))
} catch (_e) {
    console.log(chalk.yellow("配置文件貌似不存在, 正在创建..."))
    await fs.writeFile('thewhitesilk_config.json', JSON.stringify(config))
}

await fs.mkdir(config.data_path, { recursive: true })

export default config
