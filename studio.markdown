---
title: Studio
layout: page
permalink: /studio
parent: /about.html
raw: true
description: Zhenlong 独立开发、已在 App Store 上架的应用。
---

<p class="studio-intro">一个人做的小工具，都在 App Store 上架。</p>

<ul class="app-list">
  {%- for app in site.data.apps %}
  <li class="app-item">
    <a href="{{ app.url }}" target="_blank" rel="noopener noreferrer">
      <img class="app-icon{% if app.platform == 'ios' %} is-ios{% endif %}" src="/media/apps/{{ app.icon }}" alt="" width="56" height="56" loading="lazy">
      <span class="app-text">
        <span class="app-name">{{ app.name }}<span class="app-platform stamp">{% if app.platform == 'mac' %}macOS{% else %}iOS{% endif %}</span></span>
        <span class="app-summary">{{ app.summary }}</span>
      </span>
    </a>
  </li>
  {%- endfor %}
</ul>
