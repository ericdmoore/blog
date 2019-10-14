---
title: The Fundamentals of Requirements
subtitle: Turns out, articulating a product is incredibly hard
comments: true
toc: true
featured: true
tags:
  - process
  - requirements
  - pragmatic
categories:
- business
cover_index: /images/optim-reqs-want-need-balance.jpg
cover_detail: /images/paperwork-wide.jpg
description: Documentation for its own sake will drive everyone mad!
---

For anyone who has worked in a fast-paced environment where people are self-motivated, and things are getting deployed at an almost uncontrolled pace, the only thing that stabilizes the uncertain conditions of dev teams moving fast is a great set of plans and documentation about what we should build - generally called requirements.

Some organizations view these requirements as slow, outdated, and process-laden - and while sometimes that is an earned reputation - it does not have to be that way. You can, in fact, have your cake AND eat it too. Documentation is not the enemy. Processes that prescribe 

<!-- more --> 

# Attributes of Solid Requirements

A good requirement conveys the context of a problem. It articulates the bar of what we should build to solve a user's problem or to achieve a buyers requirement to the development team 

There are a few ways to evaluate your requirement before you get it in front of a team of designers. 
One method is SMART, which stands for:

**Specific.** Requirements should specify what a user intends to achieve.
**Measurable.** The requirements should provide a metric whereby all stakeholders can determine if the objectives are being met.
**Achievable.** Are the requirements' objectives achievable?
**Realistic.** Are the requirements realistic given the available resources?
**Time-Bound.** When does the team need to achieve the objectives from the requirement?

Writing good requirements conveys critical information in a form that developers and designers can embrace; just enough detail to give context without too much detail that overwhelms the reader. A well-written requirement helps the designer make judgment calls without turning to the product manager continually throughout the day. Ask yourself: When an implementation question arises, have I provided adequate context? Can the designer imagine the appropriate solution? And for that matter, ask your team: “Have I communicated clearly?”

# Perfecting Requirements
The "story approach" to writing requirements often works to everyone’s advantage. There are many formats and definitions for stories. Some call them use cases; others call them user stories. A nice balance is struck yet a different format called a "Use Scenario".

Use Scenarios follow the following format:
[Persona] has [problem] with [frequency]

- Notice there is no prescription of "what" to build.
- Notice there is no specification what characteristics the system must have.
- Those are still needed but "Use Scenarios" are based on the concept that a well-defined problem will allow for more iteration and collaboration on the solutions.

For example: 

  Sarah the college student needs to pay her tuition each semester using multiple credit cards.

**Sarah** is the persona
**pay tuition** is the problem
**each semester** reveals the frequency of the problem. 

Notice this problem statement is absent a proposed solution; that takes place in a collaborative discussion after the problem has been articulated - where interaction designers, system designers, and experience designers are present to really whittle down what viable solutions might look like.

Stories are powerful. You put the designer in the customer’s chair, seeing the problem from the customer’s point of view. Use scenarios explain to designer and developers why we need a solution - and to what problem. Use Scenarios illustrate how the problem occurs; it puts the problem in its context. The tone is "imagine if you will," so the design of a solution can weigh in on the viability from the user perspective. When questions arise about an implementation choice, the team should find the answer in the use scenario. Also, provide requirements and use scenarios to QA for their test plans. The ideal test plan ensures that the problem was resolved, not that the design was achieved.

Nothing can replace face to face understanding of the users - however flying developers and designers half way across the planet to meet some of these users is not feasible. Thus the persona documentation acts as the scalable way to impart to the designers and developers that they are not developing a system for themselves. Provide phone numbers and email addresses for a few potential users of who can be reached by the designers and developer when clarification 

## Personas
- Who is the typical user?
- What attributes do they have that allow us to understand that our internal people are not that?
- What is the persona doing to have or cause the problem?
- How does the persona do it now?
- How might the persona like to do it?

# Artifacts for Requirements

With detailed documents like personas and their problems, how should this be summarized and communicated to the rest of the business?
A collection of summary documents that fit the information detail needed for the situation and more importantly for the maturity of the organization. These documents are denser than a “cocktail napkin” but likely should not textbook tomes. 

They are:
- The Business Plan
- The Product roadmap
- The Requirements

## Business Plan 

The business plan includes information about the business of the product. It is typically updated annually to compare last year’s goals to the actuals.

A great business plan includes:
- Primary research on the market problems
- Secondary research on the market problems
- Compiled win/loss analysis
- Market definition and sizing
- Distribution strategy
- Distinctive competence
- Financial plan

## Roadmap

Product roadmaps have become the most popular artifact for representing product strategy. A roadmap shows phases of deliverables over the next 18-36 months or through the next three or four product releases. Most teams prefer to keep the roadmap as a separate document to share with both executives and the product team. Some firms include this document in the business plan. For more on product roadmaps, see Product Roadmapping.

## Requirements

The Requirements document--whether called a Market Requirements Document (MRD) or a Product Requirements Document (PRD) or a backlog or something else--contains a prioritized list of problems for your target personas. 

Contents include:
- Persona definitions
- Phases of deliverables
- Requirements (problems with use scenarios and frequency)

There you have it. A business case reveals your plans for the product as a whole. The roadmap shows phases of deliverables over the next few cycles. The requirements document contains the details of the problems that will be addressed in the next release or product version.
