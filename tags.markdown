---
title: 标签
layout: page
raw: true
---

{%- comment -%}
  筛选逻辑搬到 media/js/site.js，不再需要 jQuery 和 jquery.tagcloud。
  另外文章里的标签链接是 /tags.html#标签，过去带 hash 进来并不会自动筛选，
  现在会。
{%- endcomment -%}

<div class="tag-cloud" role="group" aria-label="按标签筛选">
{%- for tag in site.tags %}
  <button type="button" class="tag" data-tag="{{ tag[0] }}" aria-pressed="false">
    {{ tag[0] }}<span class="count">{{ tag[1].size }}</span>
  </button>
{%- endfor %}
</div>

<ul class="listing">
{%- for post in site.posts %}
  <li class="listing-item" data-tags="{{ post.tags | join: ',' }}" style="--i: {{ forloop.index0 }}">
    <a href="{{ post.url }}">
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y-%m-%d" }}</time>
      <span class="listing-title">{{ post.title }}</span>
      {%- if post.tags and post.tags != empty %}
      <span class="tag-list">
        {%- for tag in post.tags %}
        <span class="tag">{{ tag }}</span>
        {%- endfor %}
      </span>
      {%- endif %}
    </a>
  </li>
{%- endfor %}
</ul>

<p class="listing-empty" hidden>这个标签下暂时没有文章。</p>
