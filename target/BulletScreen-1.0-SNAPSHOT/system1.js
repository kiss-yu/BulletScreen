/**
 * Created by 11723 on 2017/2/7.
 */

var time = 50;
var stopTime = 1000;
var offTime = 500;
// var httpHost="http://xx11.wicp.net";
// var httpHost="http://119.29.100.66:80";
// var wsHost="ws://119.29.100.66:80";
var wsHost="ws://localhost:8080";
var httpHost="http://localhost:8080";
var messageList = [];
var snowArr = [];
var fireworks = [];
var stopNumber = 1;
var maxFontSize,minFontSize;
function CreateDiv(message){
    this.message = message;
    this.animates = this.getAnimates();//选择动画方式
    this.offAnimates = this.getOffAnimates();//选择消失动画方式
    this.divBox = document.getElementById("div");//div容器
    this.maxRight = this.divBox.offsetWidth - 50;
    this.maxButton = window.innerHeight -50;
    this.left = this.getLeft();//起始位置
    this.top = this.getTop();
    // this.speed = 1000;//动画时间（1000-5000毫秒）
    this.speed = 1000+getInt(Math.random()*2000);//动画时间（1000-5000毫秒）
    this.nowTime = 0;
    switch (this.animates){
        case 1:this.setDiv1();break;//设置第一种div
        case 2:this.setDiv2();break;
    }
    this.createRootDiv();
}
CreateDiv.prototype = {
    getLeft : function () {
        while (true){
            var a = getInt(this.divBox.offsetWidth*Math.random());
            if (a < this.maxRight -200)
                return a;
        }
    },
    getTop : function () {
        while (true){
            var a = getInt(window.innerHeight*Math.random());
            if (a < this.maxButton -100)
                return a;
        }
    },
    getAnimates : function () {
      return getInt(1 + Math.random()*2);
      //   return 2;
    },
    getOffAnimates : function () {
        return getInt(1 + Math.random()*2);
    },
    move : function () {
        this.nowTime += time;
        this.amendment();
        switch (this.animates){
            case 1:return this.move1();
            case 2:return this.move2();
        }
    },
    amendment : function () {
        if (this.div.offsetLeft < 0){
            this.left += 20;
            this.div.style.left = this.left + 'px';
        }if (this.div.offsetTop < 0){
            this.top +=20;
            this.div.style.top = this.top + 'px';
        }if (this.div.offsetLeft + this.div.offsetWidth > this.divBox.offsetWidth){
            this.left -= 20;
            this.div.style.left = this.left + 'px';
        }if (this.div.offsetHeight + this.div.offsetTop > window.innerHeight){
            this.top -= 20;
            this.div.style.top = this.top + 'px';
        }
    },
    setDiv1 : function () {//随机移动动画
        this.fontSize = getInt(Math.random()*120);//div块中字体的大小
        this.fontColor = getColor();//div块中字体的颜色
        this.offHorizontal = this.left + getInt((-300) + Math.random() * 600);//动画结束位置
        this.offVertical = this.top + getInt((-200) + Math.random() * 400);
        this.offFontSize = getInt(minFontSize + Math.random()*(maxFontSize - minFontSize));//div块中字体的大小
        this.changHorizontal = Math.abs(this.offHorizontal - this.left)/(this.speed/time);
        this.changVertical = Math.abs(this.offVertical - this.top)/(this.speed/time);
        this.changFontSize = Math.abs(this.offFontSize - this.fontSize)/(this.speed/time);
        this.initCss = "";
    },
    setDiv2 : function () {//旋转出现动画
        this.fontSize = 0;
        this.offFontSize = getInt(minFontSize + Math.random()*(maxFontSize - minFontSize));//div块中字体的大小
        this.fontColor = getColor();//div块中字体的颜色
        this.angle = 0;
        this.offAngle = (getInt((-60) + Math.random()*120) + getInt(1+ Math.random()*4) * 360);//旋转角度
        this.initCss = "";
    },
    createRootDiv : function () {
        this.div =  document.createElement('div');
        this.div.innerHTML = this.message;
        /*设置div初始样式*/
        this.div.style.position="absolute";
        this.div.style.zIndex="55";
        this.div.style.cssText += ";" +
            "width:auto;height:auto;" +
            "left:"+this.left+"px;" +
            "top:"+this.top+"px;" +
            "white-space:nowrap;" +
            "font-size:0px;" +
            "color:#"+this.fontColor+";" +
            "" + this.initCss;
        this.divBox.appendChild(this.div);
    },
    move1 : function(){//动画
        if (this.nowTime < this.speed){
            if (this.left > 10 && (this.left + this.div.clientWidth) < (this.maxRight-this.changHorizontal) && Math.abs(this.left - this.offHorizontal) > this.changHorizontal){
                this.left = this.left > this.offHorizontal ? this.left - this.changHorizontal : this.left + this.changHorizontal;
            }
            if (this.top > 10 && (this.top + this.div.clientHeight) < (this.maxButton - this.changVertical) && Math.abs(this.top - this.offVertical) > this.changVertical){
                this.top = this.top > this.offVertical ? this.top - this.changVertical : this.top + this.changVertical;
            }
            if (Math.abs(this.fontSize - this.offFontSize) > this.changFontSize){
                this.fontSize = this.fontSize >this.offFontSize ? this.fontSize - this.changFontSize : this.fontSize + this.changFontSize;
            }
            this.div.style.left = this.left + 'px';
            this.div.style.top = this.top + 'px';
            this.div.style.fontSize = this.fontSize + 'px';
            this.offFontSize % 3 == 0 ? this.div.style.color = '#'+getColor() : null;
            return "ok";
        }else {
            if (this.nowTime < this.speed + stopTime){

            }else if (this.nowTime < this.speed +offTime + stopTime){
                switch (this.offAnimates){
                    case 1:this.disappeared1();break;
                    case 2:this.disappeared2();break;
                }
            }else {
                this.div.parentNode.removeChild(this.div);
                return "off";
            }
        }
    },
    move2 : function () {
        var num = time/(this.speed - this.nowTime);
      if (this.nowTime < this.speed){
          if (this.fontSize < this.offFontSize){
              this.fontSize += getInt((this.offFontSize - this.fontSize) * num);
          }if (this.angle < this.offAngle){
              this.angle += getInt((this.offAngle - this.angle) * num);
          }
          this.div.style.fontSize = this.fontSize + 'px';
          this.offFontSize % 2 == 0 ? this.div.style.transform = "rotate("+this.angle+"deg)" : null;
          this.offFontSize % 4 == 0 ? this.div.style.color = '#' + getColor() : null;
      } else {
          if (this.nowTime < this.speed + stopTime){

          }else if (this.nowTime < this.speed +offTime + stopTime){
              switch (this.offAnimates){
                  case 1:this.disappeared1();break;
                  case 2:this.disappeared2();break;
              }
          }else {
              this.div.parentNode.removeChild(this.div);
              return "off";
          }
      }
    },
    disappeared1 : function () {
        var transation = this.div.style.opacity;
        if (transation == "")
            transation = 1;
        if (transation < 0)
            return ;
        this.div.style.opacity = transation - time/offTime;
    },
    disappeared2 : function () {
        var a = time/((this.speed + stopTime + offTime) - this.nowTime);
        var b = parseInt(this.div.style.fontSize);
        this.div.style.fontSize = getInt(b - b * a) + 'px';
        if (this.div.innerHTML.length % 3 == 0)
            return ;
        var c = isNaN(parseInt(this.div.style.transform.split("(")[1])) ? 0 : parseInt(this.div.style.transform.split("(")[1]);
        this.div.innerHTML.length % 2 == 0 ? this.div.style.transform = "rotate("+(c +getInt(10 + Math.random() *20))+"deg)" :
            this.div.style.transform = "rotate("+(c +getInt((-10) + Math.random() *(-20)))+"deg)";
    },
    deletea : function () {
        this.div.parentNode.removeChild(this.div);
    }
};

function CreateSnow(snowBox,src,style){
    this.snowBox = document.getElementById(snowBox);//找到容器
    this.snowStyle = Math.ceil(Math.random()*style);//雪花类型[1,2]
    this.maxLeft = this.snowBox.offsetWidth-Math.random()*5+3;//运动范围
    this.maxTop = this.snowBox.offsetHeight-Math.random()*5+3;
    this.left = this.snowBox.offsetWidth*Math.random();//起始位置
    this.top = this.snowBox.offsetHeight*Math.random();
    this.angle=1.1+0.8*Math.random();//飘落角度
    this.minAngle=1.1;
    this.maxAngle=1.9;
    this.angleDelta=0.01*Math.random();
    this.changSpeedNum = 1 + Math.random() * 0.5;
    this.speed = this.changSpeedNum;//下落速度
    this.createEle(src);//制作雪花dom   凹=放在最后，使得原型里能取到值
}
//雪片生成+下落
CreateSnow.prototype = {
    createEle : function(baseSrc){//生成雪花元素
        var srcIndex = baseSrc.lastIndexOf('.'),//获取最后一个'.'
            src = baseSrc.substring(0,srcIndex)+this.snowStyle+baseSrc.substring(srcIndex,baseSrc.length);
        var image = new Image();
        image.src = src;
        this.ele = document.createElement("img");
        this.ele.setAttribute('src',src);
        this.ele.style.position="absolute";
        this.ele.style.zIndex="99";
        this.imgW =10 + Math.random()*10 + 'px';
        this.ele.style.width = this.imgW;
        this.ele.style.height = this.imgW;
        this.snowBox.appendChild(this.ele);
        //设置雪花尺寸
        var img = this.ele;
        image.onload = function(){
            // if(isIE()){//如果旧IE，设置高度
            //     imgH = image.height;
            //     img.setAttribute('height',Math.ceil(imgH*(0.1+Math.random())));
            // }
        };
    },
    move : function(){//雪花运动
        if(this.angle< this.minAngle||this.angle>this.maxAngle){
            this.angleDelta=-this.angleDelta;
        }
        this.angle+=this.angleDelta;
        this.left+=this.speed*Math.cos(this.angle*Math.PI);
        this.top-=this.speed*Math.sin(this.angle*Math.PI);
        if(this.left<0){
            this.left=this.maxLeft;
        }else if(this.left>this.maxLeft){
            this.left=0
        }
        if(this.top>this.maxTop){//雪花掉出来后回到顶部
            this.top=0;
        }
        this.ele.style.left=this.left+'px';//凹=加‘px’
        this.ele.style.top=this.top+'px';
    },
    deletea : function () {
        this.ele.parentNode.removeChild(this.ele);
    },
    changSpeed : function (speed) {
        this.speed = this.changSpeedNum + (speed/10.0);
    }
};
function CreateFireworks(number,sum) {
    this.divBox = document.getElementById("div");
    this.left = (number+1)/(sum+1)*100;
    this.size = getInt(20 + Math.random() * 10);
    this.top = window.innerHeight - this.size;
    this.count = 0;
    this.fireTop = 0;
    this.maxCount = 1;
    this.childs = [];
    this.howChild = getInt(Math.random()*4 + 1);
    this.create();
    // this.createChild();
}
CreateFireworks.prototype = {
    create : function () {
        this.baseDiv = document.createElement("div");
        this.fireworkDiv = document.createElement("div");
        this.music = document.createElement("audio");
        this.fireworkDiv.innerHTML = "<samp>●</samp>";
        this.baseDiv.style.cssText= "position:absolute;" +
            "z-index:60;" +
            "left:" + this.left + "%;" +
            "top:" + this.top + "px" +
            "overflow:inherit;" +
            "background-color:red;" +
            "width:" + this.size + 'px;' +
            'height:' + this.size + 'px;';
        this.fireworkDiv.style.cssText= "position:absolute;" +
            "color:"+getFireColor()+";" +
            "top:" + this.fireTop + ";" +
            "width:" + this.size + 'px;' +
            'height:' + this.size + 'px;' +
            'font-size:' + this.size + 'px;';
        this.music.setAttribute('src',"music/1.mp3");
        this.baseDiv.appendChild(this.fireworkDiv);
        this.divBox.appendChild(this.baseDiv);
        this.fireworkDiv.appendChild(this.music);
    },
    createChild : function () {
        this.howChild ++;
      var childCount = 50 + getInt(Math.random() * 30);
      var scope = 100 +Math.random()*200;
      this.childMaxCount = getInt(10 + Math.random() * 20);
      for (var i = 0;i < childCount;i ++)
          this.childs.push(new CreateFireworkChild(this.fireworkDiv,getInt(i/childCount*360),scope,getInt(this.childMaxCount),false));
        this.playMp3(2);
    },
    createChildChild : function (left,top) {
        var childCount = 30 + getInt(Math.random() * 30);
        var scope = 50 +Math.random()*100;
        var c = document.createElement("div");
        c.setAttribute('class',"kiss");
        c.style.left = left;
        c.style.top = top;
        c.style.position = "absolute";
        c.style.zIndex = "99";
        this.fireworkDiv.appendChild(c);
        for (var i = 0; i < childCount;i ++)
            this.childs.push(new CreateFireworkChild(c,getInt(i/childCount*360),scope,getInt(this.childMaxCount),true));
        this.playMp3(3);
    },
    playMp3 : function (type) {
        var lists = this.divBox.getElementsByTagName('audio');
        for (var i =0;i < lists.length ;i ++){
            if (lists[i].ended)
                lists[i].parentNode.removeChild(lists[i]);
        }
        var mp3 = document.createElement('audio');
        mp3.setAttribute('src',"music/"+ type +".mp3");
        mp3.setAttribute('autoplay','autoplay');
        this.divBox.appendChild(mp3);
    },
    move : function () {
        this.amendment();
        this.baseDiv.style.top = this.top + 'px';
        this.count == 0 ?  this.music.play() : null;
        if (this.count < this.maxCount){
            this.fireTop += (400/this.maxCount + this.number - 5);
            this.count ++;
        }else {
            this.fireworkDiv.firstElementChild.innerHTML = "";
            if (this.count == this.maxCount){
                this.music.pause();
                this.music.currentTime = 0;
                this.childs = [];
                this.createChild();
                this.count = 100000;
            }
            else if (this.childs.length > 0){
                getInt(Math.random() * 200) == 5 ? this.createChild() : null;
                for (var k = 0;k <this.childs.length;k ++){
                    try {
                        var map = this.childs[k].move();
                        if (map[0] == "remove"){
                            getInt(Math.random() * 50) == 5 && !map[3] ? this.createChildChild(map[1],map[2]) : null;
                            this.childs.splice(k,1);
                        }
                    }catch (e){
                        console.log(e);
                    }
                }
            }else {
                if (getInt(Math.random()*30) == 5){
                    this.fireTop = 0;
                    this.count = 0;
                    this.number = Math.random()*(500/this.maxCount);
                    this.howChild = getInt(Math.random()*3 + 1);
                    var lists = document.getElementsByClassName("kiss");
                    for (var i =0;i < lists.length; i ++)
                        lists[i].parentNode.removeChild(lists[i]);
                    this.fireworkDiv.firstElementChild.innerHTML = "●";
                }
            }
        }
        this.fireworkDiv.style.top = '-'+this.fireTop +'px';
        this.baseDiv.style.top = this.top + 'px';
    },
    amendment : function () {
        this.top = window.innerHeight - this.size;
    },
    deletea : function () {
        this.baseDiv.removeChild(this.fireworkDiv);
        this.baseDiv.parentNode.removeChild(this.baseDiv);
        this.baseDiv.style.display = 'none';
        this.fireworkDiv.style.display = 'none';
    },
    changSpeed : function (count) {
        this.maxCount = getInt(55 - count);
        this.number = Math.random()*(600/this.maxCount);
    }

};
function CreateFireworkChild(boxDiv,angle,scope,maxCount,iscc) {
    this.iscc = iscc;
    this.divBox = boxDiv;
    this.left = 0;
    this.top = 0;
    this.count = 0;
    this.offLeft = scope*Math.cos(2*Math.PI/360*angle);
    this.offTop = scope*Math.sin(2*Math.PI/360*angle);
    this.maxCount = maxCount;
    this.size = parseInt(this.divBox.style.fontSize)-5;
    this.create();
}
CreateFireworkChild.prototype = {
    create : function () {
        this.div = document.createElement("div");
        this.div.innerHTML = "●";
        this.div.style.cssText= "position:absolute;" +
            "color:"+getFireColor()+";" +
            "top:" + this.fireTop + ";" +
            "width:" + this.size + 'px;' +
            'height:' + this.size + 'px;' +
            'font-size:' + this.size + 'px;' +
            'z-Index:99;';
        this.divBox.appendChild(this.div);
    },
    move : function () {
        if (this.count < this.maxCount){
            this.left += 1/this.maxCount*this.offLeft;
            this.top += 1/this.maxCount*this.offTop;
            this.div.style.left = this.left + 'px';
            this.div.style.top = this.top + 'px';
            this.div.style.transform = "scale("+(this.maxCount - this.count)/this.maxCount+")";
            this.count ++;
            return ["noremove"];
        }else {
            var left = this.div.style.left;
            var top = this.div.style.top;
            this.iscc ? this.div.parentNode.removeChild(this.div) :this.div.parentNode.removeChild(this.div);
            // this.div.parentNode.removeChild(this.div);
            return ['remove',left,top,this.iscc];
        }
    }
};
//下雪启动
function goSnow(snowBox,src,num,style){
    if (num > snowArr.length){
        for (;num > snowArr.length;){
            snowArr.push(new CreateSnow(snowBox,src,style));
        }
    }else {
        for (;num < snowArr.length;){
            snowArr[0].deletea();
            snowArr.splice(0,1);
        }
    }
}
function getFireColor() {
    var a = getInt(Math.random()*5);
    switch (a){
        case 0:return "#ffeff6";
        case 1:return "#D8FFFD";
        case 2:return "#f2ffe8";
        case 3:return "#FFD5D5";
        case 4:return "#FFBDF2";
    }
}
function goFireworks(num) {
    if (num == fireworks.length)
        return ;
    for (;fireworks.length > 0;){
        fireworks[0].deletea();
        fireworks.splice(0,1);
    }
    for (var i = 0;i < num;i ++)
        fireworks.push(new CreateFireworks(i,num));
}

function getInt(float) {
    return Math.floor(float);
}
function getColor() {
    return ("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
}

function sleep(changeTime) {
    for (var t=Data.now();Data.now()-t<=changeTime;){

    }
}
function main() {
    setP(1);
    setInterval(function() {
        try {
            for (var i = 0; i < messageList.length; i++) {
                if (stopNumber == 1)
                    break;
                if (messageList[i]) {
                    var s = messageList[i].move();
                    if (s == "off") {
                        messageList.splice(i, 1);
                    }
                }
            }
            for (var j = snowArr.length - 1; j >= 0; j--) {//找到数组中的最新的一个
                if (snowArr[j]) {
                    snowArr[j].move();
                }
            }
            for (var k = fireworks.length - 1;k >= 0 ; k--){
                fireworks[k].move();
            }
        }catch (e) {
        }

    },time);

}

function setP(isClear) {
    var a = document.getElementsByName("ptype");
    var P_speed = document.getElementById("range_P_speed").value;
    var num = document.getElementById("range_P_number").value;
    var p = document.getElementById("output_num_speed");
    var str = p.innerHTML.split(";");
    str[0] = str[0].replace(/\w+/,num);
    str[1] = str[1].replace(/\w+/,P_speed);
    p.innerHTML = str[0] + ";"+str[1];
    var value;
    for (var i = 0;i < a.length;i ++){
        if (a[i].checked){
            value = a[i].value;
            break;
        }
    }
    isClear == 1 ? clearScreen(1): null;
    switch (value){
        case "雪花":goSnow("div","image/snow.png",num,5);break;
        case "烟花":goFireworks(getInt(num/10));break;
        case "玫瑰":goSnow("div","image/roses.png",num,4);break;
        case "爱心":goSnow("div","image/heard.png",num,3);break;
        case "无":break;
    }
    var speed = function () {
        for (var i = 0;i < snowArr.length;i ++){
            snowArr[i].changSpeed(P_speed);
        }
        for (i = 0;i < fireworks.length;i ++){
            fireworks[i].changSpeed(P_speed);
        }
    };
    speed();
    changFontSize();
}
function changFontSize() {
    var min = document.getElementById("font_min_size").value;
    var max = document.getElementById("font_max_size").value;
    if (parseInt(min) > parseInt(max)){
        document.getElementById("font_min_size").disabled = true;
        document.getElementById("font_max_size").disabled = true;
        document.getElementById("font_min_size").value = parseInt(max);
        min = max;
    }
    maxFontSize = parseInt(max);
    minFontSize = parseInt(min);
    document.getElementById("font_min_size").disabled = false;
    document.getElementById("font_max_size").disabled = false;
    document.getElementById("preview_font_1").style.fontSize = min + 'px';
    document.getElementById("preview_font_2").style.fontSize = max + 'px';
}
function start() {
    document.getElementById("preview_font_1").style.display = "none";
    document.getElementById("controller").style.display = "none";
    document.getElementById("preview_font_2").style.display = "none";
    document.getElementById("input").style.display = "block";
    stopNumber = stopNumber == 0 ? 1 : 0;
    stopNumber == 0 ? send('start') : send('stop');
}
function clearScreen(type) {
    stopNumber = 1;
    for (; messageList.length > 0 && type != 1;){
        messageList[0].deletea();
        messageList.splice(0,1);
    }
    for (; snowArr.length > 0 && type != 2;){
        snowArr[0].deletea();
        snowArr.splice(0,1);
    }
    for (; fireworks.length > 0 && type != 2;){
        fireworks[0].deletea();
        fireworks.splice(0,1);
    }
}
function initSetting() {
    var set = document.getElementById("settingDiv");
    var input = document.getElementById("input");
    set.style.display == "none" ? set.style.display = "block" : set.style.display = "none";
}
function showSetting() {
    document.getElementById("preview_font_1").style.display = "block";
    document.getElementById("controller").style.display = "block";
    document.getElementById("preview_font_2").style.display = "block";
    document.getElementById("input").style.display = "none";
    clearScreen(2);
    send('stop')
}

main();
setBackImage();
function setBackImage() {
    var a = document.getElementById("background_image");
    a.style.cssText = 'width:' + document.body.clientWidth + 'px;' +
        'height:' + window.innerHeight + 'px;';
}
document.onkeydown=function(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if(e && e.keyCode==27){
        showSetting();
    }
    if(e && e.keyCode==32){
        start();
    }
    if(e && e.keyCode==13){ // enter 键要做的事情

    }
};
function addMessage() {
    var message = document.getElementById("ka").value;
    if (message == ""){
        return;
    }
    $.ajax({
        cache: true,
        type: "GET",
        url:httpHost + "/system/add.do",
        // data:"message=" + "测试" + i,
        data:"message=" + document.getElementById("ka").value,
        async: false,
        beforeSend:function () {
            document.getElementById("submit").disabled = true;
        },
        complete: function () {

        },
        error: function() {
            document.getElementById("submit").disabled = false;
            return true;
        },
        success: function() {
            console.log("succeed");
            document.getElementById("ka").value = "";
            document.getElementById("submit").disabled = false;
            return true;
        }
    });
}
var webSocket = null;
if ("WebSocket" in window) {
    webSocket = new WebSocket(wsHost + "/WebSocket/message");
    webSocket.onerror = function(event) {
        // console.info(event);
    };
    webSocket.onopen = function(event) {
        // console.info(event);

    };
    webSocket.onmessage = function(event) {
        messageList.push(new CreateDiv(event.data));
    };
    webSocket.onclose = function(event) {
        // console.info(event);
    };
    window.onbeforeunload = function(event) {
        webSocket.close();
    };
}
function send(type) {
    webSocket.send(type);
}
window.onresize=function(){
    setBackImage();
};