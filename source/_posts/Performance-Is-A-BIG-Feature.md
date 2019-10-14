---
title: Performance Is A BIG Feature
subtitle: Easy to give lip service, hard to get it done
comments: true
toc: true
tags:
  - design
  - performance
  - product
categories:
  - business
cover_index: /images/optim-performace-tom-cruise-maverick.jpg
cover_detail: /images/performance-afterburner.jpg

---
Tom Cruise may be a little odd as a person. But can we all agree that Maverick is one of the best characters in movie history. One of the reasons he is cool is that he likes to go fast! Maverick may not be the best team player but he understands that speed has no compromises.

# Performance is hard

Have a "Maverick", a person refusing to fly with the flock, on your software team? Maybe you can make them the Tsar of "moving fast and breaking stuff" [^facebook] as long as their changes make the site got faster. Your site's performance has to checked, measured, monitored otherwise there is seldom sufficient reason to add this or that feature. 

Even when considered upfront, performance is a tough consideration for any system. Certainly once it is relegated to being an afterthought, systems are normally doomed, right from the starting blocks, to go slower than sloth speed.

Performance is a team sport - much like the Harvey Mackay adage:

> Everyone Is In Sales - Harvey Mackay <sup>[^6][⊙](#foot6)</sup>

The same would be true for performance, which, no surprise, is the number one "feature request" for web systems, for analytical systems, for any system really. 

> Everyone Shapes Performance - Eric D Moore <sup>[^7][⊙](#foot7)</sup>


Being reliably the fastest is a claim that any business would bolster.


## Performance for Analytics Systems

If you have ever used a less-than-modern analytics system, you are familiar with the "10 minute wait time" it takes to calculate the result of a query. This happens for a plethora of reasons. One of them is a poor understanding of the problem space and choosing components that are too narrow for the holistic needs of the business. One of them is a product architecture being asked to do more than originally designed to do - where key customers ask appropriately selected components to do things outside of their intended use case. All of these things can be rolled up into a lack of "performance is a big deal" culture.

Performance is a very hard thing to add on later "while the truck is rolling." Much like replacing an engine is much easier while the truck is parked vs - in production and barrelling down the highway with pistons firing at 200&#176; F.

Even when you do convince stakeholders a Corvette engine is needed, these are hard projects and require an incredible amount of proactive communication for the stakeholders to maintain their connection to "the problem" or need. Thus when you find yourself 1.5 yrs into the re-write and you realize it has been 4 months since the last material "touch-base", you're toast. No matter how hard the development team tries to convey progress, the submarined engineering has been away from the surface for too long and no attempt to show how close in fact you are to completion - trust has been lost. At that point, most management teams have already lost all hope in the dev team's ability to deliver. A smart team lead uses a "kudzu" plan to swarm and overrun the existing system - sadly, this too, is hard pull off.

Performance is clearly a challenge for analytical systems due to big data issues. You know you have big data when you have to develop custom systems to deal with the large volumes of data.

Many businesses are more content focused - and still, have performance issues.

## Performance for Content & E-Commerce Sites

Most content sites suffer from performance problems due to poor infrastructure. Often when the infrastructure is in place, it is just that the website is doing a ton - as compared to how what the site represents to the user. The main culprit for these types of systems is over-qualified images. 

Images that are larger than necessary, clearer than necessary, and not using some type of browser caching are the main reason for an e-commerce site, blog, or other content site feeling sluggish. Performance is the main difference between a professional operation and "yet-another-WordPress blog" that takes forever to load.

There are even a few projects that have codified a set of rules [YSlow](http://yslow.org/)<sup>[⊙](#foot1)</sup> that will grade your site. [GTmetrix.com](https://gtmetrix.com/)<sup>[⊙](#foot5)</sup> is a site that will also run those rules on any publically available URL all done from a browser.

CDNs are a great way to also speed up image delivery too - it tends to be a nice way to get images that must be large - to the user faster. 

Consider this very site you are reading:

- The site is served via a [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) which reduces the physical distance the information has to travel to get to your browser.
- The site is [minified](http://bit.ly/2ljO1wO) which removes characters that do not add to the user's experience.
- The site is [gzipped](https://en.wikipedia.org/wiki/Gzip) which minimizes file sizes sent over the internet which is especially useful for mobile phones.
- The images are scrutinized to ensure they are as good as needed but as small as possible without losing the required quality - again helping to ensure the site loads quickly. For more color, the following analysis will prove helpful.
- The site also uses [browser caching](https://en.wikipedia.org/wiki/Web_cache#Cache_control) to ensure things like logos, post images, and js files - are not unnecessarily downloaded.

Consider the following analysis performed on all the images used on this site (overall posts):

## Analysis This Site's Images

```python
%matplotlib inline
import pandas as pd
import os, glob
```

### Add file size of everything in the directory to an array


```python
ar_Images = []

for file in glob.glob('../source/images/*'):
    # Strip off file system prefix 
    ar_Images.append( {"fileName":file[50:],
                          "size_kB":os.path.getsize(file)/1000.0})
```

### Now for some DataFrame magic

```python
df = pd.DataFrame(ar_Images)
df.hist(bins=20)
```
    array([[<matplotlib.axes._subplots.AxesSubplot object at 0x1085a7588>]], dtype=object)

![png](/images/histogram_output_4_1.png)

```python
print(df[df.size_kB == df.size_kB.max()].fileName)
print(df.size_kB.max())
```
    71    HomeRun.jpg
    Name: fileName, dtype: object
    424.981

**References:**
[^1]: Lighthouse

	<ul><li><a id="foot3" href="//yslow.org/">Site:</a> YSlow.org</li><li><a id="foot4" href="//tools.pingdom.com/">Site:</a> Pingdom Website Tools</li><li><a id="foot5" href="https://gtmetrix.com/">Site:</a> GTMetrix.com</li><li><a id="foot1" href="http://briancaffey.github.io/2016/03/14/ipynb-with-jekyll.html">Article:</a> on how to include analysis in a blog post </a></li><li><a id="foot2" href="http://prooffreaderplus.blogspot.com/2014/11/how-to-quickly-turn-ipython-notebook.html">Article:</a> more on including analysis in a blog post</li><li><a id="foot6" href="http://www.harveymackay.com/sales-is-everyones-business/">Quote: Harvey Mackay</a> on sales as a team effort</li><li><a id="foot7" href="https://ericdmoore.com/2017/Performance-Is-A-BIG-Feature/index.html">Quote: Eric D Moore</a> on performance with a self reference footnote to seem believable</li></ul>
