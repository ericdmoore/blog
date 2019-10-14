//import 'https://polyfill.io/v2/polyfill.js?features=IntersectionObserver'

// import { $ } from "../js/from_cdns/jQuery_v3.3.1.js"
// import { skel } from "../js/from_cdns/skel_v3.0.1.js"
// import { skel_layout } from "../js/from_cdns/skel-layout_v3.0.1.js"

import { detect } 		from '../js/2.jquery.detect_swipe.min.js'
import { featherlight } from '../js/3.featherlight.min.js'
import { gallery } 		from '../js/4.featherlight.gallery.min.js'
import { util } from '../js/5.util.js'
import { main } from '../js/7.main.babel.js'

import {maincss} from  '../sass/main.scss'
import {fa} from  '../sass/font-awesome.min.css'


main.searchFunc('/search.xml', 'local-search-input', 'local-search-result');