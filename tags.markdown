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
  <li class="listing-item">
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
    color: {start: '#777', end: '#333'}
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

<style>
#tag_cloud {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
  line-height: 2em;
}

#tag_cloud a {
  margin: 0 5px;
  padding: 2px 7px;
  background: #fff;
  border-radius: 3px;
  text-decoration: none;
  transition: all 0.2s ease;
}

#tag_cloud a:hover {
  background: #e9ecef;
}

#tag_cloud a.active {
  background: #007bff;
  color: #fff;
}

.tag-count {
  font-size: 0.8em;
  color: #666;
}

.clear-filter {
  font-size: 18px;
  color: #666;
  margin-left: 10px;
  text-decoration: none;
}

.clear-filter:hover {
  color: #333;
}

.listing {
  margin: 0;
  padding: 0;
  list-style: none;
}

.listing-item {
  margin: 5px 0;
}

.listing-item time {
  color: #999;
  margin-right: 15px;
}

.post-tags {
  margin-left: 10px;
  font-size: 0.9em;
}

.post-tag {
  color: #666;
  margin-right: 5px;
}
</style>
