
// JavaScript Document
function LineMap(obj,data,params)
{	
	this.Option = {
		titleOption : {
		    height : 0,
		    show : false,
		    text : "三维柱状图",
		    style :{
			    "font-size" : "20px",
			    "font-family" : "Arial",			
			    "font-weight" : "bold",
			    "line-height" : "50px"
		    }
	    },			
	    /* X轴字体各项参数 */
	    XOption : {
		    show : true,
		    style : {
			    "font-size" : "10px",
			    "font-family" : "Arial",
			    "text-align" : "center",
			    "width" : "200px",
			    "line-height":"11px"
		    },
		    unitShow : false,
		    unitText : null
	    },
	    /* 柱状图提示的各项参数 */
	    Cue : {
		    show : true,
		    style : {
			    "font-size" : "10px",
			    "font-family" : "Arial",
			    "text-align" : "center"					
		    }
	    },
	    /* Y轴刻度线提示的各项参数 */
	    YOption : {
		    show : true,
		    style : {
			    "font-size" : "8px",
			    "font-family" : "Arial",
			    "text-align" : "right",
			    "width" : 35	
		    },
		    unitShow : false,
		    unitText : "文章数/篇"
	    },		
	    GraphOption : {	
		    Line : {
			    show : true,
			    color : "black"
		    },
		    XGrap : {
			    "StartOrBackColor" : "#64a899",
			    "Gradient" : true,
			    "EndColor" : "#badeba"
		    },
		    YGrap : {
			    "StartOrBackColor" : "white"
		    },
		    BackGrap : {
			    "StartOrBackColor" : "#a8dede",
			    "Gradient" : true,
			    "EndColor" : "#fafcf9"
		    },	
		    BackGroud : {
			    show : true,
			    "backGroundColor" : "#a5d2b5",
			    "backImgPath" : null
		    }	
	    },
	    PillarParams : {
		    YGradient : 0 ,
		    FacadeStyle :{ 
			    "StartColor" : "#54c59a",
			    "Gradient" : true,
			    "EndColor" : "#43b38b"
		    },
		    TopStyle : { 
			    "StartColor" : "#43b38b",
			    "Gradient" : false,
			    "EndColor" : "red"
		    },
		    ProfileStyle : { 
			    "StartColor" : "#54c59a",
			    "Gradient" : true,
			    "EndColor" : "#43b38b"
		    }
	    }
	}
	/* 初始化参数 */
	this.OtherOption = params == null ? {} : params;
	/* 获取展示数据 */
	this.data = data;
	/* 定义柱状图的宽度 */
	this.PillarWidth = null;
	/* 定义柱状图之间的间隔 */
	this.PillarSpace = null;
	/* 定义Y轴刻度线之间的间隔 */
	this.XSpace = null;
	/* 定义canvas */
	this.obj = obj;
	/* 定义画布外的DIV */
	this.parent_obj = $(obj).parent("div");
	/* 获取画布宽度 */
	this.width = obj.width;
	/* 获取画布高度 */
	this.height = obj.height;
	/* 定义绘图工具 */
	this.ctx = obj == null ? null : obj.getContext("2d");	
	/* 定义刻度线的刻度值 */
	this.XItem = [];
	/* 定义柱状图的数据 */
	this.PillarData = [];	
}
/* 图层初始化 */
LineMap.prototype.init = function()
{		
	var soursedata = this.OtherOption;
	parseJson(soursedata,this.Option);
	this.Option = soursedata;
	this.Option.titleOption.style.width = this.width -60;
	/* 获取最大数据 */
	var MaxData = this.GetMaxData(this.data);
	/* 获取每个刻度的数据 */
	var DataSpace = parseInt(MaxData / 8);
	/* 初始化Y轴轴线之间的空隙 */
	this.XSpace = (this.height -50)/9;
	for(var i =0 ; i<10;i++)
	{
		this.XItem.push([i*DataSpace]);			
	}	
	var Gap =  1/this.data.length * 100;
	var X_Position = parseInt(this.width / this.data.length) - Gap;
	this.PillarWidth = parseInt(this.width / this.data.length) * 0.5;
	for(var i =0;i<this.data.length;i++)
	{
		var x = X_Position * i + 65;			
		var count = this.data[i][1];
		var y = count / DataSpace * this.XSpace;
		this.PillarData.push([y,this.data[i][0],this.data[i][1],x]);	
	}
	
	this.Option.XOption.style.width = this.PillarWidth + this.Option.PillarParams.YGradient ;
	this.Option.Cue.style.width = this.PillarWidth + this.Option.PillarParams.YGradient+20;
	
	$(this.obj).css("margin-top",this.Option.titleOption.height);
	this.parent_obj.css({"position":"relative"});	
	this.DrawGraph();
	this.DrawAllData();		
	if(this.Option.GraphOption.BackGroud.show)
	{
		if(this.Option.GraphOption.BackGroud.backImgPath)
		{
			$(this.parent_obj).css("background","url("+ this.Option.GraphOption.BackGroud.backImgPath +")");
		}
		else
		{
			$(this.parent_obj).css("background",this.Option.GraphOption.BackGroud.backGroundColor);	
		}
	}
}
/* 得出最大数据 */
LineMap.prototype.GetMaxData = function(data)
{
	var Max_data = 0;
	for(var i = 0;i<data.length;i++)
	{
		if(data[i][1] > Max_data)
		{
			Max_data = data[i][1];	
		}
	}
	return Max_data + 7;
}

/* 柱状图 */
LineMap.prototype.DrawAllData = function()
{
	var x = this.width - 20;
	var y = this.height - 20;		
	for(var i = 0; i<this.PillarData.length; i++)
	{
		var data = this.PillarData[i];
		this.DrawPillar(data[3],y,data[3],y-data[0],data[1],data[2]);
	}
	if(this.Option.XOption.unitShow)
	{
		var style = this.Option.XOption.style;
		style.width = 70;
		style["text-align"] = "left";
		this.DrawCue(this.Option.XOption.unitText,x-20,y+this.Option.PillarParams.YGradient+50,style);
	}
}

/* 画X轴、Y轴以及背景 */
LineMap.prototype.DrawGraph = function()
{
	this.DrawY(); 
	this.DrawTitle(this.Option.titleOption.text);
	this.DrawX(); 
	this.DrawBack();
	if(this.Option.GraphOption.Line.show)
	{
		for(var i =0; i<this.XItem.length;i++)
		{
			if(i==0)
			{
				this.LineX(40,this.height - 20,this.XItem[i]);
			}
			else
			{
				this.LineX(40,this.height - (20+i*this.XSpace),this.XItem[i]);	
			}
		}
	}
	if(this.Option.YOption.unitShow)
	{
		var style = this.Option.YOption.style;
		style.width = 70;
		style["text-align"] = "left";
		this.DrawCue(this.Option.YOption.unitText,0,this.Option.titleOption.height,style);
	}
}
/* 画标题 */
LineMap.prototype.DrawTitle = function(title)
{
	if(this.Option.titleOption.show)
	{
		var position_x = parseInt(this.width / 2);
		this.DrawCue(title,position_x,10,this.Option.titleOption.style);
	}
}

/* 画Y轴 */
LineMap.prototype.DrawY = function()
{
	var y = this.height - 20;
	var ctx = this.ctx;
	
	var grd=ctx.createLinearGradient(40,y,40,30);
	grd.addColorStop(0,this.Option.GraphOption.XGrap.StartOrBackColor);
	if(this.Option.GraphOption.XGrap.Gradient)
	{
		grd.addColorStop(1,this.Option.GraphOption.XGrap.EndColor);
	}
	ctx.fillStyle=grd;
	ctx.beginPath();
    ctx.moveTo(40, y);
	ctx.lineTo(60 ,y-this.Option.PillarParams.YGradient-10);
	ctx.lineTo(60 , 20 - this.Option.PillarParams.YGradient);
    ctx.lineTo(40, 30);	
	ctx.fill();  	
	ctx.closePath();
}
/* 画Y轴刻度线 */
LineMap.prototype.LineX = function(x,y,data)
{
	var height = this.Option.titleOption.height;
	var ctx = this.ctx;
	var l_y = this.height - 20;
	var l_x = this.width - 20;
	ctx.strokeStyle = this.Option.GraphOption.Line.color;
  	ctx.lineWidth = 0.8;
	ctx.beginPath();
    ctx.moveTo(x, y);
	ctx.lineTo(x+20 ,y-this.Option.PillarParams.YGradient-10);
	ctx.lineTo(x+l_x-40,y-this.Option.PillarParams.YGradient-10);
	ctx.stroke(); 	
	ctx.closePath();	
	if(this.Option.YOption.show)
	{
		this.DrawCue(data,0,y+height+this.Option.PillarParams.YGradient,this.Option.YOption.style);
	}
}
/* 画X轴 */
LineMap.prototype.DrawX = function()
{
	var ctx = this.ctx;
	var y = this.height - 20;
	var x = this.width - 20;
	
	var grd=ctx.createLinearGradient(40,y,x,y-this.Option.PillarParams.YGradient-10);
	grd.addColorStop(0,this.Option.GraphOption.YGrap.StartOrBackColor);
	if(this.Option.GraphOption.YGrap.Gradient)
	{
		grd.addColorStop(1,this.Option.GraphOption.YGrap.EndColor);
	}
	ctx.fillStyle=grd;
	
	//ctx.fillStyle   = this.Option.GraphOption.YGrap.StartOrBackColor;	
	ctx.beginPath();
    ctx.moveTo(40, y);
	ctx.lineTo(x -20 ,y);
	ctx.lineTo(x ,y-this.Option.PillarParams.YGradient-10);
	//var l_X = 
    ctx.lineTo(60, y-this.Option.PillarParams.YGradient-10);	
	ctx.fill();  	
	ctx.closePath();		
}
/* 画背景 */
LineMap.prototype.DrawBack = function()
{
	var context = this.ctx;
	var y = this.height - 20;
	var x = this.width - 20;	
	var grd=context.createLinearGradient(40,y,40,30);
	grd.addColorStop(0,this.Option.GraphOption.BackGrap.StartOrBackColor);
	if(this.Option.GraphOption.BackGrap.Gradient)
	{
		grd.addColorStop(1,this.Option.GraphOption.BackGrap.EndColor);
	}
	context.fillStyle=grd;
	//context.fillStyle   = this.Option.GraphOption.BackGrap.StartOrBackColor; // blue	
	context.fillRect(60,20 -this.Option.PillarParams.YGradient, x-60, y-30);		
}
/* 画单个的柱状图*/
LineMap.prototype.DrawPillar = function(begin_x,begin_y,end_x,end_y,cue,data)
{
	var height = this.Option.titleOption.height;
	this.DrawFacade(begin_x,begin_y,end_x,end_y);
	this.DrawTop(end_x,end_y,end_x+20,end_y-this.Option.PillarParams.YGradient-10);
	this.DrawProfile(begin_x+this.PillarWidth,begin_y,end_x+this.PillarWidth,end_y);	
	if(this.Option.Cue.show)
	{
		this.DrawCue(data,end_x,end_y-20+height,this.Option.Cue.style);
	}
	if(this.Option.XOption.show)
	{	    
		this.DrawCue(cue,begin_x-5,begin_y+13+height+this.Option.PillarParams.YGradient,this.Option.XOption.style);
	}
}
/* 柱状图正面 */
LineMap.prototype.DrawFacade = function(begin_x,begin_y,end_x,end_y)
{
	var ctx = this.ctx;	
	
	var grd=ctx.createLinearGradient(begin_x,begin_y,end_x,end_y);
	grd.addColorStop(0,this.Option.PillarParams.FacadeStyle.StartColor);
	if(this.Option.PillarParams.FacadeStyle.Gradient)
	{
		grd.addColorStop(1,this.Option.PillarParams.FacadeStyle.EndColor);
	}
	ctx.fillStyle = grd;
	ctx.beginPath();
    ctx.moveTo(begin_x, begin_y);
	ctx.lineTo(begin_x+this.PillarWidth ,begin_y);
	ctx.lineTo(end_x+this.PillarWidth ,end_y);
    ctx.lineTo(end_x, end_y);	
	ctx.fill();  	
	ctx.closePath();
}

/* 柱状图顶部*/
LineMap.prototype.DrawTop = function(begin_x,begin_y,end_x,end_y)
{
	var ctx = this.ctx;	
	var grd=ctx.createLinearGradient(begin_x,begin_y,end_x,end_y);
	grd.addColorStop(0,this.Option.PillarParams.TopStyle.StartColor);
	if(this.Option.PillarParams.TopStyle.Gradient)
	{
		grd.addColorStop(1,this.Option.PillarParams.TopStyle.EndColor);
	}	
	ctx.fillStyle = grd;
	ctx.beginPath();
    ctx.moveTo(begin_x, begin_y);
	ctx.lineTo(begin_x+this.PillarWidth ,begin_y);
	ctx.lineTo(end_x+this.PillarWidth ,end_y);
    ctx.lineTo(end_x, end_y);	
	ctx.fill();  	
	ctx.closePath();
}

/* 柱状图侧面 */
LineMap.prototype.DrawProfile = function(begin_x,begin_y,end_x,end_y)
{
	var ctx = this.ctx;
	var grd=ctx.createLinearGradient(begin_x,begin_y,end_x,end_y);
	grd.addColorStop(0,this.Option.PillarParams.ProfileStyle.StartColor);
	if(this.Option.PillarParams.ProfileStyle.Gradient)
	{
		grd.addColorStop(1,this.Option.PillarParams.ProfileStyle.EndColor);
	}
	ctx.fillStyle = grd;
	ctx.beginPath();
    ctx.moveTo(begin_x, begin_y);
	ctx.lineTo(begin_x+20 ,begin_y-this.Option.PillarParams.YGradient -10);
	ctx.lineTo(end_x+20,end_y-this.Option.PillarParams.YGradient - 10);
    ctx.lineTo(end_x, end_y);	
	ctx.fill();    
	ctx.closePath();
}
/* 图层提示 */
LineMap.prototype.DrawCue = function(l_data,x,y,style)
{
	var div = document.createElement("DIV");
	$(div).css({"position" : "absolute","margin" : "0px" ,"padding" :"0px"});
	for(var item in style)
	{
		$(div).css(item,style[item]);			
	}
	if(!style.left)
	{	
		$(div).css("left",x);
	}	
	$(div).css("top",y -this.Option.PillarParams.YGradient-6);
	//div.style.top = ;	
	div.innerHTML = l_data;
	this.parent_obj.append($(div));
}


/* 合并两个Json对象 */
function parseJson(o,a_data)
{		
	for(var item in a_data)
	{			
		if(o[item] ==null)
		{	
			o[item] = a_data[item];	
		}				
		else
		{				
			parseChildJson(o,a_data[item],item,o);
		}
	}	
}

function parseChildJson(o,a_data,index,l_data)
{
	
	for(var item in a_data)
	{			
		if(l_data[index][item] ==null)
		{						
			l_data[index][item] = a_data[item];	
		}
		else 
		{				
			
			if(typeof(a_data[item]) == "object" )
			{						
				parseChildJson(o,a_data[item],item,o[index]);
			}				
		}
	}
}

