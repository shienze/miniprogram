Page({
  data: {
    allJobs: [],
    filteredJobs: [],
    displayJobs: [],
    searchKeyword: '',
    locationOptions: ['全部', '西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市',
      '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
    locationIndex: 0,
    majorCategoryOptions: ['全部', '智能制造与高端装备类', '新能源汽车与智能网联类',
      '电子信息与信息技术类', '建筑工程与土木工程类', '现代服务业技术类'],
    majorCategoryIndex: 0,
    page: 1,
    pageSize: 10,
    hasMore: true,
    loadingMore: false
  },

  onLoad() {
    this.loadAllJobs()
  },

  loadAllJobs() {
    wx.showLoading({ title: '加载中...' })

    wx.cloud.callFunction({
      name: 'getInternshipJobs',
      success: res => {
        console.log("【云函数返回】", res)

        if (!res || !res.result) {
          wx.showToast({ title: '未收到后端数据', icon: 'none' })
          return
        }

        const result = res.result

        if (!result.success) {
          wx.showToast({ title: result.msg || '加载失败', icon: 'none' })
          return
        }

        const jobs = result.jobs || []
        console.log("【加载到岗位数量】", jobs.length)

        this.setData({
          allJobs: jobs,
          filteredJobs: jobs,
          displayJobs: jobs.slice(0, this.data.pageSize),
          page: 2,
          hasMore: jobs.length > this.data.pageSize
        })

        this.applyLocalFilter()
      },

      fail: err => {
        console.error("【云函数报错】", err)
        wx.showToast({ title: '云函数调用失败', icon: 'none' })
      },

      complete: () => {
        wx.hideLoading()
      }
    })
  },

  applyLocalFilter() {
    const {
      allJobs,
      searchKeyword,
      locationIndex,
      locationOptions,
      majorCategoryIndex,
      majorCategoryOptions,
      page,
      pageSize
    } = this.data

    let list = [...allJobs]

    // 城市
    const selectedLocation = locationOptions[locationIndex]
    if (selectedLocation !== '全部') {
      list = list.filter(job => job.location?.city === selectedLocation)
    }

    // 专业类别
    const selectedMajor = majorCategoryOptions[majorCategoryIndex]
    if (selectedMajor !== '全部') {
      list = list.filter(job => job.majorRequirements?.category === selectedMajor)
    }

    // 搜索
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase()
      list = list.filter(job =>
        (job.title?.toLowerCase().includes(keyword)) ||
        (job.enterpriseInfo?.name?.toLowerCase().includes(keyword)) ||
        (job.description?.toLowerCase().includes(keyword))
      )
    }

    // 排序
    list.sort((a, b) => {
      // 优先按 score（若不存在 score，视为 0）
      const sa = typeof a.score === 'number' ? a.score : 0;
      const sb = typeof b.score === 'number' ? b.score : 0;
      if (sb !== sa) return sb - sa; 
    
      // score 相等时按创建时间倒序（新的靠前）
      const ta = a.createdAt ? new Date(a.createdAt) : 0;
      const tb = b.createdAt ? new Date(b.createdAt) : 0;
      return tb - ta;
    });

    this.setData({
      filteredJobs: list,
      displayJobs: list.slice(0, page * pageSize),
      hasMore: list.length > page * pageSize
    })
  },

  doSearch() {
    this.setData({ page: 1 })
    this.applyLocalFilter()
  },

  applyFilter() {
    this.setData({ page: 1 })
    this.applyLocalFilter()
  },

  clearFilters() {
    this.setData({
      searchKeyword: '',
      locationIndex: 0,
      majorCategoryIndex: 0,
      page: 1
    })
    this.applyLocalFilter()
  },

  loadMore() {
    if (!this.data.hasMore) return
    this.setData({ page: this.data.page + 1 })
    this.applyLocalFilter()
  },

  toJobDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/user/job-detail?id=${id}` })
  },
  changeMajorCategory(e) {
    this.setData({
      majorCategoryIndex: e.detail.value
    });
  },

  changeLocation(e) {
    this.setData({
      locationIndex: e.detail.value
    });
  },

  inputSearch(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  }  
})
