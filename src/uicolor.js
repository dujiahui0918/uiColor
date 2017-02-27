
$(function(){

    /**
 * RGB 颜色值转换为 HSL.
 * 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
 * r, g, 和 b 需要在 [0, 255] 范围内
 * 返回的 h, s, 和 l 在 [0, 1] 之间
 *
 * @param   Number  r       红色色值
 * @param   Number  g       绿色色值
 * @param   Number  b       蓝色色值
 * @return  Array           HSL各值数组
 */
    function rgbToHsl(r,g,b){
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min){
            h = s = 0; // achromatic
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [parseInt(h*100), parseInt(s*100), parseInt(l*100)];
    }

    /**
 * HSL颜色值转换为RGB. 
 * 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * h, s, 和 l 设定在 [0, 1] 之间
 * 返回的 r, g, 和 b 在 [0, 255]之间
 *
 * @param   Number  h       色相
 * @param   Number  s       饱和度
 * @param   Number  l       亮度
 * @return  Array           RGB色值数值
 */
    function hslToRgb(h,s,l){
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    //rgb转化为16进制
    function componentToHex(c) {
    var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r,g,b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }


    var draw = function(img){
        var canvas = document.getElementById("canvas");
        var c = canvas.getContext("2d");
        c.shadowBlur = 20;
        c.shadowColor = "#000000";
        c.drawImage(img, 0, 0);

        canvas = $("#canvas");
        canvas.click(function (e) {
            var canvasOffset = canvas.offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);
            var colorData = document.getElementById("canvas").getPixelColor(canvasX, canvasY);
        // 获取该点像素的数据
            var color = colorData.rgb;
            $(".left").css("backgroundColor", color);
            $("#currentColor").html("当前像素(" + canvasX + "," + canvasY + ")颜色为: " + color);
            var aa = color.substring(4,color.length-1);
            var bb = aa.split(",");
            var hs = rgbToHsl(bb[0],bb[1],bb[2]);
            for(var i =0;i<3;i++){
                $(".RGB").find("input").eq(i).attr("value",bb[i]); 
                $(".HSL").find("input").eq(i).attr("value",hs[i]);  
            }            
            var cursorX = (e.pageX - 5) + "px";
            var cursorY = (e.pageY - 5) + "px";
            $("#cursor").stop(true, true).css({
                "display" : "inline-block",
                "left" : cursorX,
                "top" : cursorY
            }).fadeOut(2500);
        });
    } 
    var img = new Image();
    img.src = "images/bar.png";
    $(img).load(function () {
        draw(img);
    });
    
    $(".RGB").find("input").on("change",function(){
        var rr = parseInt($(".RGB").find("input").eq(0).val()),gg = parseInt($(".RGB").find("input").eq(1).val()),bbb = parseInt($(".RGB").find("input").eq(2).val());
        var aaa = rgbToHex(rr,gg,bbb);
        $(".left").css("backgroundColor", aaa);
    })

    $(".HSL").find("input").on("change",function(){
        //先把hsl转化为Rgb.再转为16进制
        var hh = parseInt($(".HSL").find("input").eq(0).val())/100,ss = parseInt($(".HSL").find("input").eq(1).val())/100,ll = parseInt($(".HSL").find("input").eq(1).val())/100;
        var hhh = hslToRgb(hh,ss,ll);
        var hc = rgbToHex(hhh[0],hhh[1],hhh[2]);
        $(".left").css("backgroundColor", hc);
    })
})


