(function(exports) {

/****
 * ChartView 模仿backbone的View类
 * 主要用途为:
 * 1. 派生具体子类 NewView= ChartView.extend(function NewView构造函数())
 * 2. 提供abbrMap等常数列表和通用函数
 * 另虽没有定义, 所有具体的View子类都(应)具有render(data)方法用于处理dom更新
 */
var ChartView = exports.ChartView = function(options) {
    this.data = null;
    this.R = null;
};
ChartView.abbrMap = {
    '白羊':'aries',
    '金牛':'taurus',
    '双子':'gemini',
    '巨蟹':'cancer',
    '狮子':'leo',
    '处女':'virgo',
    '天秤':'libra',
    '天蝎':'scorpio',
    '射手':'sagittarius',
    '摩羯':'capricorn',
    '水瓶':'aquarius',
    '双鱼':'pisces',

    "北京":"beijing",
    "天津":"tianjin",
    "河北":"hebei",
    "山西":"shanxi",
    "内蒙古":"neimenggu",
    "辽宁":"liaoning",
    "吉林":"jilin",
    "黑龙江":"heilongjiang",
    "上海":"shanghai",
    "江苏":"jiangsu",
    "浙江":"zhejiang",
    "安徽":"anhui",
    "福建":"fujian",
    "江西":"jiangxi",
    "山东":"shandong",
    "河南":"henan",
    "湖北":"hubei",
    "湖南":"hunan",
    "广东":"guangdong",
    "广西":"guangxi",
    "海南":"hainan",
    "重庆":"chongqing",
    "四川":"sichuan",
    "贵州":"guizhou",
    "云南":"yunnan",
    "西藏":"xizang",
    "陕西":"shanxi",
    "甘肃":"gansu",
    "青海":"qinghai",
    "宁夏":"ningxia",
    "新疆":"xinjiang",
    "台湾":"taiwan",
    "香港":"xianggang",
    "澳门":"aomen",
    "海外":"haiwai",

    '有钱人':"high",
    '白领':"medium",
    '学生':"low",

    '高':"high",
    '中':"medium",
    '低':'low',

    '男':"male",
    '女':"female",

    '新手买家':"novice",
    '初级买家':"easy",
    '中等买家':"normal",
    '资深买家':"hard",
    '骨灰级买家':"lunatic"

};
function extend(subClass, superClass)  {
    var F = function() {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.__super__ = superClass.prototype;
    return subClass;
}
ChartView.options= ['el', 'id', 'attributes', 'className', 'tagName'];
ChartView.prototype._configure = function(options) {
    if (this.opts) opts = $.extend({}, this.opts, options);
    //部分属性映射到view本体
    for (var i = 0, l = ChartView.options.length; i < l; i++) {
        var attr = ChartView.options[i];
        if (options[attr]) this[attr] = options[attr];
    }
    this.opts = options;
};
/****
 * 主方法, 派生一个具体View
 */
ChartView._extendView= function (initFunc, superClass) {
    var newView= function(options) {
        this._configure(options||{});
        initFunc.apply(this, arguments);
    };
    extend(newView, superClass);
    newView.extend= function(newInit) {     //为生成的View加上extend方法
        return ChartView._extendView(newInit, newView);
    };
    return newView;
};
ChartView.extend= function(initFunc) {
    return ChartView._extendView(initFunc, ChartView);
};

/****
 * 给定总高度/宽度, 按数据划分各部分比例
 * demo参考cpv页的星座图
 * @ul 其li需要进行处理的ul元素
 * @data 和li相关联的数据
 * @option 其他参数, 包含{
                - el 需要更新高度/宽度的元素选择器
                - maxScale 
                - minScale 最小值
                - gutterScale 间距值
                - type 为{ width, height}
                - useFx (Boolean) 是否使用动画
              }
 ****/
ChartView.prototype.scaleBalance= function(ul, data, options) {
    if(data.length <= 0) {
        return;
    }
    var $lis = $(ul).find(options.el || 'li');
    if($lis.length === 0){
        return;
    }
    options.type= options.type || 'width';
    if (!options.minScale){
        options.minScale = parseInt($lis.css('min-' + options.type)) || 0;
    }
    options.gutterScale = options.gutterScale || 0;

    var sum = 0, t_remain = t_total = parseInt($(ul).css(options.type));
    $lis.each(function(i, li) {
        var v = data[i].value;
        sum += v;
        $(li).data('value', v);
    });
    $lis.sort(function(a, b) {
        return $(a).data('value') - $(b).data('value');
    });
    var last = $lis.length - 1;
    $lis.each(function(i, li) {
        if(i === last) {
            return;
        }
        var $li = $(li);
        var t = Math.round(t_total * $li.data('value') / sum);
        var tg = t - options.gutterScale;
        if (tg < options.minScale){
            tg = options.minScale;
            t = tg + options.gutterScale;
        }
        t_remain = t_remain - t - options.gutterScale;
        var styles = {};
        styles[options.type] = tg + 'px';
        $li.animate(styles, 'slow');
    });
    var styles = {};
    styles[options.type] = t_remain + 'px';
    $($lis[last]).animate(styles, 'slow');
};
/****
 * 给定最大高度/宽度, 按数据划分各部分比例
 * demo参考cpv页的性别图
 * @ul 其li需要进行处理的ul元素
 * @data 和li相关联的数据
 * @option 其他参数, 包含{
                - el 需要更新高度/宽度的元素选择器
                - minScale
                - maxScale 最大值
                - type 为{ width, height}
                - useFx (Boolean) 是否使用动画
              }
 ****/
ChartView.prototype.scaleToMax= function(ul, data, options) {
    if (data.length <=0) {
        return;
    }
    var $ul = $(ul)
      , $lis = $ul.find(options.el || 'li');
    if($lis.length === 0) {
        return;
    }
    if(!options.type) {
        options.type= 'width';
    }
    if(!options.minScale) {
        options.minScale= parseInt($lis.css('min-'+options.type)) || 0;
    }
    if(!options.maxScale) {
        options.maxScale= parseInt($lis.css('max-'+options.type)) || parseInt($ul.css(options.type));
    }
    //计算最大值并由此确定最大宽度
    var maxValue = data[0].value;
    for (var i=0, len = data.length; i < len; i++) {
        if (data[i].value > maxValue) {
            maxValue = data[i].value;
        }
    }
    var r = options.maxScale/maxValue; //统一缩放比例
    $lis.each(function(i, li) {
        if (i >= data.length) {
            return false;
        }
        var t = Math.round(data[i].value * r);
        if (t < options.minScale) {
            t = options.minScale;
        }
        var styles = {};
        styles[options.type] = t + 'px';
        $(li).animate(styles, 'slow');
    });
};
/****
 * 从obj数组中拉出特定key作为数组
 * @param obj {[object]}
 */
ChartView.plate= function(obj, key) {
    var arr = [];
    if (obj.length !== undefined) {
        for(var i = 0, len = obj.length; i < len; i++) {
            if(obj[i][key] !== null) {
                arr.push(obj[i][key]);
            }
        }
    } else if(typeof(obj) === 'object') {
        for(var i in obj) {
            if(data[i][key] !==null) {
                arr.push(data[i][key]);
            }
        }
    }
    return arr;
};

/****
 * 从dom获取数值
 * 缺省有两种方式  1 DOM的.name, .value有相应值
 *                2 DOM有value属性, 此时其text作为name
 ****/
ChartView.prototype.dataFromDOM = function(opts) {
    var container= this.R;
    var defaults= {
            el: 'li',
            template: {
                name: "",
                value: 0
            }
    };
    opts = opts ||{};
    opts.el= opts.el || defaults.el;
    opts.template = opts.template || defaults.template;
    var data = [];
    $(container).find(opts.el).each(function() {
        var $this = $(this);
        var value = $this.val(), name = null;
        if (value) {
            name = $this.text();
        } else {
            name = $this.find('.name').text();
            value = parseInt($this.find('.value').text());
        }
        data.push({
            'name': name,
            'value': value
        });
    });
    return data;
};

})(function() {
    if(!window.shu) {
        window.shu = {};
    }
    return window.shu;
}());