<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Reportlist.aspx.cs" Inherits="WeiboAnalysis.yiqitemporary.Reportlist" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>安全生产事故网络信息事故调查报告</title>
    <!--<link href="css/style.css" rel="stylesheet" type="text/css">-->
    <!--[if IE]><script language="javascript" type="text/javascript" src="js/excanvas.min.js"></script><![endif]-->
    <link href="css/style.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/jquery.query.js"></script>
    <script type="text/javascript" src="js/Pager.js"></script>
    <script type="text/javascript" src="js/My97DatePicker/WdatePicker.js"></script>
    <link href="js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="js/inputcue.js"></script>
    <script type="text/javascript" src="js/common.js"></script>
    <script src="js/AccidentReportList.js" type="text/javascript"></script>
</head>
<body huaban_screen_capture_injected="true">
    <!-------------------------　顶　部　开　始　------------------------->
    <div class="header">
        <div class="wraper">
            <!----------//　Logo 开始　//---------->
            <div class="logo">
                <a href="index.html" title="首页"></a>
            </div>
            <!----------//　Logo 结束　//---------->
            <!----------//　用户开始　//---------->
            <div class="user" id="headuserinfo">
                <a class="btn_logout" href="Handler/LoginOut.ashx" target="_self">退出</a> <span class="user_info">
                    您好！<b class="color_2"></b>今天是<code class="color_1">2014</code>年<code class="color_1">2</code>月<code
                        class="color_1">19</code>日<code class="color_1"> 星期三</code></span>
            </div>
            <!----------//　用户结束　//---------->
            <div class="clear">
            </div>
            <!----------//　导航开始　//---------->
            <div class="nav">
                <ul>
                    <li><a href="javascript:void(null);" title="">
                        <img src="img/nav_1.gif" alt=""></a>
                        <div class="subnav" id="subnav_1">
                            <ul>
                                <li><a target="_blank" href="ylfl.html?categoryid=127638024140890829_&amp;categoryname=煤矿">
                                    煤矿</a></li><li><a target="_blank" href="ylfl.html?categoryid=712450026755702975_&amp;categoryname=非煤矿山">
                                        非煤矿山</a></li><li><a target="_blank" href="ylfl.html?categoryid=826794518116405807_&amp;categoryname=建筑施工">
                                            建筑施工</a></li><li><a target="_blank" href="ylfl.html?categoryid=811338021728818488_&amp;categoryname=危险化学品">
                                                危险化学品</a></li><li><a target="_blank" href="ylfl.html?categoryid=596660260984215793_&amp;categoryname=烟花爆竹">
                                                    烟花爆竹</a></li><li><a target="_blank" href="ylfl.html?categoryid=651901635960829643_&amp;categoryname=工商贸其他">
                                                        工商贸其他</a></li><li><a target="_blank" href="ylfl.html?categoryid=349178641774139909_&amp;categoryname=火灾">
                                                            火灾</a></li><li><a target="_blank" href="ylfl.html?categoryid=491156645605734583_&amp;categoryname=道路交通">
                                                                道路交通</a></li><li><a class="btn_more" href="ylfllist.html" target="_blank">更多</a></li></ul>
                        </div>
                    </li>
                    <li><a href="javascript:void(null);" title="">
                        <img src="img/nav_2.gif" alt=""></a>
                        <div class="subnav" id="subnav_2">
                            <ul>
                                <li><a target="_blank" href="district.html?categoryid=918056907221132461_&amp;categoryname=北京">
                                    北京</a></li><li><a target="_blank" href="district.html?categoryid=940349300476660708_&amp;categoryname=天津">
                                        天津</a></li><li><a target="_blank" href="district.html?categoryid=729404492151384513_&amp;categoryname=河北">
                                            河北</a></li><li><a target="_blank" href="district.html?categoryid=202068563470235721_&amp;categoryname=山西">
                                                山西</a></li><li><a target="_blank" href="district.html?categoryid=749030055338742729_&amp;categoryname=内蒙古">
                                                    内蒙古</a></li><li><a class="btn_more" href="district.html" target="_blank">更多</a></li></ul>
                        </div>
                    </li>
                    <li><a href="javascript:void(null);" title="">
                        <img src="img/nav_3.gif" alt=""></a>
                        <div class="subnav" id="subnav_3">
                            <ul>
                                <li><a target="_blank" href="zblist.html?type=1">周报</a></li><li><a target="_blank"
                                    href="zblist.html?type=2">专报</a></li><li><a target="_blank" href="zblist.html?type=4">
                                        事故</a></li><li><a target="_blank" href="zblist.html?type=3">其他</a></li></ul>
                        </div>
                    </li>
                    <li><a href="javascript:void(null);" title="">
                        <img src="img/nav_4.gif" alt=""></a>
                        <div class="subnav" id="subnav_4">
                            <ul>
                                <li><a target="_blank" href="ylzt.html">舆情专题</a></li><li><a target="_blank" href="hotlist.html">
                                    舆情热点</a></li></ul>
                        </div>
                    </li>
                    <li><a id="subnav_index" href="http://10.16.6.100:8000/index.html" target="_blank"
                        title="返回首页">
                        <img src="img/nav_5.gif" alt=""></a> </li>
                </ul>
                <div class="clear">
                </div>
            </div>
            <!----------//　导航结束　//---------->
            <!----------//　搜索开始　//---------->
            <div class="search" style="text-align: left;">
                <span class="search_line_2"></span><span class="search_line_1"></span>
                <!--- 简单搜索开始 --->
                <div class="term_frame" id="sel" style="width: 581px; display: none;">
                    <table style="width: 581px;" cellpadding="0" cellspacing="0" border="0">
                        <tbody id="term_list">
                        </tbody>
                    </table>
                </div>
                <ul class="form_list">
                    <li><span class="name"><b class="color_2">简单搜索：</b></span> <span class="input">
                        <input id="keyword" style="width: 573px;" type="text" value=""></span><a class="btn_more"
                            href="javascript:void(null);" id="look_hot_keyword"><b>热点关键词</b></a> <a class="btn_super"
                                href="search.html" target="_blank"><b>高级搜索</b></a> <a class="btn_search" id="btn_search"
                                    href="javascript:void(null);"></a></li>
                </ul>
                <!--- 简单搜索结束 --->
                <div class="clear">
                </div>
                <span class="search_line_1"></span><span class="search_line_2"></span>
            </div>
            <!----------//　搜索结束　//---------->
        </div>
    </div>
    <!-------------------------　中　部　开　始　------------------------->
    <div class="main">
        <div class="wraper">
            <!----------//　推荐专题开始　//---------->
            <!--<div class="subcontent skin_2 left">
      <h1><b class="color_1">最热专题</b></h1>
            
      <ul class="news_list" id="hot_event_list">
        
        
      </ul>      
      <div style=" display:none;" id="hot_event_pager"></div>  
    </div>-->
            <!----------//　全部专题结束　//---------->
            <!----------//　专题列表开始　//---------->
            <div class="content list">
                <div class="title">
                    <a class="color_7" href="index.html">首页</a>&gt;<b>事故调查报告 </b>
                    <ul class="form_list">
                        <li><span class="name">发生时间：</span> <span class="input">
                            <input type="text" id="start_time" onfocus="WdatePicker({isShowClear:false,readOnly:true,dateFmt:'yyyy-MM-dd'})"></span>
                            <span class="name">- </span><span class="input">
                                <input type="text" id="end_time" onfocus="WdatePicker({isShowClear:false,readOnly:true,dateFmt:'yyyy-MM-dd'})"></span>
                            <span class="input">
                                <select id="search_jgjc_sel">
                                    <option value="">全部监管局</option>
                                    <option value="安监">安监局</option>
                                    <option value="煤监">煤监局</option>
                                </select></span> <span class="input">
                                    <select id="search_sgjb_sel">
                                        <option value="">全部事故</option>
                                        <option value="较大">较大</option>
                                        <option value="特大">特大</option>
                                        <option value="重大">重大</option>
                                    </select></span> <span class="input">
                                        <select id="area_sel">
                                            <option value="">全部地区</option>
                                            <option value="北京市">北京市</option>
                                            <option value="天津市">天津市</option>
                                            <option value="上海市">上海市</option>
                                            <option value="重庆市">重庆市</option>
                                            <option value="河北省">河北省</option>
                                            <option value="山西省">山西省</option>
                                            <option value="内蒙古自治区">内蒙古自治区</option>
                                            <option value="辽宁省">辽宁省</option>
                                            <option value="吉林省">吉林省</option>
                                            <option value="黑龙江省">黑龙江省</option>
                                            <option value="江苏省">江苏省</option>
                                            <option value="浙江省">浙江省</option>
                                            <option value="安徽省">安徽省</option>
                                            <option value="福建省">福建省</option>
                                            <option value="江西省">江西省</option>
                                            <option value="山东省">山东省</option>
                                            <option value="河南省">河南省</option>
                                            <option value="湖北省">湖北省</option>
                                            <option value="湖南省">湖南省</option>
                                            <option value="广东省">广东省</option>
                                            <option value="广西壮族自治区">广西壮族自治区</option>
                                            <option value="海南省">海南省</option>
                                            <option value="四川省">四川省</option>
                                            <option value="贵州省">贵州省</option>
                                            <option value="云南省">云南省</option>
                                            <option value="西藏自治区">西藏自治区</option>
                                            <option value="陕西省">陕西省</option>
                                            <option value="甘肃省">甘肃省</option>
                                            <option value="青海省">青海省</option>
                                            <option value="宁夏回族自治区">宁夏回族自治区</option>
                                            <option value="新疆维吾尔自治区">新疆维吾尔自治区</option>
                                            <option value="香港特别行政区">香港特别行政区</option>
                                            <option value="澳门特别行政区">澳门特别行政区</option>
                                        </select></span> <span class="input">
                                            <input type="button" id="btn_look_result" value="查看"></span>
                        </li>
                    </ul>
                </div>
                <ul class="order_tab">
                    <!--<li name="search_site_type" class="tab_on" pid="MATCH{news}:C1">新闻</li>
                    <li name="search_site_type" class="tab_off" pid="MATCH{bbs}:C1">论坛</li>
                    <li name="search_site_type" class="tab_off" pid="MATCH{blog}:C1">博客</li>
                    <li name="search_site_type" class="tab_off" pid="">微博</li>-->
                </ul>
                <ul class="set_tab" id="orderTabUl">
                    <li class="id">排列方式：</li>
                    <li class="tab_on" name="sort_search_type" pid="OccurrenceTime">发生时间<b>↓</b></li>
                    <li class="tab_off" name="sort_search_type" pid="CreateTime">入库时间<b>↓</b></li>
                    <li class="tab_off" name="sort_search_type" pid="Department">发布地域<b>↓</b></li>
                </ul>
                <div class="clear">
                </div>
                <div>
                    <div id="result_list" style="float: left; width: 100%;">
                    </div>
                    <div style="float: left; width: 20%; display: none;" id="info_frame">
                        <div class="menu">
                            <ul>
                                <li class="tab_on"><a href="#"><b>重要人物</b></a>
                                    <div class="submenu">
                                        <ul id="leader_info">
                                        </ul>
                                    </div>
                                </li>
                                <li class="tab_on"><a href="#"><b>关注机构</b></a>
                                    <div class="submenu">
                                        <ul id="org_info">
                                            <li><a pid="I53OOTHP8NJH-2705" queryrule="%22%u4E2D%u7EAA%u59D4%22+OR+%22%u7EAA%u59D4%22+OR+%22%u7EAA%u5F8B%u68C0%u67E5%u59D4%u5458%u4F1A%22+OR+%22%u7EAA%u68C0%22"
                                                href="javascript:void(null);"><b>纪检系统<span class="color_5">（<code>7</code>）</span></b></a></li><li>
                                                    <a pid="I53OOTHP8NJH-2705" queryrule="%22%u53CD%u8D2A%u5C40%22+OR+%22%u53CD%u8D2A%22"
                                                        href="javascript:void(null);"><b>反贪局<span class="color_5">（<code>16</code>）</span></b></a></li><li>
                                                            <a pid="I53OOTHP8NJH-2705" queryrule="%22%u76D1%u5BDF%u90E8%22+OR+%u76D1%u5BDF" href="javascript:void(null);">
                                                                <b>监察系统<span class="color_5">（<code>6</code>）</span></b></a></li><li><a pid="I53OOTHP8NJH-2705"
                                                                    queryrule="%22%u516C%u5B89%u5C40%22+OR+%u516C%u5B89+OR+%22%u516C%u5B89%u90E8%22+OR+%22%u6D3E%u51FA%u6240%22+OR+%u8B66%u5BDF+OR+%u4EA4%u8B66+OR+%u6C11%u8B66+OR+%22%u8B66%u65B9%22"
                                                                    href="javascript:void(null);"><b>公安系统<span class="color_5">（<code>222</code>）</span></b></a></li></ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="clear">
                </div>
                <div class="order order_2">
                    <ul class="news_list" id="SearchResult">
                        <center style="font-size: 12px; height: 100px; padding-top: 100px;"><img src="img/loading_icon.gif"></center>
                    </ul>
                    <div class="clear">
                    </div>
                </div>
                <div class="page" id="PagerList">
                    <center style="font-size: 12px; height: 100px; padding-top: 100px;"><img src="img/loading_icon.gif"></center>
                </div>
            </div>
            <!----------//　专题列表结束　//---------->
            <div class="clear">
            </div>
        </div>
    </div>
    <!-------------------------　中　部　结　束　------------------------->
    <div class="footer">
        <div class="wraper">
            <!----------//　版权信息开始　//---------->
            <div class="copyright" id="footer_info">
                <span class="left">主办单位：国家安全生产监督管理总局<br>
                    承办单位：国家安全生产监督管理总局通信信息中心 </span><span class="right"><span class="left">办公室电话：</span>(010)64464191<br>
                        (010)64464271 </span>
                <div class="clear">
                </div>
                网站管理员邮箱:wlyq@chinasafety.gov.cn<br>
                （浏览本网主页，建议将电脑显示屏的分辨率调为1024*768）</div>
            <!----------//　版权信息结束　//---------->
            <div class="clear">
            </div>
        </div>
    </div>
    <!-------------------------　底　部　结　束　------------------------->
    <div style="position: absolute; z-index: 19700; top: -1970px; left: -1970px;">
        <iframe src="http://10.16.6.100:8000/js/My97DatePicker/My97DatePicker.htm" frameborder="0"
            border="0" scrolling="no" style="width: 186px; height: 199px;"></iframe>
    </div>
    
</body>
</html>
