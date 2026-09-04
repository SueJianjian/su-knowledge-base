# 私藏 · 个人知识库

这是一个可安装到 Windows 的本地个人知识库。它适合先快速收集想法，再按主题和标签慢慢整理。

## 构建 Windows 安装包

需要安装 Node.js、Rust 和 WebView2。首次执行：

```bash
npm install
npm run build
```

安装包会生成在 `src-tauri/target/release/bundle/nsis/`。

程序数据仍会保存在本机，不会上传网络；建议同时使用应用内的导出备份功能保存到外部磁盘。

## 使用方式

直接用浏览器打开 [index.html](./index.html) 即可使用。

支持的功能：

- 按「工作与项目」「阅读摘录」「生活观察」「灵感碎片」分类
- 搜索标题、正文和标签
- 标签筛选
- 新增、编辑、删除和置顶笔记
- 使用 `N` 快速打开新增窗口
- 使用 `⌘ K`（Windows 也支持 `Ctrl K`）聚焦搜索
- 使用 `⌘ Enter`（Windows 也支持 `Ctrl Enter`）保存笔记
- 导出 JSON 备份，或从 JSON 恢复

## 数据位置

笔记默认保存在当前浏览器的 `localStorage` 中，不会自动上传到网络。建议定期点击左下角的「导出备份」，把 JSON 文件保存到安全位置。

## 后续可以扩展

- 增加 Markdown 编辑与预览
- 增加双向链接和知识图谱
- 增加图片、附件或网页剪藏
- 接入 SQLite、Notion 或其他同步服务
