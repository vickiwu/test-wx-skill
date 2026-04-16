interface Goal {
  id: string;
  name: string;
  streak: number;
  records: string[];
}

Page({
  data: {
    goalName: '',
    isValid: false
  },

  onLoad() {},

  onShow() {},

  onShareAppMessage() {
    return {
      title: '打卡小助手',
      path: '/pages/index/index'
    }
  },

  onInputChange(e: WechatMiniprogram.InputEvent) {
    const value = e.detail.value
    this.setData({
      goalName: value,
      isValid: value.trim().length > 0
    })
  },

  onQuickSelect(e: WechatMiniprogram.TouchEvent) {
    const { name } = e.currentTarget.dataset
    this.setData({
      goalName: name,
      isValid: name.trim().length > 0
    })
  },

  onCreate() {
    const name = this.data.goalName.trim()

    if (!name) {
      wx.showToast({
        title: '请输入目标名称',
        icon: 'none'
      })
      return
    }

    const newGoal: Goal = {
      id: String(Date.now()),
      name: name,
      streak: 0,
      records: []
    }

    const goals = wx.getStorageSync('goals') || [] as Goal[]
    goals.push(newGoal)

    wx.setStorageSync('goals', goals)

    wx.showToast({
      title: '创建成功',
      icon: 'success'
    })

    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  },

  goBack() {
    wx.navigateBack()
  }
})
