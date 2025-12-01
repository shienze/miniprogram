const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { page = 1, keyword = '' } = event;
  const pageSize = 10;
  
  try {
    let query = db.collection('posts').orderBy('time', 'desc');
    
    if (keyword) {
      query = query.where(
        _.or([
          { title: db.RegExp({ regexp: keyword, options: 'i' }) },
          { content: db.RegExp({ regexp: keyword, options: 'i' }) }
        ])
      );
    }
    
    const res = await query.skip((page - 1) * pageSize).limit(pageSize).get();
    
    return { 
      success: true, 
      posts: res.data 
    };
  } catch (err) {
    return { 
      success: false, 
      msg: err.message 
    };
  }
};