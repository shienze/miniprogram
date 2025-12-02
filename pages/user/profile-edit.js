// pages/user/profile-edit.js
Page({
  data: {
    loading: false,
    nickname: '',
    phoneNumber: '',
    emailAddress: '',
   
    name: '',
    school: '',
    schoolKeyword: '', 
    showSchoolList: false, 
    majorCategory: '', 
    majorName: '', 
    majorCategoryKeyword: '', 
    majorNameKeyword: '', 
    showMajorCategoryList: false, 
    showMajorNameList: false, 
    gradeIndex: 0,
    gradeOptions: ['大一', '大二', '大三', '大四', '大五', '毕业生'],
 
    allSchools: [
      '西安交通大学', '西北工业大学', '西安电子科技大学', '陕西师范大学', '西北大学',
      '西安理工大学', '西安建筑科技大学', '陕西科技大学', '西安邮电大学', '西安科技大学',
      '西安工业大学', '西安工程大学', '西安外国语大学', '西北政法大学', '西安石油大学',
      '西安财经大学', '西安美术学院', '西安音乐学院', '西安体育学院', '长安大学',
      '陕西中医药大学', '延安大学', '陕西理工大学', '宝鸡文理学院', '咸阳师范学院',
      '渭南师范学院', '榆林学院', '商洛学院', '安康学院', '西安医学院',
      '西安文理学院', '西安航空学院', '陕西工业职业技术学院', '杨凌职业技术学院',
      '陕西国防工业职业技术学院', '西安航空职业技术学院', '陕西铁路工程职业技术学院',
      '陕西职业技术学院', '宝鸡职业技术学院', '咸阳职业技术学院', '渭南职业技术学院',
      '延安职业技术学院', '汉中职业技术学院', '安康职业技术学院', '商洛职业技术学院',
      '榆林职业技术学院', '西安铁路职业技术学院', '西安电力高等专科学校',
      '西安医学高等专科学校', '陕西能源职业技术学院', '陕西财经职业技术学院',
      '陕西交通职业技术学院', '陕西邮电职业技术学院'
    ],
    filteredSchools: [], 
    
    majorCategories: [
      '智能制造与高端装备类',
      '新能源汽车与智能网联类', 
      '电子信息与信息技术类',
      '建筑工程与土木工程类',
      '现代服务业技术类'
    ],
    filteredMajorCategories: [], 
    majorData: {
      '智能制造与高端装备类': ['机电一体化技术', '机械制造与自动化', '工业机器人技术', '智能控制技术', '数控技术', '模具设计与制造'],
      '新能源汽车与智能网联类': ['新能源汽车技术', '汽车检测与维修技术', '智能网联汽车技术', '汽车智能技术'],
      '电子信息与信息技术类': ['电子信息工程技术', '物联网应用技术', '现代通信技术', '软件技术', '计算机网络技术', '大数据技术'],
      '建筑工程与土木工程类': ['建筑工程技术', '工程造价', '建设工程管理', '建筑设备工程技术', '建筑电气工程技术', '供热通风与空调工程技术'],
      '现代服务业技术类': ['电子商务', '现代物流管理', '供应链运营', '烹饪工艺与营养', '酒店管理与数字化运营']
    },
    filteredMajorNames: [], 
    currentMajorNames: [] 
  },

  onLoad: async function () {
    try {
      const res = await wx.cloud.callFunction({ name: 'getUserProfile' });
      const userData = res.result;
      if (userData) {
        this.setData({
          nickname: userData.nickname || '微信用户',
          phoneNumber: userData.phoneNumber || '',
          emailAddress: userData.emailAddress || '',
          name: userData.name || '',
          school: userData.school || '',
          schoolKeyword: userData.school || '',
          majorCategory: userData.majorCategory || '',
          majorCategoryKeyword: userData.majorCategory || '',
          majorName: userData.majorName || '',
          majorNameKeyword: userData.majorName || '',
          gradeIndex: this.data.gradeOptions.indexOf(userData.grade) || 0,
          currentMajorNames: this.data.majorData[userData.majorCategory] || [],
          filteredMajorNames: this.data.majorData[userData.majorCategory] || []
        });
      }
    } catch (err) {
      console.error('加载用户数据失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  inputNickname: function (e) {
    this.setData({ nickname: e.detail.value });
  },
  inputPhoneNumber: function (e) {
    this.setData({ phoneNumber: e.detail.value });
  },
  inputEmailAddress: function (e) {
    this.setData({ emailAddress: e.detail.value });
  },

  inputName: function (e) {
    this.setData({ name: e.detail.value });
  },

  onSchoolSearch: function (e) {
    const keyword = e.detail.value;
    this.setData({ schoolKeyword: keyword });
    
    if (!keyword.trim()) {
      this.setData({ filteredSchools: [], showSchoolList: false });
      return;
    }
    
    const keywordLower = keyword.toLowerCase();
    const filtered = this.data.allSchools.filter(school => school.toLowerCase().includes(keywordLower));
    
    this.setData({ filteredSchools: filtered, showSchoolList: true });
  },

  selectSchool: function (e) {
    const school = e.currentTarget.dataset.school;
    this.setData({ school: school, schoolKeyword: school, showSchoolList: false });
  },

  clearSchool: function () {
    this.setData({ school: '', schoolKeyword: '', showSchoolList: false });
  },

  onMajorCategorySearch: function (e) {
    const keyword = e.detail.value;
    this.setData({ majorCategoryKeyword: keyword });
    
    if (!keyword.trim()) {
      this.setData({ filteredMajorCategories: [], showMajorCategoryList: false });
      return;
    }
    
    const keywordLower = keyword.toLowerCase();
    const filtered = this.data.majorCategories.filter(category => category.toLowerCase().includes(keywordLower));
    
    this.setData({ filteredMajorCategories: filtered, showMajorCategoryList: true });
  },

  selectMajorCategory: function (e) {
    const category = e.currentTarget.dataset.category;
    const majorNames = this.data.majorData[category] || [];
    this.setData({
      majorCategory: category,
      majorCategoryKeyword: category,
      currentMajorNames: majorNames,
      filteredMajorNames: majorNames,
      majorName: '',
      majorNameKeyword: '',
      showMajorCategoryList: false,
      showMajorNameList: false
    });
  },

  clearMajorCategory: function () {
    this.setData({
      majorCategory: '',
      majorCategoryKeyword: '',
      currentMajorNames: [],
      filteredMajorNames: [],
      majorName: '',
      majorNameKeyword: '',
      showMajorCategoryList: false,
      showMajorNameList: false
    });
  },

  onMajorNameSearch: function (e) {
    const keyword = e.detail.value;
    this.setData({ majorNameKeyword: keyword });
    
    if (!keyword.trim()) {
      this.setData({ filteredMajorNames: this.data.currentMajorNames, showMajorNameList: true });
      return;
    }
    
    const keywordLower = keyword.toLowerCase();
    const filtered = this.data.currentMajorNames.filter(major => major.toLowerCase().includes(keywordLower));
    
    this.setData({ filteredMajorNames: filtered, showMajorNameList: true });
  },

  selectMajorName: function (e) {
    const majorName = e.currentTarget.dataset.major;
    this.setData({ majorName: majorName, majorNameKeyword: majorName, showMajorNameList: false });
  },

  clearMajorName: function () {
    this.setData({ majorName: '', majorNameKeyword: '', showMajorNameList: false });
  },

  changeGrade: function (e) {
    this.setData({ gradeIndex: parseInt(e.detail.value) });
  },

  hideAllLists: function () {
    this.setData({
      showSchoolList: false,
      showMajorCategoryList: false,
      showMajorNameList: false
    });
  },

  saveProfile: async function () {
    if (!this.data.name || !this.data.school || !this.data.majorCategory || !this.data.majorName) {
      wx.showToast({ title: '请填写姓名、学校、专业大类和专业名称', icon: 'none' });
      return;
    }
    if (this.data.phoneNumber && !/^\d{11}$/.test(this.data.phoneNumber)) {
      wx.showToast({ title: '请输入有效的11位手机号码', icon: 'none' });
      return;
    }
    if (this.data.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.data.emailAddress)) {
      wx.showToast({ title: '请输入有效的邮箱地址', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    wx.showLoading({ title: '保存中...' });

    const major = `${this.data.majorCategory} - ${this.data.majorName}`;

    try {
      const res = await wx.cloud.callFunction({
        name: 'updateUserProfile',
        data: {
          nickname: this.data.nickname,
          phoneNumber: this.data.phoneNumber,
          emailAddress: this.data.emailAddress,
          name: this.data.name,
          school: this.data.school,
          majorCategory: this.data.majorCategory,
          majorName: this.data.majorName,
          major: major,
          grade: this.data.gradeOptions[this.data.gradeIndex]
        }
      });
      console.log('云函数返回:', res); 
      if (res.result.success) {
        wx.showToast({ title: '保存成功' });
        wx.navigateBack();
      } else {
        wx.showToast({ title: res.result.message || '保存失败', icon: 'none' });
      }
    } catch (err) {
      console.error('调用失败:', err);
      wx.showToast({ title: '网络错误，请重试', icon: 'none' });
    } finally {
      wx.hideLoading();
      this.setData({ loading: false });
    }
  }
});