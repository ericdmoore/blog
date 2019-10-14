'use strict';

/*	USAGE
	{% imageWide /img/banner.jpg %}
*/

const width = 106;
const offset = (width - 100)/2;

function imageWide(args, content){
	function p(string){
		return `<p> ` + string + ` <p>`;
	};

	function extDiv(inner){
		return ` <div  ` 
				+ ` style="width:`+width.toString()+`%; margin: 0px 0px 0px -`+offset.toString()+`%; overflow: hidden">`
				+ inner + `</div>`;
	};

	function imgTag(string){
		return `<img style="border-radius: 0;" class="image fit" src="` + string + `" alt="" />`;
	};
	// console.log(args);
	// console.log(content);
	
	let wrapped_content = "";
	for(let arg of args){
		wrapped_content += imgTag(arg);
	};

	let debug  = `<dialog open> <p> HELP: </p>`
					+p(JSON.stringify(args))
					+p(JSON.stringify(content))
					+wrapped_content
					+ `</dialog>`;
	
	return extDiv(wrapped_content);
};
hexo.extend.tag.register('imageWide', imageWide, {ends: false});