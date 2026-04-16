interface Goal {
  id: string;
  name: string;
  streak: number;
  records: string[];
}

interface WeekDay {
  label: string;
  date: string;
  done: boolean;
}

interface RecordItem {
  date: string;
  dateDisplay: string;
  done: boolean;
}

Page({
  data: {
    goalId: '',
    goalName: '',
    streak: 0,
    totalDays: 0,
    weekDays: [] as WeekDay[],
    records: [] as RecordItem[]
  },

  onLoad(options: Record<string, string>) {
    const goalId = options.id || ''
    this.loadGoalData(goalId)
  },

  onShow() {},

  onShareAppMessage() {
    return {
      title: '打卡小助手',
      path: '/pages/index/index'
    }
  },

  loadGoalData(goalId: string) {
    if (!goalId) {
      wx.showToast({ title: '参数错误', icon: 'none' })
      return
    }

    const goals = wx.getStorageSync('goals') || [] as Goal[]
    const goal = goals.find((g: Goal) => g.id === goalId)

    if (!goal) {
      wx.showToast({ title: '目标不存在', icon: 'none' })
      return
    }

    const today = this.getTodayStr()
    const weekDays = this.generateWeekDays(goal.records)
    const records = this.generateRecords(goal.records)

    this.setData({
      goalId: goal.id,
      goalName: goal.name,
      streak: goal.streak,
      totalDays: goal.records.length,
      weekDays: weekDays,
      records: records
    })
  },

  getTodayStr(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  getWeekLabels(): string[] {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const labels = ['日', '一', '二', '三', '四', '五', '六']
    const result: string[] = []

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      result.push(labels[d.getDay()])
    }

    return result
  },

  generateWeekDays(records: string[]): WeekDay[] {
    const today = new Date()
    const labels = this.getWeekLabels()
    const weekDays: WeekDay[] = []

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const dateDisplay = `${d.getMonth() + 1}/${d.getDate()}`

      weekDays.push({
        label: labels[6 - i],
        date: dateDisplay,
        done: records.includes(dateStr)
      })
    }

    return weekDays
  },

  generateRecords(records: string[]): RecordItem[] {
    const today = new Date()
    const result: RecordItem[] = []

    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const dateDisplay = `${d.getMonth() + 1}月${d.getDate()}日 ${['日', '一', '二', '三', '四', '五', '六'][d.getDay()]}`

      result.push({
        date: dateStr,
        dateDisplay: dateDisplay,
        done: records.includes(dateStr)
      })
    }

    return result
  },

  goBack() {
    wx.navigateBack()
  }
})