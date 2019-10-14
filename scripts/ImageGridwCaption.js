'use strict';
/*	

Input Example1:
{% imageGridwCaption path=/images/2017-favorite-books-log/log/ rows=3 %}
{% endimageGridwCaption %}

Input Example1:

{% imageGridwCaption cols=3 inline=top srcpath=/images/2017-favorite-books-log/log/ %}
![Sidney Poitier](/img/pic03.jpg){caption:"this is a caption"} => "//encrypted.googoe.com"
![Sidney Poitier](/img/pic03.jpg){caption:""} 				   => "//encrypted.googoe.com"
![Sidney Poitier](/img/pic03.jpg){caption:"this comes after an image with no cpation"} => "//encrypted.googoe.com"
![Sidney Poitier](/img/pic03.jpg){caption:"caption4"} 		   => "//encrypted.googoe.com"
{% endimageGridwCaption %}

Explanation:
1. imageGridwCaption component will process all images in the path listed as though they were listed inline
2. THEN, the compoent will append the inline images at the top|bottom depending on the config
	2a. `inline` defaults to `top`
3. The images processed from the folder will not given a caption.
4. `rows` or `columns` can be specified
	4b. rows/cols defaults to cols=4


Output:

<!-- image grid --> 
<div class="box alt">
<div class="row 50% uniform">	
	<div class="4u">
		<span class="image fit">
			<img src="/img/pic03.jpg" alt="" /></span></div>
			<caption> 
	<div class="4u">
		<span class="image fit">
			<img src="/img/pic04.jpg" alt="" /></span></div>
	<div class="4u$">
		<span class="image fit">
			<img src="'img/pic05.jpg" alt="" /></span></div>
	<div class="4u">
		<span class="image fit">
			<img src="/img/pic04.jpg" alt="" /></span></div>
	<div class="4u">
		<span class="image fit">
			<img src="/img/pic05.jpg" alt="" /></span></div>
	<div class="4u$">
		<span class="image fit">
			<img src="/img/pic03.jpg" alt="" /></span></div>
	<div class="4u">
		<span class="image fit">
			<img src="/img/pic05.jpg" alt="" /></span></div>
	<div class="4u">
		<span class="image fit">
			<img src="/img/pic03.jpg" alt="" /></span></div>
	<div class="4u$">
		<span class="image fit">
			<img src="/img/pic04.jpg" alt="" /></span></div>
</div>

*/

function imageGridwCaption(args, content){
	
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

hexo.extend.tag.register('imageGridwCaption', imageGridwCaption, {ends: true});