// JavaScript Document
function Statement(obj,type,data,params)
{
	
	this.Option= {
		titleOption : {
			height : 10,
			show : false,
			text : "折线图",
			style :{
				"font-size" : "20px",
				"font-family" : "Arial",	
				"left" : "40px",
				"text-align" : "center"				
			}
		},
		
		XOption : {
			show : true,
			IsSplit : true,
			SplitNum : 6,
			style : {
				"font-size" : "12px",
				"font-family" : "Arial",
				"text-align" : "center",
				"margin-left" : "-30px",
				"overflow" : "visible",
				"width" : "200px"
			},
			unitShow : false,
			unitText : "时间"
		},
	
		Cue : {
			show : false,
			style : {
				"font-size" : "12px",
				"font-family" : "Arial",
				"text-align" : "center"					
			}
		},
		
		YOption : {
			show : true,
			style : {
				"font-size" : "12px",
				"font-family" : "Arial",
				"text-align" : "right",
				"width" : 35	
			},
			tickMark : {
				show : true,
				lineWidth : 1,
				lineColor : "red"
			},
			unitShow : true,
			unitText : "文章数/篇"
		},
		
		GraphOption : {	
			AxisLine : {
				color : "red",
				lineWidth : 1
			},
			BackGrap : {
				"StartOrBackColor" : "#fcfea4",
				"Gradient" : true,
				"EndColor" : "#fcfefc"
			},	
			BackGroud : {
				show : true,
				"backGroundColor" : "#a5d2b5",
				"backImgPath" : null
			}
		},
		BrokenLine : {
			pointDiameter : 0,
			lineColor : "red",
			lineWidth : 1
		},
		Bar : {
			startColor : "#4c76fc",
			Gradient : true,
			endColor : "#2249c4"
		}	
	}
	this.obj = obj;
	this.type = type;
	this.width =  parseInt(obj.width);	
	this.height = parseInt(obj.height);
	this.ctx = obj == null ? null : obj.getContext("2d");
	this.parentDiv = $(obj).parent("div");
	this.data = data;
	/* 定义Y轴刻度线之间的间隔 */
	this.YSpace = null;
	
	this.YtickItem = [];
	
	this.XtickItem = [];
	
	this.LineData = [];
	
	this.params = params == null ? null : params;
}
Statement.prototype.init = function()
{
	var soursedata = this.params;
	if(soursedata)
	{
		parseJson(soursedata,this.Option);
		this.Option = soursedata;
	}
	$(this.parentDiv).css({"position":"relative","clear":"both"});
	$(this.obj).css("margin-top",this.Option.titleOption.height);
	this.DrawGraph();
	var maxData = this.GetMaxData(this.data);
	/* 获取每个刻度的数据 */
	var DataSpace = parseInt(maxData / 8);
	/* 初始化Y轴轴线之间的空隙 */
	this.YSpace = (this.height -40)/9;
	for(var i =0 ; i<10;i++)
	{
		this.YtickItem.push([i*this.YSpace,i*DataSpace]);			
	}	
	if(this.Option.YOption.tickMark.show)
	{		
		for(var i =0;i < this.YtickItem.length;i++)
		{
			this.DrawTickY(parseInt(this.height)-20- this.YtickItem[i][0],this.YtickItem[i][1]);
		}
	}
	var XSpace = (this.width - 115)/(this.data.length+1);
	var y = parseInt(this.height);		
	this.Option.XOption.style["width"] = XSpace-20;
	var l_height = this.Option.titleOption.height;
	for(var i =0;i<this.data.length;i++)
	{
		if(this.Option.XOption.show)
		{
		    if(this.Option.XOption.IsSplit){
		        var SpaceNum = parseInt(this.data.length / 	this.Option.XOption.SplitNum);	        
		        if( i % SpaceNum == 0){
		            this.DrawCue(this.data[i][0],(i+0.5)*XSpace+45,l_height+this.height-35,this.Option.XOption.style);	
		        }
		    }else{
		        this.DrawCue(this.data[i][0],(i+0.5)*XSpace+45,l_height+this.height-35,this.Option.XOption.style);	
		    }
			
		}		
		if(this.Option.Cue.show)
		{
		    if(this.data[i][1] != 0){
			    this.Option.Cue.style["width"] = XSpace-20;
			    this.DrawCue(this.data[i][1],(i+0.5)*XSpace+35 ,this.height + l_height -60 - this.data[i][1]/ DataSpace * this.YSpace,this.Option.Cue.style);
			}	
		}
		if(this.type == "Broken")
		{
			this.DrawArc((i+1)*XSpace + 35, this.height -20 - this.data[i][1]/ DataSpace * this.YSpace );
		}
		else if(this.type == "Bar")
		{
			this.DrawBar((i+1)*XSpace+35,this.height -20 - this.data[i][1]/ DataSpace * this.YSpace,XSpace-15);	
		}
		this.LineData.push([(i+1)*XSpace + 35,this.height -20 - this.data[i][1]/ DataSpace * this.YSpace]);
	}
	if(this.type == "Broken")
	{
		this.DrawLine();
	}
}
/* 画折线图的圆点 */
Statement.prototype.DrawArc = function(x,y)
{
	var ctx = this.ctx;
	ctx.fillStyle = this.Option.BrokenLine.lineColor;
	ctx.beginPath();
	ctx.arc(x, y, this.Option.BrokenLine.pointDiameter, 0, Math.PI *2, false);
	ctx.fill();
	ctx.closePath();
	
}
/* 画折线 */
Statement.prototype.DrawLine = function()
{
	if(this.LineData)
	{
		var ctx = this.ctx;
		ctx.strokeStyle = this.Option.BrokenLine.lineColor;
		ctx.lineWidth = this.Option.BrokenLine.lineWidth;
		ctx.beginPath();
		ctx.moveTo(this.LineData[0][0],this.LineData[0][1]);
		for(var i = 1;i<this.LineData.length;i++)
		{
			ctx.lineTo(this.LineData[i][0],this.LineData[i][1]);
		}
		ctx.stroke();
		ctx.closePath();
	}
}

/* 画柱图 */
Statement.prototype.DrawBar = function(x,y,space)
{	
	var ctx = this.ctx;
	var Xspace = x-space/2;
	var grd=ctx.createLinearGradient(Xspace,parseInt(this.height) - 20,Xspace,y);
	grd.addColorStop(0,this.Option.Bar.startColor);
	if(this.Option.Bar.Gradient)
	{
		grd.addColorStop(1,this.Option.Bar.endColor);
	}
	ctx.fillStyle = grd;
	ctx.beginPath();	
	ctx.fillRect(Xspace,y,space,parseInt(this.height) - 20 -y);
	ctx.closePath();
}

/* 得出最大数据 */
Statement.prototype.GetMaxData = function(data)
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

Statement.prototype.DrawGraph = function()
{
	this.DrawBackGround();
	this.DrawX();
	this.DrawY();
	this.DrawGraphBack();	
	if(this.Option.titleOption.show)
	{
		this.DrawTitle();	
	}	
	
}

Statement.prototype.DrawBackGround = function()
{
	if(this.Option.GraphOption.BackGroud.show)
	{
		if(this.Option.GraphOption.BackGroud.backImgPath)
		{
			$(this.parentDiv).css("background","url("+ this.Option.GraphOption.BackGroud.backImgPath +")");	
		}
		else
		{
			$(this.parentDiv).css("background",this.Option.GraphOption.BackGroud.backGroundColor);	
		}
	}
}

Statement.prototype.DrawGraphBack = function()
{	
	var ctx = this.ctx;
	var grd=ctx.createLinearGradient(40,this.height-20,40,20);
	grd.addColorStop(0,this.Option.GraphOption.BackGrap.StartOrBackColor);
	if(this.Option.GraphOption.BackGrap.Gradient)
	{
		grd.addColorStop(1,this.Option.GraphOption.BackGrap.EndColor);
	}
	ctx.fillStyle = grd;
	ctx.beginPath();
    ctx.fillRect(40, 20,this.width -120,this.height -40);	
	ctx.closePath();
}

/* 画X轴 */
Statement.prototype.DrawX = function()
{
	var ctx = this.ctx;
	var y = this.height - 20;
	var x = this.width - 80;
	ctx.strokeStyle = this.Option.GraphOption.AxisLine.color;	
	ctx.lineWidth = this.Option.GraphOption.AxisLine.lineWidth;
	ctx.beginPath();
    ctx.moveTo(40, y);	
    ctx.lineTo(x, y);	
	ctx.stroke();  	
	ctx.closePath();		
	if(this.Option.XOption.unitShow)
	{		
		var OtherStyle = {"text-align" : "left","width" : 70};
		this.DrawCue(this.Option.XOption.unitText,x+5,y+this.Option.titleOption.height-20,this.Option.XOption.style,OtherStyle);	
	}
}

/* 画Y轴 */
Statement.prototype.DrawY = function()
{
	var ctx = this.ctx;
	var y = this.height - 20;	
	ctx.strokeStyle = this.Option.GraphOption.AxisLine.color;	
	ctx.lineWidth = this.Option.GraphOption.AxisLine.lineWidth;
	ctx.beginPath();
    ctx.moveTo(40, y);	
    ctx.lineTo(40, 20);	
	if(this.type == "Broken")
	{
		ctx.moveTo(this.width -80, y);	
    	ctx.lineTo(this.width -80, 20);		
	}
	ctx.stroke();  	
	ctx.closePath();		
	if(this.Option.YOption.unitShow)
	{		
		var OtherStyle = {"text-align" : "left","width" : 70};
		this.DrawCue(this.Option.YOption.unitText,0,this.Option.titleOption.height - 20,this.Option.YOption.style,OtherStyle);	
	}
}

/* 画Y轴刻度线 */
Statement.prototype.DrawTickY = function(y,cueData)
{
	var ctx = this.ctx;
	var x = this.width - 80;
	ctx.strokeStyle = this.Option.YOption.tickMark.lineColor;	
	ctx.lineWidth = this.Option.YOption.tickMark.lineWidth;
	ctx.beginPath();
    ctx.moveTo(40, y);	
    ctx.lineTo(x, y);	
	ctx.stroke();  	
	ctx.closePath();
	this.DrawCue(cueData,0,y+this.Option.titleOption.height-25,this.Option.YOption.style);
}

/* 画标题 */
Statement.prototype.DrawTitle = function()
{	
	var style = this.Option.titleOption.style;
	style["width"] = this.width;
	style["left"] = 0;
	style["top"] = 0;
	this.DrawCue(this.Option.titleOption.text,0,0,this.Option.titleOption.style);
}

/* 图层提示 */
Statement.prototype.DrawCue = function(l_data,x,y,style,OtherStyle)
{
	var div = document.createElement("DIV");
	$(div).css({"position" : "absolute" ,"padding" :"0px"});
	for(var item in style)
	{
		$(div).css(item,style[item]);			
	}
	if(OtherStyle)
	{
		for(var item in OtherStyle)
		{
			$(div).css(item,OtherStyle[item]);			
		}	
	}
	if(!style.left)
	{	
		$(div).css("left",x);
	}	
	$(div).css("top",y + 20);
	div.innerHTML = l_data;
	this.parentDiv.append($(div));
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