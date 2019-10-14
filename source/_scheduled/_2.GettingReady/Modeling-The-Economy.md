---
categories:
- business
comments: false
cover_detail: //via.placeholder.com/1000x450.jpg/dddddd/333333
cover_index: /images/economy-skyline.jpg
date: 2017-06-21 09:51:06
description: description - lorem ipsum
subtitle: A Deep Dive into Econometrics
tags:
- economics
- models
- analytics
title: Modeling The Economy
toc: true
---

{% imageGrid cols=4 %}
//via.placeholder.com/350.jpg/dddddd/333333
//via.placeholder.com/350.jpg/333333/dddddd
//via.placeholder.com/350.jpg/dddddd/333333
//via.placeholder.com/350.jpg/333333/dddddd
{% endimageGrid %}

**NERD ALERT:**
- https://www.youtube.com/watch?v=KkKBwJkYgVk&list=PLP8iPy9hna6SQPwZUDtAM59-wPzCPyD_S&index=2
- http://www.tomsargent.com/
- https://en.wikipedia.org/wiki/Karush%E2%80%93Kuhn%E2%80%93Tucker_conditions
- 

**WHY MODEL THE ECONOMY????**

1. In this case it is not to figure out what equity to short...it is so that we, as a people, as a scoiety, don't have to live through objectively governmental policy choices.
1. We can peer into the looking glass and say - yeah that does not play out well.
2. Of course if we model the economy "pretty good" - aka create a decent crystal ball - then of course industrius individuals easily profit with sufficiently good crystal balls.

Take the Example of:

- **Argentina**
	- People
	- Resources
	- Rules
- **Australia**
	- People
	- Resources
	- Rules

But with very different macro economic outcomes...

**Economic Primatives:**

- People
	- Purpose
	- Belief
	- Constraints
- Governments
	- (Collection of People)
	- with Power to: 
		- tax
		- spend
		- borrow
		- redistribute
- Technologies
	- produce goods
	- produce services
	- produce physical capital
	- produce human capital
- Processes
	- Describes Information Flow
	- Describes Economic Shocks
- Equilbs
	- Describe Markets, Rules, Regs, reconcile people diverse purpose and possibilities


Principal Agent Problems - but the economy is a multi-agent problem

`The goverment has strategies and the people have counter-strategies` - Chinese Proverb 1000 BC


`decision(t, forecast(t, beliefs))`

To model the economiy 
You are modeling things - that themselves have models.

What is a model?
A PDF over a seqence - A Stochastic Process that is indexed by some params

Communism of Models - everyone has the same model - conditioned with different information

Can't fool all the people all the time. - Abe Lincoln

Thoughts about the future influence the actions today

Given past, the present and future are simultaneous determined

Two Main Polar-Opposed Models:

- model of "bank runs"
- model of "moral hazard" (aka bailing out banks)

Joint Density
- aka stochastic process
- observe data - infer params

Models beat model 

Our Goal Should be: No Camps (Chicago vs Cambridge vs etc)

- Direct Problem: theta ==> Joint Density
- Inverse Problem: One slice of joint densities ==> theta (Max Likeli or Bayesian)

Markov Process - finding the state is an art
	Sequential Inference: 
		- Abrahams Wald's sequential probabilty ratio
		- Dynamic Programming - Richard Bellman
	Filtering and Smoothing:
		- Kalman fitlering
		- Nonlinear Filtering

Bellman Equation
- Maximizer Eq
- let v(x)

The Economy is a bellman equation with a government (with policies) + a vector of agents. (aka a multi agent problem) + tech + process.

Each agent is a bellman equation where they are influenced by the government.

```
Simulation
	Timeline
	Technologies,
	Process,
	Government(
		[Policies
			Tax,
			Spend,
			Borrow,
			Redistribute
		]
	[Agents
		Constraints,
		Purpose,
		[Beliefs
			Past Experience
			Values
				Risk
				Greed
				
		], N=lots
	]


MonteSim
	[Simulation(IC)]
	Halt Conditions: iterations, fulfilled condition, 

GenSim
	Simulation t+n  = Simulation((t,n), IC)

MonteGenSim
	[Simulation t+n  = Simulation((t,n), IC)]
	
```
**What is the processing model for the sim?**

How to scale horizontal?
Process per simulation?
Thread per simulation?

What if our simuluations moved towards:

- 1000 sims
- 5 yr long
- popN = 330Mppl

- Can we fit it into am AWS Lambda func execution model?
	- λ MetaSimulate = ƒ(*s3://config.json*)
	- λ MetaSimulate = ƒ(vecSims)
	- λ Simulate = ƒ( right-sized coro on agent size)
	- λ Simulate = ƒ(*s3://config.json*)
	- λ SizedSimulate = ƒ(*s3://config.json*)
	- λ SizedSimulate = ƒ(runfor, environmentIC₀, vecAgents₀, govt₀, tech₀, process₀)

**How Will I interogate the results?**

- Time series: 
	- events happening within a sim
	- fs:// {{SimName}}/{{SimID}}/{{event}}.jsonl
	- s3:// {{SimName}}/{{SimID}}/{{event}}.jsonl
	- animated gif from plots of each metrics as time cycles through

**Need I simulate:**

- Timeline Resolution in:
	- days
	- Suppose it depeneds on resolution of predictions. 
	- 2, 4, 8, 10, 20, 50, 100 yr out predictions. (max 3650 step run)

Various Distributions:
- Democrats vs Republicans
- Types of Work (small cal, mid cap, large cap)

For People:
- Purpose
	- is this the maximizer function?
		- max dollars?
		- max happiness?
- Age Spread as of 2017
- Family and Reproduction 
	- aka: Population growth over time
- Communal Cohesion Coeffcient 
	- Spread of Ideas
- Acts of Crime and Justice (population inactive and cost)
	- or call it ethics - the continuous vs the discrete
- Personal Traits
	- Goal Orientation
	- Listening
	- Self-Aware
	- Confidence
	- Discipline
	- Adaptive
	- Integrity
	- Communication
		- Articulate (Convicingness)
	- Integrity
		- Trustworthy
		- Trusting
	- Productive
	- Courage
	- Articulate
	- Balanced
	- Collaborative
	- Committed
	- Courageous
	- Decisive
	- Detail-Oriented
	- Emotionally Competent
	- Friendly
	- Hard Working
	- Humorous
	- Intelligent
	- Organized
	- Prepared
	- Productive
	- Relationship-Oriented
	- Responsible
	- Sincere
	- Self-Sacrificing
	- Trustworthy
	- =================
	- Convincingness
	- Openness
	- Conscientiousness
	- Agreeableness
	- Neuroticism
	- MBTI x16 combinations
		- Extraversion / Introversion
		- Judging / Perceiving
		- Sensing / Intuition
		- Thinking / Feeling
- Cultural Beliefs
	- would just be the aggregate feelings of the population