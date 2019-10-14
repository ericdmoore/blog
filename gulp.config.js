exports.cachebust = {
	"main_css"  : (Math.floor(new Date() / 1000)).toString(),
	"js_bundle" : (Math.floor(new Date() / 1000)).toString()
};

exports.templ = {
	'js_bundle': '<%= name %>.<%= ext %>?v=<%= hash %>'
};

