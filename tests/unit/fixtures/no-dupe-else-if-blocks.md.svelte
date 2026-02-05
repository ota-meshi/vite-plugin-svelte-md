<script context="module">
export const frontmatter = {"pageClass":"rule-details","sidebarDepth":0,"title":"@ota-meshi/svelte/no-dupe-else-if-blocks","description":"disallow duplicate conditions in `{#if}` / `{:else if}` chains","since":"v0.0.1"}
</script>

<svelte:head>
<title>@ota-meshi/svelte/no-dupe-else-if-blocks</title>
<meta property="og:title" content="@ota-meshi/svelte/no-dupe-else-if-blocks">
<meta property="og:description" content="disallow duplicate conditions in `&#123;#if&#125;` / `&#123;:else if&#125;` chains">
<meta name="description" content="disallow duplicate conditions in `&#123;#if&#125;` / `&#123;:else if&#125;` chains">
</svelte:head>
<div class="markdown-body"><h1>@ota-meshi/svelte/no-dupe-else-if-blocks</h1>
<blockquote>
<p>disallow duplicate conditions in <code>&#123;#if&#125;</code> / <code>&#123;:else if&#125;</code> chains</p>
</blockquote>
<ul>
<li>:gear: This rule is included in <code>&quot;plugin:@ota-meshi/svelte/recommended&quot;</code>.</li>
</ul>
<h2>:book: Rule Details</h2>
<p>This rule disallows duplicate conditions in the same <code>&#123;#if&#125;</code> / <code>&#123;:else if&#125;</code> chain.</p>
<eslint-code-block>
<!--eslint-skip-->
<div class="language-svelte line-numbers-mode">
<pre class="language-svelte"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
  <span class="token comment">/* eslint @ota-meshi/svelte/no-dupe-else-if-blocks: "error" */</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>

<span class="token comment">&lt;!-- ✓ GOOD --></span>
<span class="token language-javascript"><span class="token punctuation">&#123;</span>#<span class="token keyword">if</span> a<span class="token punctuation">&#125;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>foo<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">:</span><span class="token keyword">else</span> <span class="token keyword">if</span> b<span class="token punctuation">&#125;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>bar<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">:</span><span class="token keyword">else</span> <span class="token keyword">if</span> c<span class="token punctuation">&#125;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>baz<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">/</span><span class="token keyword">if</span><span class="token punctuation">&#125;</span></span>

<span class="token comment">&lt;!-- ✗ BAD --></span>
<span class="token language-javascript"><span class="token punctuation">&#123;</span>#<span class="token keyword">if</span> a<span class="token punctuation">&#125;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>foo<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">:</span><span class="token keyword">else</span> <span class="token keyword">if</span> b<span class="token punctuation">&#125;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>bar<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">:</span><span class="token keyword">else</span> <span class="token keyword">if</span> b<span class="token punctuation">&#125;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>baz<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">/</span><span class="token keyword">if</span><span class="token punctuation">&#125;</span></span>

<span class="token language-javascript"><span class="token punctuation">&#123;</span>#<span class="token keyword">if</span> a<span class="token punctuation">&#125;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>foo<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">:</span><span class="token keyword">else</span> <span class="token keyword">if</span> b<span class="token punctuation">&#125;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>bar<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">:</span><span class="token keyword">else</span><span class="token punctuation">&#125;</span></span>
  baz
  <span class="token language-javascript"><span class="token punctuation">&#123;</span>#<span class="token keyword">if</span> b<span class="token punctuation">&#125;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>qux<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
  <span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">/</span><span class="token keyword">if</span><span class="token punctuation">&#125;</span></span>
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">/</span><span class="token keyword">if</span><span class="token punctuation">&#125;</span></span>
</code></pre>

<div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br></div>
</div></eslint-code-block>
<p>This rule can also detect some cases where the conditions are not identical, but the branch can never execute due to the logic of <code>||</code> and <code>&amp;&amp;</code> operators.</p>
<eslint-code-block>
<!--eslint-skip-->
<div class="language-svelte line-numbers-mode">
<pre class="language-svelte"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
  <span class="token comment">/* eslint @ota-meshi/svelte/no-dupe-else-if-blocks: "error" */</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>

<span class="token comment">&lt;!-- ✗ BAD --></span>
<span class="token language-javascript"><span class="token punctuation">&#123;</span>#<span class="token keyword">if</span> a <span class="token operator">||</span> b<span class="token punctuation">&#125;</span></span>
  1
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">:</span><span class="token keyword">else</span> <span class="token keyword">if</span> a<span class="token punctuation">&#125;</span></span>
  2
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">/</span><span class="token keyword">if</span><span class="token punctuation">&#125;</span></span>

<span class="token language-javascript"><span class="token punctuation">&#123;</span>#<span class="token keyword">if</span> a<span class="token punctuation">&#125;</span></span>
  1
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">:</span><span class="token keyword">else</span> <span class="token keyword">if</span> b<span class="token punctuation">&#125;</span></span>
  2
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">:</span><span class="token keyword">else</span> <span class="token keyword">if</span> a <span class="token operator">||</span> b<span class="token punctuation">&#125;</span></span>
  3
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">/</span><span class="token keyword">if</span><span class="token punctuation">&#125;</span></span>

<span class="token language-javascript"><span class="token punctuation">&#123;</span>#<span class="token keyword">if</span> a<span class="token punctuation">&#125;</span></span>
  1
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">:</span><span class="token keyword">else</span> <span class="token keyword">if</span> a <span class="token operator">&amp;&amp;</span> b<span class="token punctuation">&#125;</span></span>
  2
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">/</span><span class="token keyword">if</span><span class="token punctuation">&#125;</span></span>

<span class="token language-javascript"><span class="token punctuation">&#123;</span>#<span class="token keyword">if</span> a <span class="token operator">&amp;&amp;</span> b<span class="token punctuation">&#125;</span></span>
  1
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">:</span><span class="token keyword">else</span> <span class="token keyword">if</span> a <span class="token operator">&amp;&amp;</span> b <span class="token operator">&amp;&amp;</span> c<span class="token punctuation">&#125;</span></span>
  2
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">/</span><span class="token keyword">if</span><span class="token punctuation">&#125;</span></span>

<span class="token language-javascript"><span class="token punctuation">&#123;</span>#<span class="token keyword">if</span> a <span class="token operator">||</span> b<span class="token punctuation">&#125;</span></span>
  1
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">:</span><span class="token keyword">else</span> <span class="token keyword">if</span> b <span class="token operator">&amp;&amp;</span> c<span class="token punctuation">&#125;</span></span>
  2
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">/</span><span class="token keyword">if</span><span class="token punctuation">&#125;</span></span>

<span class="token language-javascript"><span class="token punctuation">&#123;</span>#<span class="token keyword">if</span> a<span class="token punctuation">&#125;</span></span>
  1
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">:</span><span class="token keyword">else</span> <span class="token keyword">if</span> b <span class="token operator">&amp;&amp;</span> c<span class="token punctuation">&#125;</span></span>
  2
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">:</span><span class="token keyword">else</span> <span class="token keyword">if</span> d <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>c <span class="token operator">&amp;&amp;</span> e <span class="token operator">&amp;&amp;</span> b<span class="token punctuation">)</span> <span class="token operator">||</span> a<span class="token punctuation">)</span><span class="token punctuation">&#125;</span></span>
  3
<span class="token language-javascript"><span class="token punctuation">&#123;</span><span class="token operator">/</span><span class="token keyword">if</span><span class="token punctuation">&#125;</span></span>
</code></pre>

<div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br></div>
</div></eslint-code-block>
<h2>:wrench: Options</h2>
<p>Nothing.</p>
<h2>:couple: Related Rules</h2>
<ul>
<li><a href="https://eslint.org/docs/rules/no-dupe-else-if">no-dupe-else-if</a></li>
</ul>
<h2>:rocket: Version</h2>
<p>This rule was introduced in @ota-meshi/eslint-plugin-svelte v0.0.1</p>
<h2>:mag: Implementation</h2>
<ul>
<li><a href="https://github.com/ota-meshi/eslint-plugin-svelte/blob/main/src/rules/no-dupe-else-if-blocks.ts">Rule source</a></li>
<li><a href="https://github.com/ota-meshi/eslint-plugin-svelte/blob/main/tests/src/rules/no-dupe-else-if-blocks.ts">Test source</a></li>
</ul>
</div>