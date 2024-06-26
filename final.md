### 最终目标

铃之椅服务端的 Node 实现，目前最低目标如下

* 全 API 可用
* 可配置
* 开箱即用

如果有时间，可以完成下面的目标

* 尽可能使用异步
* 最大利用 I/O 性能

#### API 实现

一般约定: ☘️=已完成

* 用户
    * 登录 ☘️
    * 注册 ☘️
    * 修改密码
    * 令牌机制 ☘️
    * 用户资料
        * 头像 ☘️
        * 昵称 ☘️
    * 安全
        * 账号冻结
        * 权限管理
        * 匿名

* 聊天
    * 双方私聊 ☘️ 完善中
    * 多人群聊
    * 临时对话
    * 多媒体
    * 文件
    * 群聊资料
        * 介绍
        * 头像
        * 群名称
    * 安全
        * 权限管理
            * 管理员
            * 入群权限
            * 可否被查找
            * 功能限制
            * 管理匿名

注:
    1. 为了保障管理员层安全，匿名的账号或管理员的信息仍然能被伺服器管理员所查询，不过请放心，一般来说不会有任何正常人能查询到你
    2. 多媒体应该能够定时删除而非永久保存，否则伺服器会炸掉的
    3. 每个功能都应该验证令牌
