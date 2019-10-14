'use strict';

// {% codepen userId|anonymous|anon slugHash theme [defaultTab [height [width]]] %}

/*	

Input Example1:
	{% imageGrid rows=1 %}
		"/img/banner.jpg"
	{% endaltList %}

Input Example2:
	{% imageGrid rows=3 %}
	"/img/pic03.jpg" => "https://encrypted.googoe.com"
	"/img/pic04.jpg" => "#"
	"'img/pic05.jpg" => "#"
	"/img/pic04.jpg" => "https://encrypted.google.com"
	"/img/pic05.jpg" => "#"
	"/img/pic03.jpg" => "#"
	"/img/pic05.jpg" => "#"
	"/img/pic03.jpg" => "#"
	"/img/pic04.jpg" => "#"
	{% endaltList %}

Output:
	<!-- image grid --> 
	<div class="box alt">
	<div class="row 50% uniform">	
		<div class="4u"><span class="image fit"><img src="/img/pic03.jpg" alt="" /></span></div>
		<div class="4u"><span class="image fit"><img src="/img/pic04.jpg" alt="" /></span></div>
		<div class="4u$"><span class="image fit"><img src="'img/pic05.jpg" alt="" /></span></div>
		<div class="4u"><span class="image fit"><img src="/img/pic04.jpg" alt="" /></span></div>
		<div class="4u"><span class="image fit"><img src="/img/pic05.jpg" alt="" /></span></div>
		<div class="4u$"><span class="image fit"><img src="/img/pic03.jpg" alt="" /></span></div>
		<div class="4u"><span class="image fit"><img src="/img/pic05.jpg" alt="" /></span></div>
		<div class="4u"><span class="image fit"><img src="/img/pic03.jpg" alt="" /></span></div>
		<div class="4u$"><span class="image fit"><img src="/img/pic04.jpg" alt="" /></span></div>
	</div>

*/

function imageGrid(args, content){
	
	// setup helper funcs
	function boxAlt(inner){
		return `<div class="box alt">`+ inner + `</div>`
	};
	function rowSpacing(inner, pct){
		return `<div class="row `+ pct.toString() + `% uniform">`+ inner +`</div>`;
	};
	function widthClass(inner, idx, cols){
		
		function calcWidth(i, constraint){
			return ~~( 12 / constraint);
		};

		function isEnd(i, cols){
			var is_it_end = (i % cols) === (cols -1);
			return (is_it_end) ? "u$" : "u";
		};

		let ret = `<div class="`
				+ calcWidth(idx, cols) + isEnd(idx, cols) + ` `
				+ calcWidth(idx, ~~( cols / 2)) + isEnd(idx, ~~( cols / 2)) + `(medium)` + ` `
				+ calcWidth(idx, 2) + isEnd(idx, 2) + `(small)`
				+ `">` 
				+ inner 
				+ `</div>`;

		//console.log(ret);
		return ret

	};
	
	function imgTag(ImgUrl, config_LinkOut){
		/* hrefImg: input
		 * --------------------------
		 * string = new href location
		 *    special case = (#) = use ImgUrl
		 * bool(true) # case
		 * bool(false) null case
		 * null: do not link out
		 */

		function _linkedImg(url, link){
			return `<a href="`+link+`"`
						+`target="_blank" rel="noopener noreferrer"`+`>`
						+`<span class="image fit">`
							+`<img class="js-lazy-image" src='/images/rect.svg' data-src="`+url+`" alt="" />`
						+`</span>`
					+`</a>`
		};

		function _plainImg(url){
			//+`<img src="`+ url + `" alt="" />`
			return `<span class="image fit">`
					+`<img class="js-lazy-image" src='/images/rect.svg' data-src="`+url+`" alt="" />`
				+`</span>`

		};


		if(config_LinkOut){
			// link to provided image/shorthand
			if(ImgUrl.split(" => ").length === 2){
				let img = ImgUrl.split(" => ")[0];
				let link = ImgUrl.split(" => ")[1];
				if(link === '#') link = img;
			
				return _linkedImg(img, link);
			}
			// link to self
			else{
				return _linkedImg(ImgUrl, ImgUrl);
			}
		}
		else{
			// no linking due to config
			return _plainImg(ImgUrl);
		}
	};

	function givenC(lines, cols){
		var buildHTML = "";
		for(let idx in lines){
			buildHTML += widthClass( imgTag(lines[idx], true),
								 idx, 
								 cols);
		};
		return buildHTML;
	};
	function givenR(lines, rows){
		var buildHTML = "";
		for(let idx in lines){
			buildHTML += widthClass( imgTag(lines[idx], true),
									 idx, 
									 ~~(lines.length/rows));	
		};
		return buildHTML;
	};

	// console.log(args); 
	// console.log(content);

	// init
	// if both rows and col are specified the cols take precedance
	var r_provided = false;
	var c_provided = false;
	var r = 1;
	var c = 1;
	var s = 50;
	var lines = content.split(/\r?\n/);

	// process args into vars
	for( let i in args){
		switch(args[i].split("=")[0]) {
		case "rows":
		case "row":
			r_provided = true;
			r = parseInt( args[i].split("=")[1] );
			break;
		case "cols":
		case "col":
			c_provided = true;
			c = parseInt( args[i].split("=")[1] );
			break;
		case "spacing":
			s = parseInt( args[i].split("=")[1] );
			break;
		default:
			console.error( "imageGrid encountered a syntax error from the user row nor col was used")
		}
	};

	var outputHTML = "";
	if(r_provided && c_provided ){
		// cols take priority
		// c given
		outputHTML = boxAlt(rowSpacing(givenC(lines, c), s));

	} else if(r_provided && !c_provided ){
		//r given
		outputHTML = boxAlt(rowSpacing(givenR(lines, r), s));

	} else if(!r_provided && c_provided ){
		//c given
		outputHTML =  boxAlt(rowSpacing(givenC(lines, c), s));
	}
	return outputHTML;
};

hexo.extend.tag.register('imageGrid', imageGrid, {ends: true});