//weiboanjian
var _config = new Object;
var Config = _config.property = {
    IdolDataBase: { "newweibo": "", "host": "http://10.16.0.182/jsonServer/"
    }, JsonFileName: { "rayjson": "rayjson.json", "level": "countResult.json", "follow": "followResult.json",
        "province": "provinceResult.json", "timetend": "trendResult.json",
        "emotionResult": "emotionResult.json", "newrayjson": "newrayjson.json",
        "ForwardingSort": "forwardingsort.json"
    },
    VideoDataBase: { "videoHost":"http://10.16.0.183/" },
    TargetDatabaseName: "Archive",
    HotWordPath: "json/hotword/",
    HotIndustry: "json/hotindustry/",

    SiteNames: { "cntv": "中国网络电视台", "youku": "优酷视频", "tudou": "土豆视频", "sina": "新浪视频", "tencent": "腾讯视频", "ku6": "酷6视频", "56.com": "56视频", "yinyuetai": "音乐台" },
    MediaType: { "1": "平面媒体", "2": "网络新闻", "3": "电视", "4": "论坛", "5": "博客", "6": "微博", "7": "其它" },
    WeiboSource: ["", "新浪微博", "腾讯微博", "凤凰微博", "网易微博", "搜狐微博", "6", "7", "8", "9", "10", "", "", "", ""],
    WeiboPingLunUrl: ["", "?type=comment", "?filter=6", "", "", "", "", "", "", "", "", "", ""],
    WeiboZhuanFaUrl: ["", "?type=repost", "?filter=5", "", "", "", "", "", "", "", "", "", ""],
    CityList: { "list": [{ "value": "0", "name": "选择城市" }, { "value": "北京", "name": "北京" }, { "value": "天津", "name": "天津" }, { "value": "上海", "name": "上海" }, { "value": "重庆", "name": "重庆" }, { "value": "安徽", "name": "安徽" }, { "value": "福建", "name": "福建" }, { "value": "广东", "name": "广东" }, { "value": "甘肃", "name": "甘肃" }, { "value": "广西", "name": "广西" }, { "value": "宁夏", "name": "宁夏" }, { "value": "青海", "name": "青海" }, { "value": "四川", "name": "四川" }, { "value": "贵州", "name": "贵州" }, { "value": "海南", "name": "海南" }, { "value": "湖北", "name": "湖北" }, { "value": "河北", "name": "河北" }, { "value": "河南", "name": "河南" }, { "value": "黑龙江", "name": "黑龙江" }, { "value": "湖南", "name": "湖南" }, { "value": "吉林", "name": "吉林" }, { "value": "江苏", "name": "江苏" }, { "value": "江西", "name": "江西" }, { "value": "辽宁", "name": "辽宁" }, { "value": "内蒙古", "name": "内蒙古" }, { "value": "山东", "name": "山东" }, { "value": "山西", "name": "山西" }, { "value": "陕西", "name": "陕西" }, { "value": "新疆", "name": "新疆" }, { "value": "西藏", "name": "西藏" }, { "value": "云南", "name": "云南" }, { "value": "浙江", "name": "浙江" }, { "value": "澳门", "name": "澳门" }, { "value": "台湾", "name": "台湾" }, { "value": "香港", "name": "香港"}] },
    GetTime: function (split) {
        var result = "";
        var today = new Date();
        var d = today.getDate();
        var M = today.getMonth() + 1;
        var y = today.getFullYear();
        d = d < 10 ? "0" + d : d;
        M = M < 10 ? "0" + M : M;
        if (split == undefined || split == "" || split == null) {
            split = "-";
        }
        var result = y + split + M + split + d;
        return result;
    },
    GetTimeDDMMYYYY: function (split) {
        var today = new Date();
        var d = today.getDate();
        var M = today.getMonth() + 1;
        var y = today.getFullYear();
        d = d < 10 ? "0" + d : d;
        M = M < 10 ? "0" + M : M;
        if (split == undefined || split == "" || split == null) {
            split = "-";
        }
        var result = d + split + M + split + y;
        return result;

    }
}

/*
辅助时间扩展
*/
Date.prototype.addDay = function (val) {
    var ns = this.getTime();
    var ps = val * 1000 * 60 * 60 * 24;
    var nS = ns;
    nS = ns + ps;
    return new Date(parseInt(nS));
}






// JavaScript Document
var _Common = new Object;
var MenuList = { "首页": "Default.aspx?首页", "高级搜索": "Default.aspx?高级搜索", "舆情专题": "Default.aspx?舆情专题", "舆情分类": "Default.aspx?舆情分类", "热点分布": "Default.aspx?热点分布", "舆情趋势": "Default.aspx?舆情趋势",
    "舆情词库": "sensitive.html", "定制信息": "agent.html", "系统设置": { "分类训练": "training.html", "关键词训练": "cluster_train.html", "专题设置": "topic_setting.html", "定制信息管理": "AgentManage.html", "词库维护": "SensitiveWord.html",
        "后台管理中心": "demo_admin/admin_Default.htm"
    }
};
var Common = _Common.prototype = {
    SinaExpression: { "[国旗]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/dc/flag_thumb.gif", "[飞个吻]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8a/lxhblowakiss_thumb.gif", "[江南style]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/67/gangnamstyle_thumb.gif", "[笑哈哈]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/32/lxhwahaha_thumb.gif", "[泪流满面]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/64/lxhtongku_thumb.gif", "[带感]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d2/lxhdaigan_thumb.gif", "[得瑟]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ca/lxhdese_thumb.gif", "[gst耐你]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1b/gstnaini_thumb.gif", "[gst好羞射]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8b/gsthaoxiushe_thumb.gif", "[xb小花]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c2/xbxiaohua_thumb.gif", "[xb压力]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e0/xbyali_thumb.gif", "[din推撞]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/dd/dintuizhuang_thumb.gif", "[草泥马]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7a/shenshou_thumb.gif", "[神马]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/60/horse2_thumb.gif", "[浮云]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/fuyun_thumb.gif", "[给力]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c9/geili_thumb.gif", "[围观]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f2/wg_thumb.gif", "[威武]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/vw_thumb.gif", "[熊猫]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6e/panda_thumb.gif", "[兔子]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/81/rabbit_thumb.gif", "[奥特曼]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/otm_thumb.gif", "[囧]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/15/j_thumb.gif", "[互粉]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/hufen_thumb.gif", "[礼物]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c4/liwu_thumb.gif", "[呵呵]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ac/smilea_thumb.gif", "[嘻嘻]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0b/tootha_thumb.gif", "[哈哈]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6a/laugh.gif", "[可爱]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/14/tza_thumb.gif", "[可怜]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/af/kl_thumb.gif", "[挖鼻屎]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a0/kbsa_thumb.gif", "[吃惊]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f4/cj_thumb.gif", "[害羞]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6e/shamea_thumb.gif", "[挤眼]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c3/zy_thumb.gif", "[闭嘴]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/29/bz_thumb.gif", "[鄙视]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/71/bs2_thumb.gif", "[爱你]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/lovea_thumb.gif", "[泪]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9d/sada_thumb.gif", "[偷笑]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/19/heia_thumb.gif", "[亲亲]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8f/qq_thumb.gif", "[生病]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/b6/sb_thumb.gif", "[太开心]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/58/mb_thumb.gif", "[懒得理你]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/17/ldln_thumb.gif", "[右哼哼]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/98/yhh_thumb.gif", "[左哼哼]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/zhh_thumb.gif", "[嘘]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a6/x_thumb.gif", "[衰]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/af/cry.gif", "[委屈]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/73/wq_thumb.gif", "[吐]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9e/t_thumb.gif", "[打哈欠]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f3/k_thumb.gif", "[抱抱]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/27/bba_thumb.gif", "[怒]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7c/angrya_thumb.gif", "[疑问]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/5c/yw_thumb.gif", "[馋嘴]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a5/cza_thumb.gif", "[拜拜]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/88_thumb.gif", "[思考]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e9/sk_thumb.gif", "[汗]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/24/sweata_thumb.gif", "[困]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7f/sleepya_thumb.gif", "[睡觉]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6b/sleepa_thumb.gif", "[钱]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/90/money_thumb.gif", "[失望]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0c/sw_thumb.gif", "[酷]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/cool_thumb.gif", "[花心]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8c/hsa_thumb.gif", "[哼]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/49/hatea_thumb.gif", "[鼓掌]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/36/gza_thumb.gif", "[晕]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d9/dizzya_thumb.gif", "[悲伤]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1a/bs_thumb.gif", "[抓狂]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/62/crazya_thumb.gif", "[黑线]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/91/h_thumb.gif", "[阴险]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/yx_thumb.gif", "[怒骂]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/nm_thumb.gif", "[心]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/hearta_thumb.gif", "[伤心]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ea/unheart.gif", "[猪头]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/58/pig.gif", "[ok]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d6/ok_thumb.gif", "[耶]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d9/ye_thumb.gif", "[good]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d8/good_thumb.gif", "[不要]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c7/no_thumb.gif", "[赞]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d0/z2_thumb.gif", "[来]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/come_thumb.gif", "[弱]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d8/sad_thumb.gif", "[蜡烛]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/91/lazu_thumb.gif", "[蛋糕]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6a/cake.gif", "[钟]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d3/clock_thumb.gif", "[话筒]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1b/m_thumb.gif", "[转发]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/02/lxhzhuanfa_thumb.gif", "[笑哈哈]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/32/lxhwahaha_thumb.gif", "[得意地笑]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d4/lxhdeyidixiao_thumb.gif", "[噢耶]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/3b/lxhxixi_thumb.gif", "[偷乐]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/fa/lxhtouxiao_thumb.gif", "[泪流满面]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/64/lxhtongku_thumb.gif", "[巨汗]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f6/lxhjuhan_thumb.gif", "[抠鼻屎]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/48/lxhkoubishi_thumb.gif", "[求关注]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ac/lxhqiuguanzhu_thumb.gif", "[真V5]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/3a/lxhv5_thumb.gif", "[群体围观]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a8/lxhweiguan_thumb.gif", "[hold住]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/05/lxhholdzhu_thumb.gif", "[羞嗒嗒]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/df/lxhxiudada_thumb.gif", "[非常汗]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/42/lxhpubuhan_thumb.gif", "[许愿]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/87/lxhxuyuan_thumb.gif", "[崩溃]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c7/lxhzhuakuang_thumb.gif", "[好囧]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/96/lxhhaojiong_thumb.gif", "[震惊]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e7/lxhchijing_thumb.gif", "[别烦我]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/22/lxhbiefanwo_thumb.gif", "[不好意思]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/b4/lxhbuhaoyisi_thumb.gif", "[纠结]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1f/lxhjiujie_thumb.gif", "[拍手]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e3/lxhguzhang_thumb.gif", "[给劲]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a5/lxhgeili_thumb.gif", "[好喜欢]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d6/lxhlike_thumb.gif", "[好爱哦]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/74/lxhainio_thumb.gif", "[路过这儿]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ac/lxhluguo_thumb.gif", "[悲催]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/43/lxhbeicui_thumb.gif", "[不想上班]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6b/lxhbuxiangshangban_thumb.gif", "[躁狂症]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ca/lxhzaokuangzheng_thumb.gif", "[甩甩手]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a6/lxhshuaishuaishou_thumb.gif", "[瞧瞧]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8b/lxhqiaoqiao_thumb.gif", "[同意]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/14/lxhtongyi_thumb.gif", "[喝多了]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a7/lxhheduole_thumb.gif", "[啦啦啦啦]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/3d/lxhlalalala_thumb.gif", "[杰克逊]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e5/lxhjiekexun_thumb.gif", "[雷锋]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7a/lxhleifeng_thumb.gif", "[带感]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d2/lxhdaigan_thumb.gif", "[亲一口]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/88/lxhqinyikou_thumb.gif", "[飞个吻]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8a/lxhblowakiss_thumb.gif", "[加油啊]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/03/lxhjiayou_thumb.gif", "[七夕]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9a/lxhqixi_thumb.gif", "[困死了]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/00/lxhkunsile_thumb.gif", "[有鸭梨]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7e/lxhyouyali_thumb.gif", "[右边亮了]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ae/lxhliangle_thumb.gif", "[撒花]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/b3/lxhfangjiala_thumb.gif", "[好棒]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/3e/lxhhaobang_thumb.gif", "[想一想]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e9/lxhxiangyixiang_thumb.gif", "[下班]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f2/lxhxiaban_thumb.gif", "[最右]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c8/lxhzuiyou_thumb.gif", "[丘比特]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/35/lxhqiubite_thumb.gif", "[中箭]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/81/lxhzhongjian_thumb.gif", "[互相膜拜]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/3c/lxhhuxiangmobai_thumb.gif", "[膜拜了]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/52/lxhmobai_thumb.gif", "[放电抛媚]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d0/lxhfangdianpaomei_thumb.gif", "[霹雳]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/41/lxhshandian_thumb.gif", "[被电]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ed/lxhbeidian_thumb.gif", "[拍砖]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/3b/lxhpaizhuan_thumb.gif", "[互相拍砖]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/5b/lxhhuxiangpaizhuan_thumb.gif", "[采访]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8b/lxhcaifang_thumb.gif", "[发表言论]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f1/lxhfabiaoyanlun_thumb.gif", "[江南style]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/67/gangnamstyle_thumb.gif", "[牛]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/24/lxhniu_thumb.gif", "[玫瑰]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f6/lxhrose_thumb.gif", "[赞啊]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/00/lxhzan_thumb.gif", "[推荐]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e9/lxhtuijian_thumb.gif", "[放假啦]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/37/lxhfangjiale_thumb.gif", "[萌翻]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/99/lxhmengfan_thumb.gif", "[月儿圆]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/3d/lxhyueeryuan_thumb.gif", "[招财]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a9/lxhzhaocai_thumb.gif", "[赶火车]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a2/lxhganhuoche_thumb.gif", "[立志青年]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f9/lxhlizhiqingnian_thumb.gif", "[得瑟]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ca/lxhdese_thumb.gif", "[微博三岁啦]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1e/lxhweibo3yr_thumb.gif", "[复活节]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d6/lxhfuhuojie_thumb.gif", "[挤火车]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/09/lxhjihuoche_thumb.gif", "[愚人节]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/21/lxhyurenjie_thumb.gif", "[收藏]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/83/lxhshoucang_thumb.gif", "[喜得金牌]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a2/lxhhappygold_thumb.gif", "[夺冠感动]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/69/lxhduoguan_thumb.gif", "[冠军诞生]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/2c/lxhguanjun_thumb.gif", "[传火炬]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f2/lxhchuanhuoju_thumb.gif", "[奥运金牌]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/06/lxhgold_thumb.gif", "[奥运银牌]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/43/lxhbronze_thumb.gif", "[奥运铜牌]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/fd/lxhsilver_thumb.gif", "[德国队加油]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/12/germany_thumb.gif", "[西班牙队加油]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/be/spain_thumb.gif", "[葡萄牙队加油]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f8/portugal_thumb.gif", "[意大利队加油]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/03/italy_thumb.gif", "[耍花灯]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/be/lxhshuahuadeng_thumb.gif", "[元宵快乐]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/83/lxhyuanxiaohappy_thumb.gif", "[吃汤圆]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/52/lxhchitangyuan_thumb.gif", "[金元宝]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9b/lxhjinyuanbao_thumb.gif", "[红包拿来]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bd/lxhhongbaonalai_thumb.gif", "[福到啦]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f4/lxhfudaola_thumb.gif", "[放鞭炮]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bd/lxhbianpao_thumb.gif", "[发红包]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/27/lxhhongbao_thumb.gif", "[大红灯笼]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/90/lxhdahongdenglong_thumb.gif", "[拜年了]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0c/lxhbainianle_thumb.gif", "[龙啸]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/cd/lxhlongxiao_thumb.gif", "[moc自重]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ba/moczizhong_thumb.gif", "[moc冒出]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/2f/mocmaochu_thumb.gif", "[moc路过]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/94/mocluguo_thumb.gif", "[moc看清楚]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/07/mockanqingchu_thumb.gif", "[moc结冰]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/31/mocjiebing_thumb.gif", "[moc挤]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/3c/mocji_thumb.gif", "[moc呕吐]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/df/mocoutu_thumb.gif", "[moc鬼脸]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0f/mocguilian_thumb.gif", "[moc浮云]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6c/mocfuyun_thumb.gif", "[moc顶]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/85/mocding_thumb.gif", "[moc大哭]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/92/mocdaku_thumb.gif", "[moc大口吃]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/2e/mocdakouchi_thumb.gif", "[moc打击]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7b/mocdaji_thumb.gif", "[moc尴尬]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/44/mocganga_thumb.gif", "[moc呲牙笑]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/53/mocciyaxiao_thumb.gif", "[moc拍照]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e6/mocpaizhao_thumb.gif", "[moc亲吻]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/15/mocqinqinwen_thumb.gif", "[moc转头]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1c/moczhuangtou_thumb.gif", "[moc装酷]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/81/moczhuangku_thumb.gif", "[moc转发]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/cb/moczhuanfa_thumb.gif", "[moc中箭]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/88/moczhongjian_thumb.gif", "[moc晕]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/84/mocyun_thumb.gif", "[moc强吻]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c0/mocqiangwen_thumb.gif", "[moc羞]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/53/mocxiu_thumb.gif", "[moc晚安]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/97/mocwanan_thumb.gif", "[moc弹跳]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/51/moctantiao_thumb.gif", "[moc石化]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c8/mocshihua_thumb.gif", "[moc生气]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/42/mocshengqi_thumb.gif", "[moc亲亲女]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/95/mocqinqinzuo_thumb.gif", "[moc亲亲男]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/55/mocqinqinyou_thumb.gif", "[moc围观]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c9/mocweiguan_thumb.gif", "[moc扯脸]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/36/mocchelian_thumb.gif", "[gst挖鼻屎]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/44/gstwabishi_thumb.gif", "[gst舔舔]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/83/gsttiantian_thumb.gif", "[gst好羞射]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8b/gsthaoxiushe_thumb.gif", "[gst抽你]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/37/gstchouniya_thumb.gif", "[gst好难懂]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/96/gsthaonandong_thumb.gif", "[gst不活了]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/3e/gstrangwosi_thumb.gif", "[gst转转转]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ff/gstzhuanzhuanzhuan_thumb.gif", "[gst汗]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/2f/gsthan_thumb.gif", "[gst干嘛噜]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ab/gstganmalu_thumb.gif", "[gst人家不依]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1c/gstnewrenjiabuyi_thumb.gif", "[gst热热热]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/11/gstrerere_thumb.gif", "[gst耐你]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1b/gstnaini_thumb.gif", "[gst困]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7c/gstkun_thumb.gif", "[gst好怕呀]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e5/gsthaopaya_thumb.gif", "[gst发工资啦]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/41/gstfagongzila_thumb.gif", "[gst嘲笑你]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d9/gstchaoxiaoni_thumb.gif", "[gst呀咩爹]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/09/gstyameidie_thumb.gif", "[gst下班啦]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/73/gstxiabanla_thumb.gif", "[gst晚安]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8a/gstwanan_thumb.gif", "[gst败了]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/35/gsttouxiang_thumb.gif", "[gst死蚊子]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/18/gstsiwenzi_thumb.gif", "[gst帅毙了]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/fb/gstshuaibile_thumb.gif", "[gst揉揉脸]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/52/gstrouroulian_thumb.gif", "[gst嘿嘿嘿]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a0/gstheiheihei_thumb.gif", "[gst得瑟]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/14/gstdese_thumb.gif", "[gst艾玛]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/48/gstaima_thumb.gif", "[xb自信]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0a/xbzixin_thumb.gif", "[xb转]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/08/xbzhuan_thumb.gif", "[xb转圈]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/fa/xbzhuanquan_thumb.gif", "[xb指指]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/fb/xbzhizhi_thumb.gif", "[xb招手]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/69/xbzhaoshou_thumb.gif", "[xb照镜]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d7/xbzhaojing_thumb.gif", "[xb雨]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c3/xbyu_thumb.gif", "[xb坏笑]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/49/xbyinxiao_thumb.gif", "[xb疑惑]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e9/xbyihuo_thumb.gif", "[xb摇摆]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1d/xbyaobai_thumb.gif", "[xb眼镜]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/xbyanjing_thumb.gif", "[xb压力]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e0/xbyali_thumb.gif", "[xb星]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e8/xbxing_thumb.gif", "[xb兴奋]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7b/xbxingfen_thumb.gif", "[xb喜欢]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/5c/xbxihuan_thumb.gif", "[xb小花]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c2/xbxiaohua_thumb.gif", "[xb无奈]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/96/xbwunai_thumb.gif", "[xb捂脸]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/56/xbwulian_thumb.gif", "[xb天使]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/dc/xbtianshi_thumb.gif", "[xb太阳]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0f/xbtaiyang_thumb.gif", "[xb睡觉]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/af/xbshuijiao_thumb.gif", "[xb甩葱]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a2/xbshuaicong_thumb.gif", "[xb生日]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/12/xbshengri_thumb.gif", "[xb扇子]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/41/xbshanzi_thumb.gif", "[xb伤心]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/41/xbshangxin_thumb.gif", "[xb揉]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e1/xbrou_thumb.gif", "[xb求神]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a1/xbqiushen_thumb.gif", "[xb青蛙]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/06/xbqingwa_thumb.gif", "[xb期待]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/b0/xbqidai_thumb.gif", "[xb泡澡]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7a/xbpaozao_thumb.gif", "[xb怒]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/07/xbnu_thumb.gif", "[xb努力]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7b/xbnuli_thumb.gif", "[xb拇指]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/58/xbmuzhi_thumb.gif", "[xb喵]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/85/xbmiao_thumb.gif", "[xb喇叭]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0c/xblaba_thumb.gif", "[xb哭]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/dd/xbku_thumb.gif", "[xb看书]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/44/xbkanshu_thumb.gif", "[xb开餐]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/34/xbkaican_thumb.gif", "[xb举手]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8e/xbjushou_thumb.gif", "[xb奸笑]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/cf/xbjianxiao_thumb.gif", "[xb昏]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/30/xbhun_thumb.gif", "[xb挥手]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ec/xbhuishou_thumb.gif", "[xb欢乐]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/3a/xbhuanle_thumb.gif", "[xb喝茶]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/61/xbhecha_thumb.gif", "[xb汗]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/36/xbhan_thumb.gif", "[xb害羞]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/cc/xbhaixiu_thumb.gif", "[xb害怕]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c4/xbhaipa_thumb.gif", "[xb风吹]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/66/xbfengchui_thumb.gif", "[xb风车]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a5/xbfengche_thumb.gif", "[xb恶魔]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/28/xbemo_thumb.gif", "[xb打]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/72/xbda_thumb.gif", "[xb大笑]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/cd/xbdaxiao_thumb.gif", "[xb呆]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9d/xbdai_thumb.gif", "[xb触手]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f4/xbchushou_thumb.gif", "[xb吹]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0c/xbchui_thumb.gif", "[xb吃糖]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e9/xbchitang_thumb.gif", "[xb吃饭]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/73/xbchifan_thumb.gif", "[xb吃包]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/48/xbchibao_thumb.gif", "[xb唱歌]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1c/xbchangge_thumb.gif", "[xb摆手]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/db/xbbaishou_thumb.gif", "[lxhx喵]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9b/lxhxmiao_thumb.gif", "[lxhx喵喵]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/5e/lxhxmiao2_thumb.gif", "[lxhx奔跑]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c5/lxhxbenpao_thumb.gif", "[lxhx走]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/51/lxhxzou_thumb.gif", "[lxhx蠕过]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/93/lxhxruguo_thumb.gif", "[lxhx蹭]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/27/lxhxceng_thumb.gif", "[lxhx狂欢]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d5/lxhxkuanghuan_thumb.gif", "[lxhx奋斗]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6c/lxhxfendou_thumb.gif", "[lxhx笑]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/3b/lxhxxiao_thumb.gif", "[lxhx懒腰]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d4/lxhxlanyao_thumb.gif", "[lxhx得意]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/b0/lxhxdeyi_thumb.gif", "[lxhx右边]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a4/lxhxyou_thumb.gif", "[lxhx转头]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/71/lxhxzhuantou_thumb.gif", "[lxhx跳跃]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ee/lxhxtiaoyue_thumb.gif", "[lxhx转体]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/11/lxhxzhuanti_thumb.gif", "[lxhx撒欢]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/b8/lxhxsahuan_thumb.gif", "[lxhx挠]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/lxhxnao_thumb.gif", "[lxhx挠皇]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/b8/lxhxnaohuang_thumb.gif", "[lxhx逗转圈]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/52/lxhxdouzhuanquan_thumb.gif", "[lxhx划]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/28/lxhxhua_thumb.gif", "[lxhx得瑟]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/80/lxhxdese_thumb.gif", "[lxhx喷嚏]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/5c/lxhxpenti2_thumb.gif", "[lxhx打喷嚏]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/15/lxhxpenti_thumb.gif", "[lxhx哭]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6a/lxhxku_thumb.gif", "[lxhx扫灰]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/37/lxhxsaohui_thumb.gif", "[lxhx听歌]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/3d/lxhxtingge_thumb.gif", "[lxhx狂吃]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/05/lxhxkuangchi_thumb.gif", "[lxhx画圈]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f0/lxhxhuaquan_thumb.gif", "[lxhx掀桌]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/18/lxhxxianzhuo_thumb.gif", "[lxhx刷牙]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ce/lxhxshuaya_thumb.gif", "[lxhx抱枕]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/31/lxhxbaozhen_thumb.gif", "[lxhx都不给]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/03/lxhxdoubugei_thumb.gif", "[lxhx逗左右]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/99/lxhxdouzuoyou_thumb.gif", "[lxhx变化]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/14/lxhxbianhua_thumb.gif", "[lxhx打地鼠]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/aa/lxhxdadishu_thumb.gif", "[lxhx西瓜]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/45/lxhxxigua_thumb.gif", "[lxhx咻]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/01/lxhxxiu1_thumb.gif", "[lxhx咻2]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a5/lxhxxiu2_thumb.gif", "[lxhx咻3]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/02/lxhxxiu3_thumb.gif", "[lxhx咻4]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/75/lxhxxiu4_thumb.gif", "[lxhx咻5]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/14/lxhxxiu5_thumb.gif", "[lxhx咻6]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e3/lxhxxiu6_thumb.gif", "[lxhx咻7]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ec/lxhxxiu7_thumb.gif", "[lxhx咻8]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/2b/lxhxxiu8_thumb.gif", "[lxhx滚过]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/43/lxhxgunguo_thumb.gif", "[lxhx躺中枪]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f9/lxhxtangzhongqiang_thumb.gif", "[lxhx讨厌]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/98/lxhxtaoyan_thumb.gif", "[lxhx逗上下]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/51/lxhxdoushangxia_thumb.gif", "[lxhx吐血]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/03/lxhxtuxue_thumb.gif", "[lxhx病了]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9f/lxhxbingle_thumb.gif", "[lxhx泪目]": "http://img.t.sinajs.cn/t35/style/images/common/face/ext" },
    Config: { "hotmapname": "MYJOB_SAFETY_CLUSTERS", "idolhttp": "Handler/GetImage.ashx", "hotmaplist": { "总体热点图": "JOB_SAFETY_CLUSTERS" }, "sgmapname": "myjob_SG",
        "categorycondition": " PARENTCATE=0 and ISEFFECT=1", "categoryinnit": { "categoryid": "523510803107128336", "parentcate": "202", "categoryname": "河南平禹“10·16”特别重大瓦斯突出事故" },
        "datediff": 730,
        "weibodatabase": "source"
    },
    LogVisitor: function () {
        $.post("Handler/User.ashx", { 'action': 'log_visitor', 'page_url': location.href },
            function (Data, textStatus) {

            }, "json");
    }, replaceAll: function (s, s1, s2) {
        return s.replace(new RegExp(s1, "gm"), s2);
    }, displayExpression: function (data) {
        var front = "<img alt=\"";
        var center = "\" src=\""
        var back = "\"/>";
        var testStr = data.replace(/(\[[\w\u4e00-\u9fa5]+\])/ig, function (key) { return front + key + center + Common.SinaExpression[key] + back; });
        return testStr;
    },
    //g_div 背景层，模拟锁屏的层
    ShowEditFrame: function (g_div, child_div, parent_div, close_btn) {
        var parentDiv = $("#" + parent_div);
        var height = document.body.clientHeight;
        var width = document.body.clientWidth;
        var elementHeight = document.documentElement.clientHeight;
        var elementWidth = document.documentElement.clientWidth;
        var frameHeight = 148;
        var div = $("#" + g_div);
        div.css({ "top": "0px", "left": "0px", "width": width + "px", "height": height + "px", "backgroundColor": "#000", "z-index": 20, "position": "absolute", "opacity": "0.2" });
        div.show();
        parentDiv.show();
        var l_height = parseInt($("#" + parent_div + "_inner").height()) / 2;
        var l_width = parseInt($("#" + parent_div + "_inner").width()) / 2;
        parentDiv.css({ "position": "absolute", "top": (elementHeight / 2 - l_height) + document.documentElement.scrollTop + "px", "left": (elementWidth / 2 - l_width) + document.documentElement.scrollLeft + "px" });
        var div_move = new divMove(child_div, parent_div);

        div_move.init();
        window.onresize = function () {
            div.css("top", "0px");
            div.css("left", "0px");
            div.height(document.body.scrollHeight);
            div.width(document.body.scrollWidth);
        };
        $("#" + close_btn).click(function () {
            parentDiv.hide();
            div.hide();
        });
    },
    SubmitPop: function (popDiv) {
        var hideTime = 500;
        var popdiv = $("#" + popDiv);
        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var tp = document.documentElement.clientHeight;
        var lft = document.documentElement.clientWidth;
        var frameHeight = 148;   //top frame level height value
        popdiv.show();
        var l_height = 130 / 2;
        var l_width = 320 / 2;
        popdiv.css({ "left": (lft / 2 - l_width) + document.documentElement.scrollLeft + "px", "top": (tp / 2 - l_height) + document.documentElement.scrollTop + "px" });
        // popdiv.delay(hideTime).fadeOut(hideTime / 2);
        var id = "#" + popDiv; //alert(popDiv);
        function myhided() {
            $(id).hide();
        }
        setTimeout(myhided, 500);

    },
    LoadingImg: function (domID, type) {
        var imgUrl = "";
        switch (type) {
            case "none":
            case "0":
                imgUrl = "img/load_error.gif";
                break;
            case "load":
            case "1":
                imgUrl = "img/load_big.gif";
                break;
            case "icon":
            case "2":
                imgUrl = "img/load_icon.gif";
                break;
        }
        $("#" + domID).empty().append("<div class=\"load_out\"><div class=\"load_in\"><img src=\"" + imgUrl + "\" /></div></div>");
    },
    CloseEditFrame: function (g_div, parent_div) {

        $("#" + parent_div).hide();
        $("#" + g_div).hide();
    },
    CheckUser: function () {
        $.post("Handler/User.ashx", { 'action': 'check_user' },
            function (Data, textStatus) {
                if (Data["SuccessCode"] == "1") {
                    $("div[name='head_list_div']").show();
                    $("#subnav_index").attr("href", unescape(Data.path));
                    if (Data["path"] != "main.html") {
                        location.href = Data["path"];
                    } else
                        Common.LoginInitFun();
                }
                else {
                    window.parent.location.href = "login.html";
                    //location.href = unescape(Data.path);
                }
            }, "json");
    },
    LoginInitFun: function () {

    },
    //非空验证
    //closeDiv:关闭层按钮，txtid:验证文本框ID，warnImg:警告符号 span ID
    ValIsEmpty: function (closeDiv, txtid, warnImg) {//, isCheck,showID
        var validateFun = function () {
            if ($(this).val() == "") {
                $("#" + warnImg).show();
                $(this).addClass("on");
            }
            else {
                $(this).removeClass();
                $("#" + warnImg).hide();
            }
        }
        $("#" + closeDiv).unbind("click").click(function () {
            $("#" + txtid).removeClass();
            $("#" + warnImg).hide();
        });
        $("#" + txtid).keyup(validateFun);

        $("#" + txtid).blur(validateFun);

    }, //txtid:textarea ID
    //showID:显示剩余字数span ID
    //最大字数长度 一个汉字=2个长度
    CheckWord: function (txtid, showID, maxLength) {
        var promptFun = function () {
            var cLength = Common.GetShortWord($(this).val());
            if (maxLength >= cLength) {
                $("#" + showID).html("还可以输入<b>" + Math.floor((maxLength - cLength) / 2) + "</b>个字");
            }
            else {
                $("#" + showID).html("已经超过<b style='color: red;'>" + Math.ceil((cLength - maxLength) / 2) + "</b>个字");
            }
        }
        $("#" + txtid).keyup(promptFun);
        $("#" + txtid).blur(promptFun);
        $("#" + txtid).focus(promptFun);
    },
    GetShortWord: function (txt) {
        var originalWord = txt;
        var count = 0;
        var sl = originalWord.length;
        for (var i = 0; i < sl; i++) {
            var sname = originalWord.substring(i, i + 1);
            if (sname.charCodeAt(0) > 255) {
                count = count + 2;
            } else {
                count++;
            }
        }
        return count;
    },
    GetTab: function (tabid) {
        var tabs = $("#" + tabid);
        $.post("Handler/Statistic.ashx",
               { "action": "gettab" },
                function (data) {
                    if (data.Success == 1) {
                        delete data.Success;
                        var tabcontainer = [];
                        tabcontainer.push("<ul class=\"tabs tab-strip ui-sortable\">");
                        for (var item in data["data"]) {
                            var entity = data["data"][item];
                            var hrf = location.href;
                            var hrfs = hrf.split("/");

                            if (entity.url == "0") {
                                tabcontainer.push(" <li class=\"tab inactivetab nodrag\"><a href=\"Default.aspx?" + entity.title + "\"><b>" + entity.title + "</b></a></li>");
                            }
                            else {
                                if (entity.url == hrfs[hrfs.length - 1]) {
                                    tabcontainer.push(" <li class=\"tab activetab\"><span class=\"current_tab\"><b>" + entity.title + "</b></span></li>");
                                }
                                else {
                                    tabcontainer.push(" <li class=\"tab inactivetab nodrag\"><a href=\"" + entity.url + "\"><b>" + entity.title + "</b></a></li>");

                                }
                            }

                        }
                        tabcontainer.push("</ul>");
                        tabs.empty().html(tabcontainer.join(""));
                    } else {
                        location.href = "LoginPage.aspx";
                    }
                },
                "json"
            )
    },
    Navigation: function (tab_num, menu_id) {
        var obj = typeof (menu_id) == "object" ? menu_id : $("#" + menu_id);
        var count = 1;
        var html_str = [];
        for (var item in MenuList) {
            if (typeof (MenuList[item]) != "object") {
                if (tab_num == count) {
                    html_str.push("<div class=\"nav_link\"><a href=\"" + MenuList[item] + "\">" + item + "</a></div>");
                }
                else {
                    html_str.push("<div class=\"nav_no_link\"><a href=\"" + MenuList[item] + "\">" + item + "</a></div>");
                }
            }
            else {
                if (tab_num == count) {
                    html_str.push("<div class=\"nav_link\"><a href=\"javascript:void(null);\">" + item + "</a>");
                }
                else {
                    html_str.push("<div class=\"nav_no_link\"><a href=\"javascript:void(null);\">" + item + "</a>");
                }
                for (var i in MenuList[item]) {
                    if (tab_num == count) {
                        html_str.push("<div class=\"nav_child\" ><a href=\"" + MenuList[item][i] + "\">" + i + "</a></div>");
                    }
                    else {
                        html_str.push("<div class=\"nav_child\" style=\"display:none;\" ><a href=\"" + MenuList[item][i] + "\">" + i + "</a></div>");
                    }
                }
                html_str.push("</div>");
            }
            count++;
        }
        $(obj).empty().html(html_str.join(""));
        $(obj).children("div").eq(tab_num - 1).attr("class", "nav_link");
        var div_list = $(obj).children("div");
        var current_div = new Object;
        $(obj).children("div").each(function () {
            if ($(this).attr("class") == "nav_link")
                current_div = this;
            $(this).click(function () {
                if (this != current_div) {
                    $(this).siblings("div").attr("class", "nav_no_link");
                    $(current_div).children("div").hide();
                    $(this).children("div").show();
                    $(this).attr("class", "nav_link");
                    current_div = this;
                }
            });
        });
    },
    OtherNavigation: function (tab_num, nav_id, type) {
        var obj = typeof (nav_id) == "object" ? nav_id : $("#" + nav_id);
        var count = 1;
        var content = [];
        content.push("<ul>");
        for (var item in MenuList) {
            if (typeof (MenuList[item]) != "object") {
                content.push("<li><a href=\"" + MenuList[item] + "\" >" + item + "</a></li>");
            }
            else {
                if (type) {
                    content.push("<li><span><a href=\"javascript:void(null);\">" + item + "</a></span><ul class=\"subnav\">");
                    for (var i in MenuList[item]) {
                        content.push("<li ><a href=\"" + MenuList[item][i] + "\">" + i + "</a></li>");
                    }
                    content.push("</ul></li>");
                } else {
                    content.push("<li style=\"position:relative;\"><a href=\"javascript:void(null);\" >" + item + "</a>");
                    content.push("<ol style=\"z-index:100; width:90px; display:none; top:32px; left:0px; position:absolute;background:white;");
                    content.push("border-bottom:1px solid gray;border-left:1px solid gray;border-right:1px solid gray;\">")
                    for (var i in MenuList[item]) {
                        content.push("<li ><a href=\"" + MenuList[item][i] + "\">" + i + "</a></li>");
                    }
                    content.push("</ol></li>");
                }

            }
            count++;
        }
        content.push("</ul>");
        $(obj).empty().html(content.join(""));
        $(obj).children("ul").children("li").eq(tab_num - 1).attr("class", "current");
        $(obj).children("ul").children("li").each(function () {
            $(this).hover(
	            function () {
	                if (type) {
	                    $(this).children("ul").show();
	                } else {
	                    $(this).attr("class", "current");
	                    $(this).children("ol").show();
	                }

	            },
	            function () {
	                if (type) {
	                    $(this).children("ul").hide();
	                } else {
	                    $(this).attr("class", "");
	                    $(this).children("ol").hide();
	                }
	            }
	        );

        });


    },
    TabControl: function (s, current_class, nocurrent_class) {
        var TabList = [];
        var DisList = [];
        for (var item in s) {
            TabList.push(item);
            DisList.push(s[item]);
        }
        for (var i = 0, j = TabList.length; i < j; i++) {
            $("#" + TabList[i]).click(function () {
                for (var k = 0; k < j; k++) {
                    $("#" + TabList[k]).attr("class", nocurrent_class);
                    $("#" + DisList[k]).hide();
                }
                $(this).attr("class", current_class);
                $("#" + s[$(this).attr("id")]).show();
            });
        }
    },
    ClickTab: function (obj_list, current_class, no_current_class) {
        obj_list.each(function () {
            var current_obj = this;
            $(this).click(function () {
                obj_list.each(function () {
                    $(this).parent("dl").attr("class", no_current_class);
                });
                $(current_obj).parent("dl").attr("class", current_class);
            });
        });
    },
    GetMonth: function (obj) {
        var time = new Date();
        $("#" + obj).empty().html(time.getFullYear() + "年" + (time.getMonth() + 1) + "月");
    },
    GetDay: function (obj) {
        var time = new Date();
        $("#" + obj).empty().html(time.getDate());
    },
    DownFlash: function (obj, falsh_url, width, height) {
        $("#" + obj).flash(
			{
			    src: falsh_url,
			    width: width,
			    height: height
			},
			{ version: 10 }
       );
    },
    BtnLginInit: function () {
        $("#login_cancel").click(function () {
            $.post("Handler/User.ashx",
                { "action": "clear_cookie" },
                function (data, textstatus) {
                    if (data.SuccessCode == "1")
                        location.href = "Login.html";
                },
                "json"
            );
        });
        $("#login_out").click(function () {
            $.post("Handler/User.ashx",
                { "action": "clear_cookie" },
                function (data, textstatus) {
                    if (data.SuccessCode == "1")
                        window.close();
                },
                "json"
            );

        });
    },
    CategoryMenu: function (obj, current_class, nocurrent_class, str_where, left, tag) {
        var current_obj = this;
        $.post("Handler/CategoryMenu.ashx",
		    { "str_where": str_where, "left": left },
		    function (data) {
		        $("#" + obj).empty().html(unescape(data));
		        var t1 = jQuery("div.menu_img b.color_2");
		        var t2 = jQuery("#" + obj + " > li");
		        t1.text(t2.size());

		        var child_list = $("#" + obj).children("li");
		        child_list.click(function () {
		            $(this).siblings("li").children("div").hide();
		            $(this).siblings("li").removeClass("on");
		            $(this).addClass("on");
		            $(this).children("div").show(300);
		        });
		        $("#" + obj).find("a").each(function () {
		            var len = $(this).siblings("div").length;
		            if (len == 0) {
		                $(this).click(function () {
		                    current_obj.CategoryMenuClick($(this).attr("pid"), $(this).html());
		                });
		            }
		        });
		        child_list.find("li").each(function () {
		            if ($(this).children("ol").length > 0) {
		                $(this).hover(
					        function () {
					            $(this).children("ol").css("top", $(this).position().top - 1);
					            $(this).children("ol").show();
					        },
					        function () {
					            $(this).find("ol").hide();
					        }
				        );
		            }
		        });
		        current_obj.CategoryMenuInit();
		    }
		)
    },
    CategoryMenuClick: function (data, text) {
        return null;
    },
    CategoryMenuInit: function () {
        return null;
    },
    HotMapData: function (s, page_tag) {
        $.ajax({
            type: "get",
            url: "Handler/GetMapData.ashx",
            data: s,
            beforeSend: function (XMLHttpRequest) {
                $("#hot_image").html("热点数据加载中……");
            },
            success: function (data, textStatus) {

                var map = $("#mapData");

                map.empty().html(data);
                //隐藏文字说明
                $(".node_text").each(function () {
                    $(this).hide();
                });

                $(".node").each(function () {
                    $(this).mouseover(function () {

                        var num = $(this).attr("id").split("_")[1];
                        $("#clustertitle_" + num).show();
                    });

                    $(this).mouseout(function () {

                        var num = $(this).attr("id").split("_")[1];
                        $("#clustertitle_" + num).hide();
                    });

                    $(this).click(function () {
                        $(".node").each(function () {
                            $(this).css("background", "red");
                        });
                        $(this).css("background", "green");
                        var cluster_id = $(this).attr("id").split("_")[1];
                        if (page_tag == "index") {
                            location.href = "hot.html";
                        }
                        else {
                            Hot.GetClusterResults(cluster_id, s.end_date, s.job_name);
                        }

                    });
                }); //each end

            },
            complete: function (XMLHttpRequest, textStatus) {
                $("#hot_image").html("舆情热点图<br/>(点击红色方块，可在右侧区域获取文章列表)");
            },
            error: function () {
                //请求出错处理
            }
        });
    },
    GetCookie: function (name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
            var j = i + alen;
            if (document.cookie.substring(i, j) == arg)
                return getCookieVal(j);
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }
        return null;

        function getCookieVal(offset) {
            var endstr = document.cookie.indexOf(";", offset);
            if (endstr == -1)
                endstr = document.cookie.length;
            return unescape(document.cookie.substring(offset, endstr));
        }
    }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  