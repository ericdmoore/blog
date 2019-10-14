/* 
- https://github.com/javve/list.js#demo--examples (9k⭐ on 7/26/2018)
- https://github.com/krisk/fuse (6.3k⭐ on 7/26/2018)
- https://github.com/olivernn/lunr.js (5.3k⭐ on 7/26/2018)
- https://github.com/algolia/instantsearch.js (2k⭐ on 7/26/2018)
- https://github.com/farzher/fuzzysort (1.7k⭐ on 7/26/2018)
- https://github.com/bevacqua/horsey (1k⭐ on 7/26/2018)
- https://github.com/Glench/fuzzyset.js (0.8k⭐ on 7/26/2018)
- https://github.com/mattyork/fuzzy (0.5k⭐ on 7/26/2018)
- https://github.com/atom/fuzzaldrin/ (251⭐ on 7/26/2018)
- https://github.com/jakealbaugh/fuzzy-search (61⭐ on 7/26/2018)
- https://github.com/bripkens/fuzzy.js (44 ⭐ on 7/26/2018)
- https://github.com/unlooped/FuzzySearchJS (21⭐ on 7/26/2018)
- https://github.com/keypressio/fuzzysearch.js (5⭐ on 7/26/2018)

- https://github.com/weixsong/elasticlunr.js (.9k⭐ on 7/27/2018)
*/


/** ## Grading
 * 1. Performance
 * 2. Documentation
 * 3. Flexibility/Extendibility
 * 4. Relevace Score
 */

/**  ## Relevance Tests:
 * Using Top Mis-spelled words published online 
 *  @see: https://www.usnews.com/news/national-news/articles/2017-05-31/google-highlights-each-states-most-commonly-misspelled-word
 *  @see: https://en.oxforddictionaries.com/spelling/common-misspellings
 */

/** ## Console Setup 
 * ### add benchmark code
 * > npm init && npm i fuse.js fuzzaldrin fuzzy  fuzzy.js fuzzyset.js fuzzysort fuzzysearch-js horsey list.js lunr  -D
 * 
 * ### Then add benchmark code
 * > npm i glob-fs -S
 * 
*/

const fs = require('fs')
    , path = require('path')
    , glob = require("glob")
    , fsize = require('filesize')
    // , miss = require("mississippi")
    , lunr = require('lunr')
    // , fuse = require('fuse.js')
    // , fuzzaldrin = require('fuzzaldrin')
    // , fuzzy = require('fuzzy')
    // , fuzzyjs = require('fuzzy.js')
    // , fuzzysearch = require('fuzzysearch')
    // , horsey = require('horsey') // seems to be browser only due to reliance on `document`
    // , fuzzysort = require('fuzzysort')
    // , fuzzyset = require('fuzzyset.js')
    // , listjs = require('list.js') // seems to be browser only due to reliance on `document`
     ;

// [Lunr](https://github.com/olivernn/lunr.js)
async function build_lunr(data){
    
    return new Promise((resolve, reject)=>{
        let idx = lunr( function(er){
            this.ref('id')
            this.field('title')
            this.field('body')
            this.add({
                "id": "1",
                "title": "Twelfth-Night",
                "body": "If music be the food of love, play on: Give me excess of it…",
                "author": "William Shakespeare"
            })
            if (er) reject(er);
        });
        resolve(idx); 
    })
};

function query_lunr(lunr_data, query){
    return lunr_data.search(query);
};

async function test_lunr(data, lunr_data, query){
    // temporary testing
    idx = await build_lunr(data)
        .catch( err => {
            console.error(err); 
            return new Error('found error in `test_lunr`')
        })
    console.log(idx);
    return true; // lunr_data.search(query);
};

// [Lunr](https://github.com/olivernn/lunr.js)
/**
 * Thoughts:
 *  Can save off/load in a preformatted cached index & corpus.
 *     var idx = lunr.Index.load(json)
 *     var results = idx.search(`q`)
 */
async function test_Ntimes_lunr(nTimes, data, opts){
    let n = nTimes;

    if(test_lunr(data)) console.log("Whoo Hoooo!")
    // build the idx once 

    // query many times 
    // while(n-- > 0){
        // 
    // }
    // for(let i=0; i<NTimes; i++){
        // console.log(data[i]);
    // }
    // data.forEach((v,i,a)=>{
        // console.log(v);
    // })
    return true;
}
// [Fuse](https://github.com/krisk/fuse)
async function test_Ntimes_fuse(nTimes, data, opts){
    return true;
};
// [Fuzzy](https://github.com/mattyork/fuzzy)
async function test_Ntimes_fuzzy(nTimes, data, opts){
    return true;
};
// [Fuzzy.JS](https://github.com/bripkens/fuzzy.js)
async function test_Ntimes_fuzzyJS(nTimes, data, opts){
    return true;
};
// [FuzzySort](https://github.com/farzher/fuzzysort)
async function test_Ntimes_fuzzysort(nTimes, data, opts){
    return true;
};
// [FuzzySet](https://github.com/Glench/fuzzyset.js)
async function test_Ntimes_fuzzyset(nTimes, data, opts){
    return true;
};
// [Horsey](https://github.com/bevacqua/horsey)
async function test_Ntimes_horsey(nTimes, data, opts){
    return true;
};
// [Fuzz Aldrin](https://github.com/atom/fuzzaldrin)
async function test_Ntimes_fuzzAldrin(nTimes, data, opts){
    return true;
};
// [Fuzzy-Search](https://github.com/jakealbaugh/fuzzy-search)
async function test_Ntimes_fuzzy_search(nTimes, data, opts){
    return true;
};
// [FuzzySearchJS](https://github.com/unlooped/FuzzySearchJS)
async function test_Ntimes_fuzzySearchJS(nTimes, data, opts){
    return true;
};
// [FuzzySearch.js](https://github.com/keypressio/fuzzysearch.js)
async function test_Ntimes_fuzzySearch_js(nTimes, data, opts){
    return true;
};

// HERE IS the Main ENTRY point
(async (opts)=>{
    /** 
     *  ## Setup Helpers for main IIFE
     */
    async function glop(input, opts = {}){
        return new Promise((resolve,reject)=>{
            glob(input, opts, function (er, files) {
                if(er) reject(er);
                else resolve(files);
              })
        })
    };


    /** 
     *  ## Parse Options
    */
   console.log(opts);
   let data = [];
   if(opts.inputPath){
        const datadir = path.resolve(opts.inputPath);
        const fileList = await glop(datadir+"/**/*.md");
        const totalSize = fileList.reduce((a,v,i)=>{
            return a + fs.lstatSync(v).size
        }, 0);
        data = fileList.map((file,i,a)=>{
            return { file , contents: fs.readFileSync(file).toString()}
        });
        // console.log({datadir})
        // console.log(fileList);
        console.log(fileList.length);
        console.log(fsize(totalSize));

    } else {
        const _default = "./fixtures/test.json";
        const datadir = path.resolve(_default);
        const fileList = await glop(datadir);
        data = fileList.map((file,i,a)=>{
            return { file , contents: fs.readFileSync(file).toString()}
        });
        // console.log({datadir})
        // console.log(fileList);
        console.log(fileList.length);
        console.log(fsize(totalSize));
    }

    /** 
     *  ## Setup Data will use either: 
     *  1) an inline literal dataset
     *  2) assortment of md documents found on github
     */
    console.log(`> Data Preview: `);
    data.slice(0,2).forEach((v,i,a)=>{
        console.log(`\n\n${v.file} \n\nwith data::\n\n${v.contents.slice(0, 100)}`)
    })

    // start and wait forEach test run
    let finished = false;
    let libOpts = {}
    const NTimes = 1000;

    /** 
     *  ## Run Each Lib Numerous times
     */
    
    // start and wait for each to ensure CPU is on level playingfield for each run.
    finished = await test_Ntimes_lunr(NTimes, data, {dataLabel:"lunr"});
    finished = await test_Ntimes_fuse(NTimes, data, {dataLabel:"fuse"});
    finished = await test_Ntimes_fuzzy(NTimes, data, {dataLabel:"fuzzy"});
    finished = await test_Ntimes_fuzzyJS(NTimes, data, {dataLabel:"fuzzyJS"});
    finished = await test_Ntimes_fuzzysort(NTimes, data, {dataLabel:"fuzzysort"});
    finished = await test_Ntimes_fuzzyset(NTimes, data, {dataLabel:"fuzzyset"});
    finished = await test_Ntimes_horsey(NTimes, data, {dataLabel:"horsey"});
    finished = await test_Ntimes_fuzzAldrin(NTimes, data, libOpts);
    finished = await test_Ntimes_fuzzy_search(NTimes, data, libOpts);
    finished = await test_Ntimes_fuzzySearchJS(NTimes, data, libOpts);
    finished = await test_Ntimes_fuzzySearch_js(NTimes, data, libOpts);
    
    // ToDo::
    //
    // requires credentials... will do later
    // [InstantSearch](https://github.com/algolia/instantsearch.js)
    // finished = await test_Ntimes_instantsearch(NTimes, opts);    
    //
    // needs better documentation/examples for fuzzy search
    // [List.JS](https://github.com/javve/list.js)
    // finished = await test_Ntimes_list(NTimes, opts);

// consider setting the input params of the jsIIFE based on CLI inputs?
})({n:100, inputPath:"../../../../../Jupyter/training-set" });



/** ## Next Comes Processing and Analysis
 * Then run: 
 * $> pip install pandas jupyter etc...
 * $> jupyter notebook
 *  
 * or use termgraph by doing this...
 * 
 */