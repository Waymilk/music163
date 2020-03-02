// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist:Object
  },
  observers:{
    ['playlist.playCount'](val){
      this.setData({
        _count: this.countFormat(val)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _count:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    countFormat(num){
      let numLength = (num + '').split('.')[0].length
      if (9 > numLength && numLength > 5){
        return (num / 10000).toFixed(2) + '万'
      }else if(numLength >= 9){
        return (num / 100000000).toFixed(2) + '亿'
      }
    },
    goToMusiclist(){
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?id=${this.properties.playlist.id}`,
      })
    }
  }
})
