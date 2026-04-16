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
