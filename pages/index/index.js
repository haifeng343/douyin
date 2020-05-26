//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    windowWidth: '', //获取屏宽
    windowHeight: '', //获取屏高
    statusBarHeight:'',//导航栏高度
    videoList: [], //视频地址
    current:0,//指引层
    show:1,// 1关注 2推荐
    btuBottom:'',//兼容iphoneX
    isSHow:false,//喜欢or not
    IsAttention:false,//关注 未关注
    animation:null,//动画
    rightList:[
      {
        id:1,
        img:'../image/hong.png',
        imgs:'../image/hong1.png',
        value:'21.0w',
        flag:false,
      },
      {
        id:2,
        img:'../image/msg.png',
        imgs:'../image/msg.png',
        value:'1.2w',
        flag:false,
      },
      {
        id:3,
        img:'../image/share.png',
        imgs:'../image/share.png',
        value:'4827',
        flag:false,
      },
    ]
  },
  onLoad: function () {
    let that = this;
    that.getTel();
    that.getList();
    that.DoAnimation();
  },
  //初始化手机尺寸
  getTel() {
    let stemInfo = wx.getStorageSync('stemInfo');
    this.setData({
      windowWidth: stemInfo.windowWidth,
      windowHeight: stemInfo.windowHeight,
      statusBarHeight:stemInfo.statusBarHeight,
      btuBottom:app.globalData.btuBottom
    })
  },
  DoAnimation(){
    var animation = wx.createAnimation({
      duration: 3000,
      timingFunction: 'linear',
    })
    animation.rotate(360).step();
    this.setData({
      animation:animation.export()
    })
    //连续动画关键步骤
  },
  //获取数据
  getList() {
    let that = this;
    
    wx.request({
      url: 'https://api.apiopen.top/videoRecommend?id=127397',
      data: {},
      success(res) {
        if (res.data.code == 200) {
          let tempArr = [],
            tempArr1 = [],
            tempArr2 = [];
          tempArr = res.data.result;
          tempArr1 = tempArr.filter(item => {
            return item.data.playUrl
            console.log(tempArr1)
          })
          tempArr1.forEach((item,index) => {
            if (item.data.playUrl) {
              tempArr2.push({
                url: item.data.playUrl, //视频地址
                poster: item.data.cover.feed, //视频封面图
                title: item.data.title, //视频标题
                duration: item.data.duration, //视频时长
                name: item.data.author.name, //作者名称
                img: item.data.author.icon, //作者头像
                dec: item.data.description, //视频简介
                flag: that.data.current==index?true:false,
              })
            }
          })
          that.setData({
            videoList: tempArr2
          })
          wx.showToast({
            title: '已为你推荐'+tempArr2.length+'个新作品',
            icon:'none',
            duration:2000
          })
        }
      }
    })
  },
  //切换视频
  swiperChange(e){
    let that = this;
    let tempArr = that.data.videoList;
    if(tempArr.length>0){
      tempArr.forEach((item,index)=>{
        if(e.detail.current==index){
          item.flag = true;
          item.v = item.v || wx.createVideoContext('v'+e.detail.current, this);
          item.v.play();
        }else{
          item.flag= false;
          if(item.v){
            item.v.pause();
            item.v.seek(0);
          }
        }
      })
    }
    that.setData({
      current:e.detail.current,
      videoList:tempArr
    })
  },
  //切换视频完成动作时
  swiperFinish(e){
    if(e.detail.current+1>=this.data.videoList.length){
      wx.showToast({
        title: '暂时没有更多视频了～',
        icon:'none',
        duration:2000
      })
    }
  },
  //关注推荐切换
  changeTop(e){
    this.setData({
      show:e.currentTarget.dataset.show
    })
  },
  //喜欢or不喜欢
  changeSelect(e){
    let that = this;
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let tempArr = that.data.rightList;
    if(id==1){
      tempArr.forEach(item=>{
        item.flag = !item.flag;
      })
    }
    that.setData({
      rightList:tempArr
    })
  },
  //点击关注
  changeAttention(){
    this.setData({
      IsAttention:true
    })
    wx.showToast({
      title: '已关注',
      icon:'none',
      duration:2000
    })
  },
  //点击取消关注
  changeEor(){
    this.setData({
      IsAttention:false
    })
    wx.showToast({
      title: '已取消关注',
      icon:'none',
      duration:2000
    })
  },
})