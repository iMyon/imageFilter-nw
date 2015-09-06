var fs = require("fs");
var Path = require("path");
var sizeOf = require('image-size');
// var EventEmitter = require('events').EventEmitter; 
// var event = new EventEmitter(); 

var count = 0;
var savePath = "";
function init(form){
	count = 0;
	savePath = genSaveFolder(form);
	if (!fs.existsSync(savePath)) {
		fs.mkdirSync(savePath);
	}
}

function filter(path, form, getOneCallback) {
	if (fs.statSync(path).isDirectory()) {
		var dirList = fs.readdirSync(path);
	}
	else return;

	dirList.forEach(function(item) {
		var file = Path.join(path, item);
		if (fs.statSync(file).isFile()) {
			if(item.match(/.*\.(jpg|png|bpm|gif)$/)){
				if(is_want(file, form)){
					count++;
					var to = Path.join(savePath, count + item.replace(/.*(\.(jpg|png|bpm|gif))$/, "$1"));
					copy(file, to);
					getOneCallback(file, count);
				}
			}
		}
	});

	dirList.forEach(function(item) {
		var dir = Path.join(path, item);
		if (fs.statSync(dir).isDirectory()) {
			filter(dir, form, getOneCallback);
		}
	});
}

function copy(from, to){
	var readStream = fs.createReadStream(from);
	var writeStream = fs.createWriteStream(to);
	readStream.pipe(writeStream);
}

/*
@param cmp_type  1> 2= 3<
*/
function is_want(file, form){
	var dimensions = sizeOf(file);
	var w = dimensions.width;
	var h = dimensions.height;

	//compare width&height
	if(form.w_cmp_type == 1){
		if(w<form.width) return false;
	}
	if(form.h_cmp_type == 1){
		if(h<form.height) return false;
	}
	if(form.w_cmp_type == 2){
		if(w!=form.width) return false;
	}
	if(form.h_cmp_type == 2){
		if(h!=form.height) return false;
	}
	if(form.w_cmp_type == 3){
		if(w>form.width) return false;
	}
	if(form.h_cmp_type == 3){
		if(h>form.height) return false;
	}

	//compare ratio
	if(form.opt_ratio){
		var f1 = w/h;
		var f2 = form.ratio_width/form.ratio_height;
		if(Math.abs(f1-f2) > form.ratio_float) return false;
	}

	//compare pass
	return true;
}

function genSaveFolder(form){
	var savePath = "imageFilter@"+Path.basename(form.path)+"["

	var w = form.width;
	var h = form.height;

	//compare width&height
	if(form.w_cmp_type == 1)
		savePath = savePath+"w"+w+"+";
	if(form.h_cmp_type == 1)
		savePath = savePath+",h"+h+"+";
	if(form.w_cmp_type == 2)
		savePath = savePath+"w="+w;
	if(form.h_cmp_type == 2)
		savePath = savePath+",h="+h;
	if(form.w_cmp_type == 3)
		savePath = savePath+"w"+w+"-";
	if(form.h_cmp_type == 3)
		savePath = savePath+",h"+h+"-";

	//compare ratio
	if(form.opt_ratio)
		savePath = savePath+","+form.ratio_width+"÷"+form.ratio_height+"±"+form.ratio_float;

	savePath+="]";
	//compare pass
	savePath = Path.join(Path.dirname(process.execPath),savePath);
	return savePath;
}

function getCount(){
	return count;
}

var Filter = {};
Filter.init = init;
Filter.run = filter;
Filter.getCount = getCount;

module.exports = Filter;