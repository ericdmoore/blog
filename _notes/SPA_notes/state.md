HA SPA effectively becomres the templating engine...
HA will manage the state transitions from page to page 

Mirage runs content through that layout engine - during the build process

Theming requires HA only for the store front to work...

SPA would include
- index 
	posts
		current
		prev
		next
	menu
		isOpen
		search_q

- page
	md_contnet

- post
	md_contnet
	frontmatter
	prev2
	prev
	next
	next2

- archives
- tags

- categories

redesign blog ? 
use spectre css ? - current css = 16k


Page Component Pattern
  page component is an HOC that returns the page layout component for a given route 
  render component with fetch promise that udpates the markup??

needs : Route bindings and parsing
- eg: archives/page/2
- page component to reads in url: `archives/page/2`
- fetch `page2` and render components.


SPA State:
- Is_MenuOpen = false;
- menu_search_q = null;
- menu_search_results = null;
- SpeedReadMode = false;
- page? paginate?


SSR Page State:
- window.location = ""
- [posts]:eachHas
		- img
		- title
		- subtitle
		- style
- isSideMenuOpen = false
	- searchQuery
	- searchResults

- Side Menu Content
- header
- footer


Actions:
- next page
	- page URL
	- [posts]:eachHas
		- img
		- title
		- subtitle
		- style
- prev page
	- page URL
	- [posts]:eachHas
		- img
		- title
		- subtitle
		- style