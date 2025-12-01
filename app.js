// app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'cloudbase-1gac0zx27ab9bf50', 
      traceUser: true,
    })
  }
});