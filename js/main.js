$(document).ready(function(){
  var winh=(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
  var winw=(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
  $(".fullh").css({"min-height":winh});
  if (winh<700) winh = 700;
  var h = winh - 102;
  $(".minh").css({"min-height":h});
  $(".fixh").css({height:h});
  h = winh*2/3;
  if (winw<768) h = winw*3/5;
  $(".halfh").css({height:h});
	fontmaking();
  var _hmt = _hmt || [];
});
function fontmaking() {
    var resultStr = $(".SiYuanRegular").text();
    var md5 = "";
    resultStr = Trim(resultStr);
    resultStr = SelectWord(resultStr);
    md5 = $.md5("8564236f5a9742d0b98cbd804fd3c033"+"SiYuanRegular" + resultStr);
    $.getJSON("http://www.youziku.com/webfont/CSSPOST?jsoncallback=?", { "id": md5, "guid": "8564236f5a9742d0b98cbd804fd3c033", "type": "5" }, function (json) {
        if (json.result == 0) $.post("http://www.youziku.com/webfont/PostCorsCreateFont", { "name": "SiYuanRegular", "gid": "8564236f5a9742d0b98cbd804fd3c033", "type": "5", "text": resultStr });
        else loadExtentFile("http://www.youziku.com/webfont/css?id=" + md5 + "&guid=" + "8564236f5a9742d0b98cbd804fd3c033" + "&type=5");
    });
}
function baidu() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?64727a8eb46ecd0761e0001b7f462cb8";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
};