// import { h } from 'hyperapp'
import React from 'react'
import MDX from '@mdx-js/runtime'

// Provide custom components for markdown elements
const components = {
  h1: props => h('h1', { style: { color: 'tomato' } }, ...props),
  Demo: props => h('h1', {}, 'This is a demo component')
}
// Provide variables that might be referenced by JSX
const scope = {
  some: 'value'
}
const mdx = `
# Hello, world!
<Demo />
`
const main = () =>
  h('MDX', { components: { components }, scope: { scope } }, [{ mdx }])

// console.log(main())
