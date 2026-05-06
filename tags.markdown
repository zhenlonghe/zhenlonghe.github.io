---
title: tags
layout: page
---

<div id='tag_cloud'>
{% for tag in site.tags %}
<a href="#" 
   class="tag-filter" 
   data-tag="{{ tag[0] }}" 
   title="{{ tag[0] }} ({{ tag[1].size }}篇文章)">
   {{ tag[0] }}
   <span class="tag-count">({{ tag[1].size }})</span>
</a>
{% endfor %}
<a href="#" id="clearFilter" class="clear-filter" title="清除过滤" style="display: none;">×</a>
</div>

<ul class="listing">
{% for post in site.posts %}
  <li class="listing-item" data-tags="{{ post.tags | join: ',' }}">
    <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time>
    <a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
    <span class="post-tags">
      {% for tag in post.tags %}
        <span class="post-tag">{{ tag }}</span>
      {% endfor %}
    </span>
  </li>
{% endfor %}
</ul>

<script src="/media/js/jquery.tagcloud.js"></script>
<script>
$(function() {
  // 初始化标签云
  $.fn.tagcloud.defaults = {
    size: {start: 12, end: 18, unit: 'px'},
    color: {start: '#938c97', end: '#f0e8e9'}
  };
  $('#tag_cloud a').tagcloud();

  // 标签过滤功能
  $('.tag-filter').click(function(e) {
    e.preventDefault();
    const selectedTag = $(this).data('tag');
    
    // 高亮选中的标签
    $('.tag-filter').removeClass('active');
    $(this).addClass('active');
    
    // 显示清除按钮
    $('#clearFilter').show();
    
    // 过滤文章
    $('.listing-item').each(function() {
      const tags = $(this).data('tags').split(',');
      if (tags.includes(selectedTag)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  // 清除过滤
  $('#clearFilter').click(function(e) {
    e.preventDefault();
    $(this).hide();
    $('.tag-filter').removeClass('active');
    $('.listing-item').show();
  });
});
</script>
