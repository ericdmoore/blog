'use strict';
/*	
	<!-- sidenote  --> 

	::USAGE::
	{% sidenote 1 %} markdown goes in here??/ {% endsidenote %}


	<span class="newthought">In his later books
		<label 
			class="margin-toggle sidenote-number" 
			for="sn-in-his-later-books" 
			></label></span>


	::RENDERED::
		<input type="checkbox" 
		id="sn-in-his-later-books" 
		class="margin-toggle"/>
		
		<span class="sidenote">See Tufte’s comment in the <a href="http://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0000Vt">Tufte book fonts</a> thread.</span>

*/

function sidenote(args, content){
	
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

		return `<div class=" ` 
				+ calcWidth(idx, cols) + isEnd(idx, cols) + ` `
				+ calcWidth(idx, ~~( cols / 2)) + isEnd(idx, ~~( cols / 2)) + `(medium)` + ` `
				+ calcWidth(idx, 2) + isEnd(idx, 2) + `(small)`
				+ ` ">` 
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
			return `<a href="`+link+`"><span class="image fit"><img href="`+url+`" src="` + url + `" alt="" /></span></a>`
		};

		function _plainImg(url){
			return `<span class="image fit"><img src="`+ url + `" alt="" /></span>`
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

hexo.extend.tag.register('sidenote', sidenote, {ends: true});