/**
 * @author Eric Moore
 * @goal Determine if MDX syntax can be compatible with HA framework.
 * @overview
 *
 * MDX consists of the following six steps:
 *   Parse: MDX text => MDAST
 *   Transpile: MDAST => MDXAST (remark-mdx)
 *   Transform: remark_PLUGINS applied to AST
 *   Transpile: MDXAST => MDXHAST
 *   Transform: rehype_PLUGINS applied to AST
 *   Generate: MDXHAST => JSX text
 *
 * MDX allows you to hook into this flow at step 3 and 5, where you can use remark and rehype plugins (respectively) to benefit from their ecosystems.
 *
 */
