---
categories:
- business
comments: false
cover_detail: /images/Ft-Myers-Beach.jpg
cover_index: /images/moving_boxes_truck.jpg
date: 2017-03-17 11:05:09
description: description - lorem ipsum
subtitle: Using Hexo for now
tags:
- status.quo
- free.internet
- open.internet
- cms
- performance
- JAMStack
- static
- new.ways
title: Moving your site away from the status quo
toc: true
---

# Moving to Happy Place

For me moving to a happy place is going to be very near the ocean.
The first step is that you have to recognize the status quo is really not that great see rant _here_ and _here_.

{% imageGrid cols=4 %}
//via.placeholder.com/350.jpg/dddddd/333333
//via.placeholder.com/350.jpg/333333/dddddd
//via.placeholder.com/350.jpg/dddddd/333333
//via.placeholder.com/350.jpg/333333/dddddd
{% endimageGrid %}

# Loving Your Readers
If you write things down on the internet chances are you are doing it on some type of CMS ( and I use that word loosely).

Went to [LaunchBuildYourStartup.com](https://launchbys.com/) and the page took forever to load. I thingk I spent 2 seconds watching the above fold image load - and did not stay long enough to let it finish.
(If you are with LaunchBYS find me on twitter - I know people who can help your website give your readers hugs)

# Exiting CMS Options

`Blogger` for those who want to create great content - rigid but easy.

`Medium` for those who have a lot of thoughtful things to say

`Wordpress` because it is the 900 lbs gorilla in the room - and it has grown to be the defacto standard - which I used to think was great.

`Hexo` & `Hugo` have traditionally been used by mainly developer/hacker types who are incredible spend thrifts. `Hexo` has some nice plugins - which are coming soon to Hugo.

# Stopping Old Habbits

I can remember the first time it hit me: In order to care about my readers I should not only write better (work in progress) or at least build the site that got readers to my mediocre writing sooner.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Ow0lr63y4Mw" frameborder="0" allowfullscreen></iframe>

</br>
</br>
## Choosing Hexo (for now)

Why I chose Hexo....

# Getting Started

## Basics

### Process Review
1. Setup your AWS Account (more details below)
	2. Create your S3 Bcuket
	3. Configure your S3 Bucket
	4. Get an IAM user Key/Secret
1. Setup software on your laptop (more details below)
	2. Hexo
	3. Gulp
2. Build your site on your laptop (more details below)
1. Publish your site to your AWS Account (more details below)

### Setup AWS Account

1. Setup an AWS account (different than an Amazon.com account) 

### Setup Software
1. Open up Terminal and paste in 
	- `npm install hexo-cli -g`
	- and then also `npm install gulp-cli -g`
1. Go to what folder where you want to put your new blog
	- `hexo init blog && cd blog`
	- and then also `npm install gulp -D && touch gulpfile.js`
1. Then start your new blog by:
	- `npm install && hexo server`

### Build Site & View in Browser

### Publish Site

## Optional (but recommended)

### Update your Domain

### Ensure your IAM user only has XYZ

## Advanced 

#### Advanced Options
1. Create a Cloudftont Ditribution
	2. Configure your Cloudfront Distribution
3. Advanced S3 Bucket Configuration
	4. Versioning + Cross Region Replciation
5. Edit the gulp file
6. Download Hugo and try it too

**References:**

- hexo.io
- hugo.io
- wordpress.com
- Blogger.com
- Medium.com
- headless.com
- JAMStack.org
- google.com