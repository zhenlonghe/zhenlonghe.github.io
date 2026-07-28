---
title: 归档
layout: page
body_class: archive
raw: true
---

{%- comment -%}
  按年份分组。年份标签用 sticky 贴顶，列表滚很长时始终看得到自己在哪一年。
{%- endcomment -%}

{%- assign years = site.posts | group_by_exp: "post", "post.date | date: '%Y'" -%}

{%- for year in years %}
<section class="listing-group">
  <h2 class="listing-label">
    <span class="stamp">{{ year.name }}</span>
    <span class="count"><span class="stamp">{{ year.items.size }}</span> 篇</span>
  </h2>
  <ul class="listing">
  {%- for post in year.items %}
    <li class="listing-item">
      <a href="{{ post.url }}">
        <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%m-%d" }}</time>
        <span class="listing-title">{{ post.title }}</span>
      </a>
    </li>
  {%- endfor %}
  </ul>
</section>
{%- else %}
<p class="listing-empty">还没有文章。</p>
{%- endfor %}
