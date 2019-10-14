'use strict';

// {% codepen userId|anonymous|anon slugHash theme [defaultTab [height [width]]] %}

/*	
	<!-- input --> 
	{% embedGrid cols=4 %}
	<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/BdXr91mlrjR/" ...
	<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/BdXr91mlrjR/" ...
	<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/BdXr91mlrjR/" ...
	<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/BdXr91mlrjR/" ...
	{% endaltList %}

	<!-- output --> 
	<div class="box alt">
		<div class="row 50% uniform">	
			<div class="3u"> <embed/> </div>
			<div class="3u"> <embed/> </div>
			<div class="3u"> <embed/> </div>
			<div class="3u$"><embed/> </div>
		</div>
	</div>

	{% imageGrid rows=1 %}
		"/img/banner.jpg"
	{% endaltList %}



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

		return `<div class="`
				+ calcWidth(idx, cols) + isEnd(idx, cols) + ` `
				+ calcWidth(idx, ~~( cols / 2)) + isEnd(idx, ~~( cols / 2)) + `(medium)` + ` `
				+ calcWidth(idx, 2) + isEnd(idx, 2) + `(small)`
				+ `">` 
				+ inner 
				+ `</div>`
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

	//init
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