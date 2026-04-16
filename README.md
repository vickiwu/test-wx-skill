# test-wx-skill

这是一个用于验证 `wx-native-builder` Skill 的微信小程序示例项目（TypeScript 模板）。

## 效果展示

![打卡小助手效果展示](img/video-small.gif)

项目当前包含一个简单的打卡小助手，具备以下页面：
- 首页：展示目标、执行打卡、跳转创建与历史
- 创建页：新增打卡目标
- 历史页：查看近 7 天打卡状态与累计数据

## 验证目标

通过这个项目验证 `wx-native-builder` 是否能稳定完成以下任务：
- 理解微信小程序原生目录结构（`miniprogram/`）
- 正确修改 `json / wxml / wxss / ts` 四类文件
- 新增页面并完成路由注册（`app.json`）
- 不破坏现有页面功能（创建、打卡、历史）
- 输出可在微信开发者工具中直接运行的结果

## 环境准备

1. 安装微信开发者工具（稳定版）
2. 打开本项目根目录：`test-wx-skill`
3. 在微信开发者工具中配置自己的 `AppID`（或使用测试号）
4. 确认项目配置中的小程序目录为 `miniprogram/`

> 当前 `project.config.json` 中 `appid` 为占位值：`your AppID`，实际验证时请替换。

## 基础运行验证

1. 导入项目后直接编译
2. 确认页面可正常打开：
   - `/pages/index/index`
   - `/pages/create/index`
   - `/pages/history/index`（通过首页按钮进入）
3. 执行一轮手工测试：
   - 新建一个目标
   - 在首页点击“打卡”
   - 进入历史页查看本周与最近 7 天记录是否更新

如果以上步骤都通过，说明基线项目可用于 Skill 验证。

## `wx-native-builder` 验证流程（建议）

以下流程用于验证 Skill 在真实开发动作中的表现。

### Step 1：新增页面能力

让 Skill 完成：
- 新增页面（例如：`pages/stats/index`）
- 创建对应的 `index.json / index.wxml / index.wxss / index.ts`
- 在 `miniprogram/app.json` 注册路由
- 在首页增加跳转入口

验收标准：
- 编译无报错
- 页面可访问
- 导航逻辑正常

### Step 2：改造现有业务能力

让 Skill 完成：
- 在首页增加“连续打卡天数排行”或“今日完成数”展示
- 保持本地存储结构兼容（`goals`）
- 不影响原有打卡逻辑

验收标准：
- 原功能正常（创建、打卡、历史）
- 新增展示数据正确
- 代码结构清晰，可读性良好

### Step 3：样式与交互能力

让 Skill 完成：
- 对首页或创建页进行 UI 微调
- 增加空态、按钮禁用态、提示文案优化等细节

验收标准：
- 样式修改仅影响目标页面
- 不出现布局错乱
- 交互反馈清晰（Toast/禁用态/跳转）

## 回归检查清单

每次 Skill 改动后建议按以下顺序回归：

- [ ] `app.json` 路由配置正确
- [ ] 新增页面四件套文件齐全（`json/wxml/wxss/ts`）
- [ ] 微信开发者工具编译通过
- [ ] 首页可加载目标列表
- [ ] 创建目标成功并回跳
- [ ] 当日重复打卡不会重复计数
- [ ] 历史页最近 7 天记录展示正确

## 建议的评估维度

给 `wx-native-builder` 做阶段性评估时，可使用以下维度打分（1-5 分）：
- 需求理解准确性
- 文件修改完整性
- 原生小程序规范符合度
- 代码可维护性
- 回归稳定性

## 项目结构（简版）

```text
test-wx-skill/
├── miniprogram/
│   ├── app.json
│   ├── app.ts
│   ├── app.wxss
│   └── pages/
│       ├── index/
│       ├── create/
│       ├── history/
│       └── logs/
├── project.config.json
├── tsconfig.json
└── package.json
```

---

如果你要把这个仓库作为长期回归样例，建议后续补充：
- 一份固定的“Skill 指令集”（同一批 prompt 反复测试）
- 一份“预期结果快照”（页面截图或关键代码片段）
- 一份“版本对比记录”（不同 Skill 版本通过率）
