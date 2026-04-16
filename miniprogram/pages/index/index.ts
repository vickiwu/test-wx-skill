interface Goal {
  id: string;
  name: string;
  streak: number;
  records: string[];
}

Page({
  data: {
    goals: [] as Goal[]
  },

  onLoad() {
    this.loadGoals()
  },

  onShow() {
    this.loadGoals()
  },

  onShareAppMessage() {
    return {
      title: '打卡小助手',
      path: '/pages/index/index'
    }
  },

  getTodayStr(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  loadGoals() {
    const goals = wx.getStorageSync('goals') || []
    const today = this.getTodayStr()

    const processed = goals.map((g: Goal) => ({
      ...g,
      todayDone: g.records.includes(today)
    }))

    this.setData({ goals: processed })
  },

  onCheckIn(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset
    const today = this.getTodayStr()

    const goals = wx.getStorageSync('goals') || [] as Goal[]
    const index = goals.findIndex((g: Goal) => g.id === id)

    if (index === -1) return

    const goal = goals[index]

    if (goal.records.includes(today)) {
      return
    }

    let streak = goal.streak
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

    if (goal.records.includes(yesterdayStr)) {
      streak += 1
    } else {
      streak = 1
    }

    goal.records.push(today)
    goal.streak = streak
    goals[index] = goal

    wx.setStorageSync('goals', goals)
    this.loadGoals()

    wx.showToast({
      title: '打卡成功',
      icon: 'success'
    })
  },

  goCreate() {
    wx.navigateTo({
      url: '/pages/create/index'
    })
  },

  goHistory(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/history/index?id=${id}`
    })
  }
})
