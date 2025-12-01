// pages/enterprise/job-publish.js
Page({
  data: {
    job: {
      title: '',
      description: '',
      requirements: '',
      salary: '',
      province: '陕西省',
      city: '',
      district: '',
      jobType: '',
      majorCategory: '',
      majorName: '',
      certificates: []
    },
    loading: false,
    
    cities: ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', 
    '延安市', '汉中市', '榆林市', '安康市', '商洛市'], // 陕西省所有市级列表
    districts: [], // 根据选择的城市显示的区县列表
    
    jobTypes: ['实习', '兼职', '全职'],
    
    majorCategories: ['智能制造与高端装备类', '新能源汽车与智能网联类', '电子信息与信息技术类', '建筑工程与土木工程类', '现代服务业技术类'], // 专业大类列表
    majorNames: [], // 根据专业大类显示的专业名称列表
    
    availableCertificates: [] // 根据专业大类显示的证书列表
  },

  onLoad: function() {
    this.initLocationData();
    this.initMajorData();
  },

  initLocationData: function() {
    const shaanxiCities = [
      '西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', 
      '延安市', '汉中市', '榆林市', '安康市', '商洛市'
    ];
    
    this.setData({
      cities: shaanxiCities
    });
  },

  initMajorData: function() {
    const majorCategories = [
      '智能制造与高端装备类', '新能源汽车与智能网联类', '电子信息与信息技术类', '建筑工程与土木工程类', '现代服务业技术类'
    ];
    
    this.setData({
      majorCategories: majorCategories
    });
  },

  onCityChange: function(e) {
    const index = parseInt(e.detail.value);
    const city = this.data.cities[index];
    let districts = [];
    
    switch(city) {
      case '西安市':
        districts = ['新城区', '碑林区', '莲湖区', '灞桥区', '未央区', '雁塔区', '阎良区', '临潼区', '长安区', '高陵区', '鄠邑区', '蓝田县', '周至县'];
        break;
      case '宝鸡市':
        districts = ['渭滨区', '金台区', '陈仓区', '凤翔区', '岐山县', '扶风县', '眉县', '陇县', '千阳县', '麟游县', '凤县', '太白县'];
        break;
        case '铜川市':
        districts = ['王益区', '印台区', '耀州区', '宜君县'];
        break;
        case '咸阳市':
        districts = ['秦都区', '杨陵区', '渭城区', '三原县', '泾阳县', '乾县', '礼泉县', '永寿县', '长武县', '旬邑县', '淳化县', '武功县', '兴平市', '彬州市'];
        break;
        case '渭南市':
        districts = ['临渭区', '华州区', '潼关县', '大荔县', '合阳县', '澄城县', '蒲城县', '白水县', '富平县', '韩城市', '华阴市'];
        break;
        case '延安市':
        districts = ['宝塔区', '安塞区', '延长县', '延川县', '志丹县', '吴起县', '甘泉县', '富县', '洛川县', '宜川县', '黄龙县', '黄陵县', '子长市'];
        break;
        case '汉中市':
        districts = ['汉台区', '南郑区', '城固县', '洋县', '西乡县', '勉县', '宁强县', '略阳县', '镇巴县', '留坝县', '佛坪县'];
        break;
        case '榆林市':
        districts = ['榆阳区', '横山区', '府谷县', '靖边县', '定边县', '绥德县', '米脂县', '佳县', '吴堡县', '清涧县', '子洲县', '神木市'];
        break;
        case '安康市':
        districts = ['汉滨区', '汉阴县', '石泉县', '宁陕县', '紫阳县', '岚皋县', '平利县', '镇坪县', '白河县', '旬阳市'];
        break;
        case '商洛市':
        districts = ['商州区', '洛南县', '丹凤县', '商南县', '山阳县', '镇安县', '柞水县'];
        break;
      default:
        districts = ['请选择区县'];
    }
    
    this.setData({
      'job.city': city,
      'job.district': '',
      districts: districts
    });
  },

  // 区县选择变化
  onDistrictChange: function(e) {
    const index = parseInt(e.detail.value);
    const district = this.data.districts[index];
    
    this.setData({
      'job.district': district
    });
  },

  // 工作类型选择
  onJobTypeChange: function(e) {
    const index = parseInt(e.detail.value);
    const jobType = this.data.jobTypes[index];
    
    this.setData({
      'job.jobType': jobType
    });
  },

  // 专业大类选择变化
  onMajorCategoryChange: function(e) {
    const index = parseInt(e.detail.value);
    const category = this.data.majorCategories[index];
    let majorNames = [];
    let certificates = [];
    
    // 根据专业大类显示对应的专业名称和证书
    switch(category) {
      case '智能制造与高端装备类':
        majorNames = ['机电一体化技术', '机械制造与自动化', '工业机器人技术', '智能控制技术', '数控技术', '模具设计与制造'];
        certificates = ['暂不需要', '电工证', '工业机器人操作与运维证书', '数控操作工证书', 'PLC编程工程师证书'];
        break;
        case '新能源汽车与智能网联类':
          majorNames = ['新能源汽车技术', '汽车检测与维修技术', '智能网联汽车技术', '汽车智能技术'];
          certificates = ['暂不需要', '汽车维修工（电工方向）证', '低压电工证', '智能网联汽车测试装调职业技能等级证书'];
          break;
      case '电子信息与信息技术类':
          majorNames = ['电子信息工程技术', '物联网应用技术', '现代通信技术', '软件技术', '计算机网络技术', '大数据技术'];
          certificates = ['暂不需要', '通信专业技术人员职业资格', '网络工程师（HCIA/CCNA）', '程序员技能等级证书', 'Web前端开发职业技能等级证书'];
          break;
      case '建筑工程与土木工程类':
          majorNames = ['建筑工程技术', '工程造价', '建设工程管理', '建筑设备工程技术', '建筑电气工程技术', '供热通风与空调工程技术'];
          certificates = ['暂不需要', '施工员证书', '测量员证书', '安全员证书', 'BIM技能等级证书', '特种作业操作证（高处作业）'];
          break;
      case '现代服务业技术类':
          majorNames = ['电子商务', '现代物流管理', '供应链运营', '烹饪工艺与营养', '酒店管理与数字化运营'];
          certificates = ['暂不需要', '西式面点师', '中式烹调师', '电子商务师', '物流服务师'];
          break;
      default:
        majorNames = ['请选择专业名称'];
        certificates = [];
    }
    
    this.setData({
      'job.majorCategory': category,
      'job.majorName': '',
      'job.certificates': [],
      majorNames: majorNames,
      availableCertificates: certificates
    });
  },

  onMajorNameChange: function(e) {
    const index = parseInt(e.detail.value);
    const majorName = this.data.majorNames[index];
    
    this.setData({
      'job.majorName': majorName
    });
  },

  onCertificateChange: function(e) {
    const index = e.currentTarget.dataset.index;
    const certificate = this.data.availableCertificates[index];
    
    if (!certificate) return;
    
    let certificates = [...this.data.job.certificates]; 
    
    // 如果是"暂不需要"，则清空其他证书
    if (certificate === '暂不需要') {
        if (certificates.includes('暂不需要')) {
            // 如果已经选中"暂不需要"，则取消它
            certificates = [];
        } else {
            // 选择"暂不需要"，清空其他证书
            certificates = ['暂不需要'];
        }
    } else {
        // 其他证书的逻辑
        if (certificates.includes('暂不需要')) {
            // 如果已选"暂不需要"，先移除它
            certificates = certificates.filter(item => item !== '暂不需要');
        }
        
        // 切换选中状态
        if (certificates.includes(certificate)) {
            certificates = certificates.filter(item => item !== certificate);
        } else {
            certificates.push(certificate);
        }
    }
    
    this.setData({
        'job.certificates': certificates
    });
    
    console.log('当前选中证书:', certificates); 
},

removeCertificate: function(e) {
    const index = e.currentTarget.dataset.index;
    const certificateToRemove = this.data.job.certificates[index];
    
    if (!certificateToRemove) return;
    
    let certificates = this.data.job.certificates.filter((item, i) => i !== index);
    
    this.setData({
        'job.certificates': certificates
    });
    
    console.log('移除证书后:', certificates); 
},

  submitJob: function(e) {
    const formData = e.detail.value;
    const { title, description, requirements, salary } = formData;
    const { province, city, district, jobType, majorCategory, majorName, certificates } = this.data.job;
    
    if (!title || !description || !requirements || !salary || !city || !district || !jobType || !majorCategory || !majorName) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    
    this.setData({ loading: true });
    
    wx.cloud.callFunction({
      name: 'publishJob',
      data: { 
        title, 
        description, 
        requirements, 
        salary, 
        province, 
        city, 
        district, 
        jobType, 
        majorCategory, 
        majorName, 
        certificates 
      },
      success: res => {
        const result = res.result;
        if (result.success) {
          wx.showToast({ title: '发布成功' });
          wx.navigateBack();
        } else {
          wx.showToast({ title: result.msg, icon: 'none' });
        }
      },
      fail: err => {
        wx.showToast({ title: '发布失败: ' + err.errMsg, icon: 'none' });
      },
      complete: () => this.setData({ loading: false })
    });
  }
});