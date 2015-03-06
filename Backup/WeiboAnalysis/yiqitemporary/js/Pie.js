// JavaScript Document
// 该3D饼图的画图方向为逆时针
// 参数OBJ为画布，data为饼图依靠的数据源，params为用户特定的饼图样式
function ThreeDPie(obj,data,params)
{
	this.Option = {
		ColorList : ["#b7cc94","#a799bc","#4371a5","#a84442","#8da04f","#72578e","#4096ad","#d9823b","#91a7ce","#ce9190"],		
		TitleOption : {
			show : false,
			text : "三维饼图",
			style : {				
				"font-size" : "15px",
				"font-weight" : "bold",
				"width" : 80,
				"text-align" : "center"
			}
		},
		PieOption :
		{
			PieLongDiameter	: 100,
			PieShortDiameter : 80,
			Pie3DHeight : 25
		},
		GraphOption : {
			XScale : 0.28,
			LineWidth : 1,
			LineColor : "black",
			BackShow : true,			
			BackGroundColor : {
				"StartColor" : "#a5d2b5",
				"Gradient" : false,
				"EndColor" : "red"
			},
			BackImgPath : null
		},
		DataCue : {
			show : true,
			style : {
				"width" : 135,
				"font-size" : "12px",
				"color" : "#401312",
				"height" : 32
			}
		}	
	}
	this.obj = obj;
	this.width = obj.width;
	this.height = obj.height;	
	this.cicle_x = obj.width * 0.4;
	this.cicle_y = obj.height / 2;
	this.ctx = obj == null ? null : obj.getContext("2d");
	this.PieData = data;
	this.parent_div = obj.parentNode;
	this.cueData = [];
	this.params = params == null ? {} : params;
	this.startPoints = [];
	this.endPoints = [];
}
ThreeDPie.prototype.init = function()
{	
	var soursedata = this.params;
	parseJson(soursedata,this.Option);
	this.Option = soursedata;
	
	this.cicle_x = this.obj.width * this.Option.GraphOption.XScale;
	$(this.parent_div).css({"position":"relative","clear":"both"});
	if(this.Option.GraphOption.BackShow)
	{
		if(this.Option.GraphOption.BackImgPath)
		{
			this.SetBackImage(this.Option.GraphOption.BackImgPath);
		}
		else
		{
			this.ctx.beginPath();			
			var grd = this.ctx.createLinearGradient(0,0,0,this.height);			
			grd.addColorStop(0,this.Option.GraphOption.BackGroundColor.StartColor);
			
			if(this.Option.GraphOption.BackGroundColor.Gradient)
			{
				grd.addColorStop(1,this.Option.GraphOption.BackGroundColor.EndColor);
			}
			this.ctx.fillStyle = grd;
			this.ctx.fillRect(0 , 0 ,this.width,this.height);			
			this.ctx.closePath();
		}
	}
	this.ctx.lineWidth = this.Option.GraphOption.LineWidth;
	this.ctx.strokeStyle = this.Option.GraphOption.LineColor;
	var totalCount = this.GetTotleCount();
	
	var last_Degree = Math.PI ;
	for(var i=0;i< this.PieData.length;i++)
	{		
		this.cueData.push([this.PieData[i][0],this.PieData[i][1],this.PieData[i][1] / totalCount]);
		var start_degree = last_Degree;
		var end_degree = start_degree + Math.PI * 2 * this.PieData[i][1] / totalCount;			
		this.DrawPie(start_degree,end_degree,this.Option.ColorList[i]);	
		last_Degree = end_degree;
	}	
	if(this.Option.DataCue.show)
	{		
		this.DrawRightCue();	
	}
	if(this.Option.TitleOption.show)
	{
		this.DrawTitle();
	}
}

ThreeDPie.prototype.GetTotleCount = function()
{
	var totleCount = 0;
	for(var i = 0;i < this.PieData.length; i++)
	{
		totleCount= totleCount + parseInt(this.PieData[i][1]);	
	}
	return totleCount;
}

ThreeDPie.prototype.DrawPie = function(start_degree,end_degree,color)
{
	this.startPoints = [];
	this.endPoints = [];
	
	var LongDiameter = this.Option.PieOption.PieLongDiameter;
	var ShortDiameter = this.Option.PieOption.PieShortDiameter;
	var PieHeight = this.Option.PieOption.Pie3DHeight;
	var startDegree = start_degree ;
	var endDegree = end_degree;	
	
	if( startDegree >= Math.PI && startDegree < Math.PI *2 &&  endDegree > Math.PI *2)
	{
		this.startPoints.push([this.cicle_x + LongDiameter,this.cicle_y]);
		this.startPoints.push([this.cicle_x + LongDiameter,this.cicle_y+ PieHeight]);	
	}	
	if(startDegree > Math.PI * 2 && endDegree >= Math.PI *3 )
	{
		this.endPoints.push([this.cicle_x - LongDiameter,this.cicle_y + PieHeight]);
		this.endPoints.push([this.cicle_x - LongDiameter,this.cicle_y]);		
	}
	var x = 0;
	var y = 0;
	for( var i =startDegree;i<= endDegree  ;i = i+0.01)
	{			
		x=this.cicle_x  + LongDiameter * (Math.cos(i));
		y=this.cicle_y  + ShortDiameter*(Math.sin(i));
		if( i == startDegree && this.startPoints.length == 0)
		{			
			this.startPoints.push([x,y]);
			this.startPoints.push([x,y+PieHeight]);
		}		
	}	
	if(this.endPoints.length == 0)
	{
		this.endPoints.push([x,y+PieHeight]);
		this.endPoints.push([x,y]);	
	}
	
	
	var grd=this.ctx.createLinearGradient(this.endPoints[0][0],this.endPoints[0][1],this.startPoints[0][0],this.startPoints[0][1]);	
	grd.addColorStop(0,"gray");		
	grd.addColorStop(1,color);	
	
	if(start_degree>Math.PI && end_degree <Math.PI *2)
	{			
		this.DrawFloor(start_degree,end_degree,color);	
	}
	else
	{
		
		this.DrawShadow(start_degree,end_degree,grd);
		this.DrawTowLine(grd);	
		this.DrawFloor(start_degree,end_degree,color);	
	}
	
}

ThreeDPie.prototype.DrawShadow = function(startDegree,endDegree,grd)
{
	var ctx = this.ctx;
	ctx.beginPath();
	ctx.moveTo(this.startPoints[0][0],this.startPoints[0][1]);	
	if( startDegree < Math.PI * 2 && endDegree >= Math.PI * 2)
	{
		for( var i =Math.PI *2;i<= endDegree  ;i = i+0.01)
		{			
			var x=this.cicle_x  + this.Option.PieOption.PieLongDiameter * (Math.cos(i));
			var y=this.cicle_y + this.Option.PieOption.Pie3DHeight  + this.Option.PieOption.PieShortDiameter *(Math.sin(i));		
			ctx.lineTo(x,y);		
		}		
	}
	else if( startDegree >= Math.PI * 2)
	{		
		for( var i =startDegree;i<= endDegree  ;i = i+0.01)
		{			
			var x=this.cicle_x  + this.Option.PieOption.PieLongDiameter * (Math.cos(i));
			var y=this.cicle_y + this.Option.PieOption.Pie3DHeight  + this.Option.PieOption.PieShortDiameter*(Math.sin(i));		
			ctx.lineTo(x,y);		
		}		
	}
	ctx.fillStyle=grd;	
	ctx.fill();		
	ctx.stroke();
}
/* 画两根直线 */
ThreeDPie.prototype.DrawTowLine = function(grd)
{
	var ctx = this.ctx;
	ctx.beginPath();
	ctx.fillStyle=grd;	
	ctx.moveTo(this.startPoints[0][0],this.startPoints[0][1]);
	ctx.lineTo(this.startPoints[1][0],this.startPoints[1][1]);	
	ctx.stroke();
	ctx.lineTo(this.endPoints[0][0],this.endPoints[0][1]);
	ctx.lineTo(this.endPoints[1][0],this.endPoints[1][1]);	
	ctx.fill();	
	
	ctx.beginPath();
	ctx.moveTo(this.endPoints[0][0],this.endPoints[0][1]);
	ctx.lineTo(this.endPoints[1][0],this.endPoints[1][1]);		
	ctx.stroke();
}
/* 画上层建筑 */
ThreeDPie.prototype.DrawFloor = function(startDegree,endDegree,color)
{
	var ctx = this.ctx;
	ctx.beginPath();		
	ctx.moveTo(this.cicle_x,this.cicle_y);
	ctx.fillStyle = color;
	for( var i =  startDegree;i<= endDegree ;i = i+0.01)
	{
		var x=this.cicle_x + this.Option.PieOption.PieLongDiameter * (Math.cos(i));
		var y=this.cicle_y + this.Option.PieOption.PieShortDiameter * (Math.sin(i));			
		ctx.lineTo(x,y);			
	}	
	ctx.lineTo(this.cicle_x,this.cicle_y);
	ctx.fill();		
	ctx.stroke();	
}

ThreeDPie.prototype.SetBackImage = function(url)
{		
    this.parent_div.style.backgroundImage = "url(" + url + ")";	
}
/* 绘制右边提示 */
ThreeDPie.prototype.DrawRightCue = function()
{
	var start_x = this.cicle_x + this.Option.PieOption.PieLongDiameter + 10;
	var all_height = this.cueData.length * 40;
	var start_y = this.cicle_y - all_height / 2;  
	var end_y = this.cicle_y + all_height / 2;
	
	var space = (end_y - start_y) / this.cueData.length;	
	for(var i = 0;i< this.cueData.length;i++)
	{		
		this.ctx.beginPath();
		this.ctx.fillStyle = this.Option.ColorList[i];
		this.ctx.fillRect(start_x,start_y+ i * space,10,10);		
		this.ctx.closePath();
		var div = document.createElement("DIV");	
		var left = start_x + 20;
		var top = start_y+ i * space -5;
		$(div).css({"position":"absolute","left" : left ,"top" : top, "background" : this.Option.ColorList[i]});
		for(var item in this.Option.DataCue.style)
		{
			$(div).css(item,this.Option.DataCue.style[item]);	
		}
		$(div).html(this.cueData[i][0] + "&nbsp;&nbsp;数量:" + this.cueData[i][1] + "&nbsp;&nbsp;&nbsp;比例为：" + 
		this.formatFloat(this.cueData[i][2] * 100,2) + "%");
		$(this.parent_div).append(div);
	}
}

ThreeDPie.prototype.formatFloat = function(src, pos)
{
    return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
}

/* 绘制图层标题 */
ThreeDPie.prototype.DrawTitle = function()
{
 	var titleOption = this.Option.TitleOption;
	var left = this.cicle_x - titleOption.style.width / 2;
	var div = document.createElement("DIV");
	$(div).css({"position":"absolute","left" : left ,"top" : 20});
	for(var item in titleOption.style)
	{
		$(div).css(item,titleOption.style[item]);	
	}
	$(div).html(titleOption.text);
	$(this.parent_div).append(div);
}

/* 合并两个Json对象 */
function parseJson(o,a_data)
{		
	for(var item in a_data)
	{			
		if(o[item] == null)
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
