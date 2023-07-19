# chat-page

## 简介

简易局域网聊天小组，无依赖包，Node 直接运行

## 使用

1. Copy 一份 `config.default.json` 到 `config.json`

2. 添加对应的用户到 `config.json` 中的 `users` 字段，其中 `code` 为可使用 `btoa(Math.random())` 随机生成的 token

3. 启动服务 `node server.js`

4. 分发服务地址和 token `user.code` 给目标用户

5. 访问地址，并将光标移到左下角，粘贴 token

## 配置

- `config.log` 是否启用本地日志写入，将会写入文件 `chat.log`
- `config.maxMinutes` `[POST] /chat` 接口返回的最新时间范围（分钟）
