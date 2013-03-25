---
layout: page
title:
tagline: '(我们在世的日子好似影子.)'
---
你好，这里是何振龙的个人博客。
这里记录了一些所感所悟。

记录和分享是一件让人愉快的事儿，如果我的创作帮助了你，我很荣幸。

可以通过邮件联系我：
    zhenlonghe # gmail.com


<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
