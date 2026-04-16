# 代码模板

## 目录

- [Page 模板](#page-模板)
  - [index.ts](#pagets)
  - [index.wxml](#pagewxml)
  - [index.wxss](#pagewxss)
  - [index.json](#pagejson)
- [Component 模板](#component-模板)
  - [index.ts](#componentts)
  - [index.wxml](#componentwxml)
  - [index.wxss](#componentwxss)
  - [index.json](#componentjson)

---

## Page 模板

### page.ts

```typescript
Page({
  data: {
    isLoading: true,
    list: [] as Array<{ id: number; name: string }>
  },

  onLoad(options) {
    this.initData(options)
  },

  onShow() {
    // 页面每次显示时刷新状态（如 tabBar 页面切回）
  },

  onShareAppMessage() {
    return {
      title: '欢迎分享',
      path: '/pages/index/index'
    }
  },

  async initData(options: Record<string, string>) {
    try {
      // TODO: 替换为真实接口
      const mockList = [
        { id: 1, name: '示例数据 A' },
        { id: 2, name: '示例数据 B' }
      ]
      this.setData({ list: mockList, isLoading: false })
    } catch (e) {
      wx.showToast({ title: '加载失败', icon: 'error' })
      this.setData({ isLoading: false })
    }
  },

  onTapItem(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/detail/index?id=${id}` })
  }
})
```

### page.wxml

```xml
<view class="container">
  <view wx:if="{{isLoading}}" class="loading">
    <text class="loading-text">加载中...</text>
  </view>

  <block wx:else>
    <view class="list">
      <view
        class="list-item"
        wx:for="{{list}}"
        wx:key="id"
        data-id="{{item.id}}"
        bind:tap="onTapItem"
      >
        <text class="item-name">{{item.name}}</text>
        <text class="item-arrow">›</text>
      </view>
    </view>
  </block>
</view>
```

### page.wxss

```css
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 24rpx;
  box-sizing: border-box;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 200rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999999;
}

.list {
  width: 100%;
}

.list-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx 28rpx;
  margin-bottom: 16rpx;
}

.item-name {
  font-size: 30rpx;
  color: #333333;
}

.item-arrow {
  font-size: 32rpx;
  color: #cccccc;
}
```

### page.json

```json
{
  "navigationBarTitleText": "页面标题",
  "navigationBarBackgroundColor": "#ffffff",
  "navigationBarTextStyle": "black",
  "enablePullDownRefresh": false,
  "usingComponents": {}
}
```

---

## Component 模板

### component.ts

```typescript
Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },

  data: {
    innerState: false
  },

  lifetimes: {
    attached() {
      // 组件挂载：初始化数据、启动定时器
    },
    detached() {
      // 组件卸载：清理定时器、取消事件监听
    }
  },

  methods: {
    onTap() {
      if (this.data.disabled) return
      this.triggerEvent('tap', { title: this.data.title })
    }
  }
})
```

### component.wxml

```xml
<view class="comp-container {{disabled ? 'comp-disabled' : ''}}">
  <text class="comp-title">{{title}}</text>
  <view class="comp-btn" bind:tap="onTap">
    <text class="comp-btn-text">点击</text>
  </view>
</view>
```

### component.wxss

```css
.comp-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
}

.comp-disabled {
  opacity: 0.4;
}

.comp-title {
  font-size: 28rpx;
  color: #333333;
}

.comp-btn {
  background-color: #07c160;
  border-radius: 8rpx;
  padding: 12rpx 32rpx;
}

.comp-btn-text {
  font-size: 26rpx;
  color: #ffffff;
}
```

### component.json

```json
{
  "component": true,
  "usingComponents": {}
}
```
