'use strict';
var assert = require('assert');

/*	
	INPUT in POST.md
	{% shareBlock twitter facebook linkedin sms email%}

	OUTPUT:
	<!-- ShareBlock -->
	<h3>Share:</h3>
	<div style="display:flex; 
		flex-flow: row;
		justify-content: space-around;">
		<ul class="icons">
			<li>
				<a rel="noopener" 
				   href="https://twitter.com/intent/tweet" 
				   class="icon style2">
				   <i class="fab fa-twitter"></i>
				   <span class="label">Twitter</span>
			   </a>
		   	</li>
			<li><a rel="noopener" 
					href="https://www.facebook.com/sharer.php?u=http%3A%2F%2Ffirstround.com%2Freview%2Four-6-must-reads-for-building-and-leading-a-product-design-team%2F%3Futm_content%3DShareEntry-top%26utm_source%3Dfacebook%26utm_medium%3Dsocial%23rt_u%3D1485280397_1RvMks" 
					class="icon style2">
					<i class="fab fa-facebook"></i>
					<span class="label">Facebook</span>
				</a>
			</li>
			<!-- <li><a rel="noopener" 
				   href="#" class="icon style2">
				   <i class="fab fa-linkedin"></i>
				   <span class="label">LinkedIn</span>
			   	</a>
			</li> -->
			<li>
				<a 	href="mailto:?subject=Check%20It%20Out&body=I%20thought%20you%20might%20like%20this%20link.%20Check%20it%20out.%20https://ericdmoore.com/2017/Music-Monday-LCD-Soundsystem-for-Your-Bones" 
					class="icon style2">
					<i class="far fa-envelope-open"></i>
					<span class="label">Email</span>
				</a></li>
			<li>
				<a  href="sms:&body=I%20thought%20you%20might%20like%20this%20link.%20Check%20it%20out.%20https://ericdmoore.com/2017/Music-Monday-LCD-Soundsystem-for-Your-Bones" 
					class="icon style2">
				<i class="fas fa-comment"></i>
				<span class="label">SMS</span>
				</a>
			</li>
		</ul>
	</div>
*/

function shareBlock(args, content){
	// console.log(args);
	// console.log(content);

	const valid_alignments = ['left','right'];
	var data = {};
	
	data.align = args[0];
	data.imgUrl = args[1];

	assert.ok(valid_alignments.indexOf(data.align) > -1, "invalid alignment attempt with imageWrap. args found: " + args.toString() );
	return `<span class="image `+ data.align + `"><img src="` + data.imgUrl + `" alt="" /></span>`;
};

hexo.extend.tag.register('shareBlock', shareBlock, {ends: false});

