---
title: Complex vs Complicated
subtitle: The difference is tricky but worth learning 
comments: true
cover_detail: /images/rube-goldberg.jpg
cover_index: /images/complicated@450x450.jpg
tags:
- strategy
- process
- data
- management
categories:
- business
toc: true
---

# Introduction

Leave it to the English to have the most words of any language, but to give us words that still leave us scratching our heads on when to use each. This would be the case when it comes to "tough to manage" systems. We have words for these tough system, but few people know the difference between "Complex and Complicated". We don't need more words - we need different words. 

The words we have feel too similar and thus the nuance they attempt to explain are lost in the wash. Each word is trying to assess different things, but since the context is not distinct enough they continued to be used interchangeably.

Complicated has to do with difficulty. 
Complexity has to do with reproducibility or predictability.
The distinction is significant and worthwhile for organizations looking to use Machine Learning or Adaptive Systems.


Alternative Definitions:
Simple = easily knowable.
Complicated = not simple, but still knowable.
Complex = not fully knowable, but reasonably predictable.
Chaotic = neither knowable nor predictable.

Said differently:

Complicated generally means a high degree of _____ but given a set of inputs you can follow the intended behavior and have good certainty about what a system will do.

Complex means that there is often a similarly high degree of _____ but given a set of inputs, the outcome is intrinsically unknowable. If a system evolves based on its past history - and potentially working in conjunction with other systems that carry an evolving nature with them - their singular outputs are complex and then certainly their joint outputs even more complex.

Complex = systems made up of decentralized agent parts that have individualized objectives but have an emergent behavior

Dealing with complexity is about adapting, reacting, dealing with conflict, continual improvement
Using policies conceived in complicated environments - are fatally flawed when confronted with the organic and evolving nature of a complex system.


Stack Overflow will not solve this because the general population is equally confused.

To illustrate the differences, some examples.

**Simple problems**, such as following a recipe or set of instructions, may encompass basic issues of technique and terminology, but once these are mastered, following the 'recipe' carries with it a very high assurance of success.

**Complicated problems** (like sending a rocket to the moon), are different.  Their complicated nature is often related not only to the scale of the problem but also to their increased requirements around coordination or specialized expertise. However, rockets are similar to each other and because of this following one success, there can be a relatively high degree of certainty of outcome repetition. 

A traditional web app, for example, can be very complicated. It has web servers, data stores, CDNs, caches, asset build processes, deployment processes, source control systems, and more. At any point in time, any component in that list may be "totally busted" and causing the whole thing to crash. Or consider older applications with external consumers that tend to have "legacy" components (translation: parts that no one wants to touch - and if forced to do so - will complain endlessly about how bad it is and how dangerous changes are to this area of the system). Each version of the application has an interface that was let lose to paying customers and, for example, this application had the fatal problem of "successful" customer on each versioned interface.

This application starts to become very heavy and improvements to the current version may have negative impacts for an older version. Nonetheless, with significant engineering work and process controls - this system can grow with reproducibly positive changes.

In contrast **complex systems** are based on relationships, and their properties of self-organisation, interconnections, and evolution. Research into complex systems demonstrates that they cannot be understood solely by simple or complicated approaches to evidence, policy, planning, and management. Consider complex systems like raising a child. Formulaic approaches have limited application.  

Raising one child provides experience but no assurance of success with the next. Expertise can contribute but is neither necessary nor sufficient to assure success.  Every child is unique and must be understood as an individual. A number of interventions can be expected to fail as a matter of course.  The uncertainty of the outcome remains. The most useful solutions usually emerge from discussions within the wider family and involve values.

With a technology-based example, consider a recommendation engine. It has application logic, CDN for assets, datastore, etc - basically all the same stuff as the web app. However, once you program the recommendation engine you actually can not guarantee that it will recommend the same thing twice, assuming the dataset is evolving over time. So what does it mean to get the "expected outcome"? What was the expected outcome? Consider the fact that it was not created with an expected outcome. It was created to pattern match. Watch what people tend to look at next - and over time recommend that pattern to other people. What if your first few people moving through the content were weirdos? Now you recommendation engine seems very bad. This is complexity. <sup>[1](#myfootnote1)</sup>

## Misconceptions

How to deal with different systems/organizations
- Top Down Planning vs Changing Objective Functions

### Misconception: Complicated is Complex

If you were to plot complicated on the Y-axis and complexity on the other axis you can have two different systems at the top left, and bottom right. These two words are at least conceptually unrelated. But this fact is easy to overlook when you are knee-deep in the thick of hard engineering problems to put a rocket on the moon. To relate it back to the prior idea, if the recipe has some parts that are not precise enough - it matters greatly "who does the pinch of salt". That part leads to uncertain reproducibility. This often happens when a company is producing product at a rate that exceeds the organization's ability to understand the interdependencies.

Rephrased the question is: As things get more complicated - do they tend to get more complex? Answer: It depends on the rate an organization uses shortcuts that introduce wiggle room which often fails to constrain a process to give an expected outcome. So if you feel like the answer is yes, you have just learned that your teams tend to cut enough corners to add wiggle room in each engineered joint. Consider a wiggly table with many sugar packets under one of the table legs. This table feels like it does not always help us stand on it to change light bulbs - aka it seems complex, but really it's only due to imprecision added during creation.

### Misconception: Being Complex is Bad

It is true that sometimes you have a complex system needlessly. In this regard, complexity should be managed through a process that allows more than one person to weigh in on if the newly incurred complexity has benefits that outpace the cost of living with the new complexity. Complexity is generally the last aspect of how to create an engaging system. 

Engaging products tend to be very personalized. Personalization can mean the developers of know all the options at the start, and shove each user down a pre-created option. Or the other option is to say I have a user where we know they have bought these things, have this in the cart, and have rated these other products highly... let's carve out a place for something to guess the best thing for that person to consider next. The second option requires a completely different culture to pull off. 

<!-- ## Common Misunderstandings

This is going to be a list. A Top 10 list of misunderstandings

### Top 10 List

1. Number 1
2. Number Two
3. Number Three
4. Number Four
1. Number Five
1. Number Six
2. Number Seven
3. Number Eight
4. Number Nine
5. Number Ten

### Other Thingy

asdadsasdasd
asdasd
asd


# Complex

So what is complexity?

Anything sufficiently large tends to have multiple required tasks to be accomplished in a workflow. Complexity is about managing all the moving parts. Managing the workflow and the interfaces between each component. There is a substantial effort to manage the necessary complexity.


# Complicated

Lots of moving parts.

# Closing

So Why do I care? Are we just wordsmithing?

Answer: it depends on your industry 
-->


<!-- 

Enterprise Architecutre

Hexagonal Architecture

in-Feeds
Out-Feeds
Admin Inteface
Metrics Interface

: Outer Edge - Integration Tech
: Interior Business Logic - What to do when a customer debits more than their account holds
: Facilitate Serendipity/Discoverability/Open Nature/
	: Authors / Team Blog / CI Server / Release Notes / Wiki


Dunbar Number ~ 150
Fitness Landscape 
	- Rewards are dolled to thriving things
	- Doing well - Gets to do more
	- It is not engineers and compensation; instead it is solutions and markets

-->

**References:**

- <a id="myfootnote1">1</a>: [Article](https://www.linkedin.com/pulse/complicated-complex-knowing-difference-important-will-allen) on LinkedIn by Eric Chivalier 
- <a id="myfootnote2">2</a>: [Post](http://noop.nl/2008/08/simple-vs-complicated-vs-complex-vs-chaotic.html) on Google+ by Somebody Else
- <a id="myfootnote3">3</a>: [Tweet](http://www.businessofgovernment.org/article/managing-complicated-vs-complex) by Joan of Arc
- <a id="myfootnote4">4</a>: [Article](http://www.dailywritingtips.com/complex-and-complicated/q) on Yahoo by Samuel Trask
- <a id="myfootnote5">5</a>: [Article](http://noop.nl/2010/09/simplicity-a-new-model.html)
- <a id="myfootnote6">6</a>: [Document](http://www.outcomemapping.ca/resource/complexity-a-conversation-with-brenda-zimmerman#inline_en) "Complexity, a conversation with Brenda Zimmerman" by Ricardo Wilson-Grau
- <a id="myfootnote7">7</a>: [Post](http://www.beyondintractability.org/moos/complex-vs-complicated) on beyondintractability.org
- <a id="myfootnote8">8</a>: [Post](http://learningforsustainability.net/post/complicated-complex/) on learningforsustainability.net
- <a id="myfootnote9">9</a>: [Post](https://larrycuban.wordpress.com/2010/06/08/the-difference-between-complicated-and-complex-matters/) on larrycuban.wordpress.com
- <a id="infoq">10</a>: [Post](https://www.infoq.com/presentations/Architecture-Without-an-End-State) InfoQ - One person can not know the ramifications of a decision