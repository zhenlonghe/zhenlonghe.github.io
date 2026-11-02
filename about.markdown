---
title: About me
layout: page
raw: true
---

{%- comment -%}
  三段：一句自我介绍做导语；经历按年份列成细线分隔的行，年份走等宽数字；
  最后一行社交图标，每个都带 aria-label。
{%- endcomment -%}

<div class="about">
  <p class="about-lead">A lifelong learner, creator, dreamer, minimalist, and artist from mainland China.</p>
  <p class="about-note">我做的应用都在 <a href="/studio">Studio</a>。</p>

  <section class="about-section" aria-labelledby="timeline-heading">
    <h2 class="listing-label" id="timeline-heading">经历</h2>
    <dl class="timeline">
      <div><dt>2024</dt><dd>Freelancer</dd></div>
      <div><dt>2021</dt><dd>BMW Brilliance</dd></div>
      <div><dt>2014</dt><dd>SJ Bank</dd></div>
      <div><dt>2010</dt><dd>SIM</dd></div>
      <div><dt>2006</dt><dd>NEU</dd></div>
      <div><dt>1987</dt><dd>Born in Shenyang, China</dd></div>
    </dl>
  </section>

  <ul class="social-links" aria-label="社交账号">
    {%- for social in site.data.socials %}
    <li><a href="{{ social.url }}" target="_blank" rel="noopener noreferrer" aria-label="{{ social.name }}" title="{{ social.name }}">{% include icon.html name=social.icon %}</a></li>
    {%- endfor %}
  </ul>
</div>
