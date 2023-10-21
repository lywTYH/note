# 常用工具函数

```js
// 预加载图像
$.preloadImages = function () {
  for (let i = 0; i < arguments.length; i++) {
    $('img').attr('src', arguments[i])
  }
}
$.preloadImages('a.png','a.jpg')

// 自动修复破坏的图像
$('img').on('error',function(){
  if(!$(this).hasClass('broken-image')){
    $(this).prop('src','img/broken.png').addClass('broken-image')
  }
})

// 悬停切换
$(element).hover(function(){
  $(this).addClass('hover')
},function(){
  $(this.removeClass('hover'))
})

// 淡入淡出/显示隐藏
$(element).hover(function(){
  $(this).addClass('hover')
},function(){
  $(this.removeClass('hover'))
})


// 禁止移动端浏览器页面滚动
body ontouchmove="event.preventDefault()" 
// js //touchstart
document.addEventListener('touchmove',function(event){
  event.preventDefault();
})

//  检测是否移动端及浏览器内核
var browser = { 
  versions: function() { 
      var u = navigator.userAgent; 
      return { 
          trident: u.indexOf('Trident') > -1, //IE内核 
          presto: u.indexOf('Presto') > -1, //opera内核 
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核 
          gecko: u.indexOf('Firefox') > -1, //火狐内核Gecko 
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否移动终端 
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios 
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android 
          iPhone: u.indexOf('iPhone') > -1 , //iPhone 
          iPad: u.indexOf('iPad') > -1, //iPad 
          webApp: u.indexOf('Safari') > -1 //Safari 
      }; 
  }
} 
```