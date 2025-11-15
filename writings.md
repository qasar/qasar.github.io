---
title: Writings
permalink: /writings/
---

Essays and thoughts on various topics.

<p>&nbsp;</p>

{% for essay in site.essay %}
<a href="{{ site.baseurl }}{{ essay.url }}">{{ essay.title }}</a>. 

{% endfor %}

