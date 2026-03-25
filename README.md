# LeetCode Copy Markdown

## 功能
LeetCode Copy Markdown 是一款浏览器插件，帮助用户将力扣网站上的题目转化为 markdown 格式保存下来。
- 新增悬浮按钮功能，支持一键复制题目内容到剪贴板
- 按钮位于页面右下角，点击后自动转换并复制Markdown格式内容
- 提供复制成功/失败的视觉反馈
## 安装
将本项目下载到本地，解压后在浏览器扩展页面选择`加载解压缩的扩展`。
## 目标
- [x] 优化一些符号、行内代码块、强调、引用的 markdown 格式转换
- [ ] 优化popup界面的显示
- [x] 优化转化后的题目没有标题的问题
- [x] 更新icon
- [x] 修复数学公式的转换
- [x] 添加悬浮按钮，支持一键复制Markdown到剪贴板
## 参考文档
- [Microsoft Edge 扩展](https://learn.microsoft.com/zh-cn/microsoft-edge/extensions-chromium/)
## 依赖
- [turndown](https://github.com/mixmark-io/turndown)