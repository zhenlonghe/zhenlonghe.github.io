---
layout: default
---

{%- comment -%}
  最新一篇全文照登，后面接近期列表。

  原先列表用 `site.time` 的年份跟文章年份比对，一不同就 break。最新文章是
  2026 年、第二篇是 2025 年，于是循环在第一轮就断掉，"Earlier this year"
  下面一篇都不剩。这里改成直接取最近 12 篇按年分组，跟当前年份无关。
{%- endcomment -%}

{%- assign latest = site.posts.first -%}

{%- if latest %}
<article class="latest">
  <header>
    <h2 class="entry-title"><a href="{{ latest.url }}">{{ latest.title }}</a></h2>
    <div class="entry-meta">
      <time datetime="{{ latest.date | date_to_xmlschema }}">{{ latest.date | date: "%Y-%m-%d" }}</time>
      {%- if latest.tags and latest.tags != empty %}
      <span class="tag-list">
        {%- for tag in latest.tags %}
        <a class="tag" href="/tags.html#{{ tag | uri_escape }}">{{ tag }}</a>
        {%- endfor %}
      </span>
      {%- endif %}
      {%- if latest.guid %}
      <span class="like-wrapper"
            like-shortname="{{ site.disqus }}"
            like-identifier="{{ latest.guid }}"
            like-name="{{ latest.title }}"
            like-link="{{ site.atom-baseurl }}{{ latest.url }}"
            like-btn="&#x2661;"></span>
      <script src="https://like.lhzhang.com/javascript/widget.js" async></script>
      {%- endif %}
    </div>
  </header>
  <div class="prose">
    {{ latest.content | auto_spacing }}
  </div>
</article>
{%- endif %}

<section class="recent" aria-labelledby="recent-heading">
  <h2 class="listing-label" id="recent-heading">
    近期
  </h2>

  <ul class="listing">
  {%- assign recent = site.posts | slice: 1, 12 -%}
  {%- for post in recent %}
    <li class="listing-item" style="--i: {{ forloop.index0 }}">
      <a href="{{ post.url }}">
        <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y-%m-%d" }}</time>
        <span class="listing-title">{{ post.title }}</span>
      </a>
    </li>
  {%- else %}
    <li class="listing-empty">还只有这一篇。</li>
  {%- endfor %}
  </ul>

  <a class="more-link" href="/archive.html">全部归档，共 <span class="stamp">{{ site.posts.size }}</span> 篇{% include icon.html name="arrow-right" %}</a>
</section>
