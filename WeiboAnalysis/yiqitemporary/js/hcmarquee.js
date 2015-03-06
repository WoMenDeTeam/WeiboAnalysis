// Copyright: hc360.com
// Author: Dakular
// Useage: HCmarquee(滚动对象id, 可见范围宽度, 可见范围高度, 滚动速度, 停留时间, 方向); 方向有left和up两种
function HCmarquee(id,mw,mh,mr,sr,ms,pause,dr){
	
	var obj=document.getElementById(id);
	obj.ss=false; //stop tag
	obj.mr=mr; //marquee rows
	obj.sr=sr; //marquee display rows
	obj.mw=mw; //marquee width
	obj.mh=mh; //marquee height
	obj.ms=ms; //marquee speed
	obj.pause=pause; //pause time
	obj.pt=0; //pre top
	obj.st=0; //stop time
	obj.dr=dr; //direction

	with(obj){
		style.width=mw+"px";
		style.height=mh+"px";
		noWrap=false;
		onmouseover=stopm;
		onmouseout=startm;
		scrollTop=0+"px";
		scrollLeft=0+"px";
	}
	
	if(obj.mr!=1){
		switch(obj.dr){
			case("up"):
				obj.tt=mh*mr/sr;
				obj.ct=mh; //current top
				obj.innerHTML+=obj.innerHTML;
				setInterval(scrollUp,obj.ms); break;
			default://("left"):
				obj.tt=mw*mr/sr;
				obj.ct=mw;
				obj.innerHTML='<div style="width:'+(obj.tt*2)+'px;"><div style="float:left;">'+obj.innerHTML+'</div><div style="float:right;">'+obj.innerHTML+'</div></div>';
				document.write('<style type="text/css">#'+id+' table{width:'+mw*mr+'px;} #'+id+' td{width:'+mw+'px;}</style>');
				setInterval(scrollLeft,obj.ms); break;
		}
	}
	
	function scrollUp(){
		if(obj.ss==true) return;
		obj.ct+=1;
		if(obj.ct==obj.mh+1){
			obj.st+=1; obj.ct-=1;
			if(obj.st==obj.pause){obj.ct=0; obj.st=0;}
		}else {
			obj.pt=(++obj.scrollTop);
			if(obj.pt==obj.tt){obj.scrollTop=0;}
		}
	}

	function scrollLeft(){
		if(obj.ss==true) return;
		obj.ct+=1;
		if(obj.ct==obj.mw+1){
			obj.st+=1; obj.ct-=1;
			if(obj.st==obj.pause){obj.ct=0; obj.st=0;}
		}else {
			obj.pt=(++obj.scrollLeft);
			if(obj.pt==obj.tt){obj.scrollLeft=0;}
		}
	}

	function stopm(){obj.ss=true;}
	function startm(){obj.ss=false;}
}