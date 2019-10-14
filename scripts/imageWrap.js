'use strict';
var assert = require('assert');

/*
	<!-- image wrap --> 
	<span class="image left"><img src="/img/pic06.jpg" alt="" /></span>
	{% imageWrap left /img/pic06.jpg %}

	<span class="image right"><img src="img/pic07.jpg" alt="" /></span>
	{% imageWrap right /img/pic07.jpg %}

*/

function imageWrap(args, content){
	// console.log(args);
	// console.log(content);

	const valid_alignments = ['left','right'];
	var data = {};
	
	data.align = args[0];
	data.imgUrl = args[1];

	assert.ok(valid_alignments.indexOf(data.align) > -1, "invalid alignment attempt with imageWrap. args found: " + args.toString() );
	return `<span class="image `+ data.align + `"><img src="` + data.imgUrl + `" alt="" /></span>`;
};

hexo.extend.tag.register('imageWrap', imageWrap, {ends: false});