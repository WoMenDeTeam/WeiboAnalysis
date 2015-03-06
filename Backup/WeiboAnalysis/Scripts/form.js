var FormUtil = new Object;
FormUtil.setText = function() {
	var colInputs = document.getElementsByTagName("input");
	for (var i = 0; i < colInputs.length; i++) {
			colInputs[i].onmouseover = function() { this.focus(); }
			colInputs[i].onfocus = function() {  this.select(); }
	}
};
window.onload = FormUtil.setText;