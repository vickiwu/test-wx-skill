# 微信小程序原生开发规范细则

## 目录

- [单位规范（rpx）](#单位规范rpx)
- [禁用标签完整映射表](#禁用标签完整映射表)
- [禁用语法：React / Vue 写法](#禁用语法react--vue-写法)
- [生命周期规范](#生命周期规范)
- [JSON 配置规范](#json-配置规范)
- [事件绑定规范](#事件绑定规范)
- [数据绑定规范](#数据绑定规范)
- [图片规范](#图片规范)
- [导航跳转规范](#导航跳转规范)
- [边界与例外](#边界与例外)

---

## 单位规范（rpx）

基准：iPhone 6（750px 物理宽度），设计稿 1px = 1rpx。

**必须用 `rpx` 的场景**

- 宽度、高度、内外边距
- 字体大小、行高
- 圆角、图标尺寸
- `border-radius`

**允许用 `px` 的例外**

- `border: 1px solid #eee`（hairline 细线，用 rpx 在高清屏会变粗）

**允许用 `%` 的例外**

- 全屏容器：`width: 100%`、`height: 100%`、`min-height: 100vh`

**禁止使用**

- `rem`（小程序根字体不可靠）
- `em`（相对父级，行为不稳定）
- `vw` / `vh`（仅 `100vh` 用于全屏背景时例外）

---

## 禁用标签完整映射表

| 禁止（HTML / Web） | 必须替换为（小程序原生） | 说明 |
| :--- | :--- | :--- |
| `<div>` `<section>` `<article>` `<main>` `<header>` `<footer>` | `<view>` | 通用容器 |
| `<span>` `<i>` `<em>` `<strong>` `<b>` `<label>` | `<text>` | 行内文本；只有 `text` 标签内的文字可被长按选中 |
| `<p>` | `<view>` 或 `<text>` | 段落文本 |
| `<img>` | `<image>` | 图片；需设置 `mode` 属性控制裁剪方式 |
| `<a>` `<link>` | `<navigator>` | 页面跳转 |
| `<input type="button">` `<button type="...">` | `<button>` | 按钮；open-type 支持授权/分享/客服等 |
| `<ul>` `<ol>` `<li>` | `<view>` + `wx:for` | 列表 |
| `<form>` | `<form>` ✅ | 小程序有原生 `form` 组件，此处可以保留 |
| `<textarea>` | `<textarea>` ✅ | 小程序有原生 `textarea`，可以保留 |
| `<select>` | `<picker>` | 下拉选择 |
| `<video>` | `<video>` ✅ | 小程序有原生 `video`，可以保留 |
| `<audio>` | 使用 `wx.createInnerAudioContext()` | 用 API 控制，不用标签 |

---

## 禁用语法：React / Vue 写法

以下写法在小程序中无效，遇到必须转换：

| 禁止（React / Vue） | 替换为（小程序原生） |
| :--- | :--- |
| `className="foo"` | `class="foo"` |
| `onClick={handler}` | `bind:tap="handler"` |
| `onChange={handler}` | `bind:input="handler"` 或 `bind:change="handler"` |
| `style={{ color: 'red' }}` | `style="color: red;"` 或 `wxss` 类 |
| `{condition && <View />}` | `wx:if="{{condition}}"` |
| `{list.map(item => ...)}` | `wx:for="{{list}}" wx:key="id"` |
| `import React from 'react'` | 删除 |
| `export default function Page()` | `Page({ ... })` |
| `useState` / `useEffect` | `data` + `setData` / 生命周期方法 |
| `props.xxx` | `this.properties.xxx` 或 `this.data.xxx` |
| `this.setState({ })` | `this.setData({ })` |

---

## 生命周期规范

### Page

```
onLoad(options)      必须 - 接收路由参数、初始化请求
onShow()             必须 - 每次显示时刷新（如 tabBar 页）
onShareAppMessage()  必须 - 防止页面无法被转发分享
onUnload()           建议 - 清理定时器、取消订阅
onPullDownRefresh()  按需 - 需在 JSON 中开启 enablePullDownRefresh: true
onReachBottom()      按需 - 上拉加载更多
onPageScroll()       慎用 - 频繁触发，避免在内部执行 setData
```

### Component

```
lifetimes.created()   按需  - 组件实例刚创建，不能访问 DOM
lifetimes.attached()  必须  - 进入节点树，可初始化数据和定时器
lifetimes.detached()  必须  - 离开节点树，必须清理定时器和事件监听
pageLifetimes.show()  按需  - 所在页面被展示
pageLifetimes.hide()  按需  - 所在页面被隐藏
```

---

## JSON 配置规范

### 页面 JSON 最小配置

```json
{
  "navigationBarTitleText": "页面标题",
  "navigationBarBackgroundColor": "#ffffff",
  "navigationBarTextStyle": "black",
  "enablePullDownRefresh": false,
  "usingComponents": {}
}
```

### 常用扩展字段

```json
{
  "backgroundTextStyle": "light",
  "backgroundColor": "#f5f5f5",
  "disableScroll": false,
  "onReachBottomDistance": 50
}
```

### 组件 JSON 必须字段

```json
{
  "component": true,
  "usingComponents": {}
}
```

**规则**：
- `navigationBarTitleText` 不能为 `""` 空字符串或留占位注释，必须填写实际业务标题
- `usingComponents` 即使为空也必须保留该字段
- `navigationBarTextStyle` 只接受 `"black"` 或 `"white"`（对应导航栏文字颜色）

---

## 事件绑定规范

| 用途 | 写法 | 说明 |
| :--- | :--- | :--- |
| 普通点击 | `bind:tap="handler"` | 事件会冒泡 |
| 阻止冒泡的点击 | `catch:tap="handler"` | 阻止事件向上冒泡 |
| 输入事件 | `bind:input="handler"` | 实时输入 |
| 表单提交 | `bind:submit="handler"` | 配合 `<form>` 使用 |
| 自定义组件事件 | `bind:customEvent="handler"` | 组件 triggerEvent 触发 |

事件处理函数接收 `WechatMiniprogram.TouchEvent` 参数，通过 `e.currentTarget.dataset` 获取数据：

```xml
<view bind:tap="onTap" data-id="{{item.id}}" data-name="{{item.name}}">
```

```typescript
onTap(e: WechatMiniprogram.TouchEvent) {
  const { id, name } = e.currentTarget.dataset
}
```

---

## 数据绑定规范

- 变量用双大括号：`{{variable}}`
- 属性绑定：`class="item {{active ? 'active' : ''}}"`
- 禁止模板字符串：`` `:path/${id}` `` 应改为 `'/path/' + id`
- `wx:for` 必须同时设置 `wx:key`，优先用唯一字段（如 `id`），次选 `index`
- `wx:for` 默认变量名为 `item`，嵌套循环必须用 `wx:for-item` 自定义以避免命名冲突：

```xml
<view wx:for="{{groups}}" wx:key="id" wx:for-item="group">
  <view wx:for="{{group.items}}" wx:key="id" wx:for-item="item">
    <text>{{item.name}}</text>
  </view>
</view>
```

---

## 图片规范

- 使用 `<image>` 组件，必须显式设置 `mode`：

| mode | 效果 |
| :--- | :--- |
| `aspectFill` | 等比裁剪填满（最常用）|
| `aspectRatio` | 等比缩放不裁剪 |
| `widthFix` | 宽度固定，高度自适应 |
| `scaleToFill` | 拉伸填满（变形） |

- 建议添加 `lazy-load` 属性开启懒加载：`<image lazy-load src="{{url}}" mode="aspectFill" />`
- 必须设置宽高，否则默认 `320×240rpx` 会导致布局异常

---

## 导航跳转规范

| 场景 | 方法 | 说明 |
| :--- | :--- | :--- |
| 普通跳转（可返回） | `wx.navigateTo` | 保留当前页入栈 |
| 跳转并替换当前页 | `wx.redirectTo` | 不可返回 |
| 跳转到 tabBar 页 | `wx.switchTab` | 只能跳 tabBar |
| 返回上一页 | `wx.navigateBack` | `delta` 控制返回层数 |
| 关闭所有页跳转 | `wx.reLaunch` | 清空页面栈 |

WXML 内跳转用 `<navigator>`：

```xml
<navigator url="/pages/detail/index?id={{item.id}}" hover-class="nav-hover">
  <text>查看详情</text>
</navigator>
```

---

## 边界与例外

### 允许使用 `1px` 的场景

细线边框在高清屏上用 `rpx` 会显示为 `2rpx`，使用 `1px` 更精确：

```css
.divider {
  border-bottom: 1px solid #eeeeee;
}
```

### 全屏布局允许 `%` 和 `vh`

```css
.full-page {
  width: 100%;
  min-height: 100vh;
}
```

### `setData` 性能注意事项

- 不要在 `onPageScroll` 内频繁调用 `setData`
- 不要 `setData` 整个大数组，只更新变化的字段：

```typescript
// 不好
this.setData({ list: newList })

// 好（只更新某一项）
this.setData({ [`list[${index}].read`]: true })
```

### 条件渲染 vs 隐藏

- `wx:if`：条件为 `false` 时从 DOM 中移除，适合初始不渲染的模块
- `hidden`：条件为 `true` 时用 `display:none` 隐藏，适合频繁切换显示状态的元素
