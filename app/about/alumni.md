---
title: Alumni
layout: post
permalink: /about/people/alumni/
---

After graduating from Monta Vista High School, MVRT members take their
knowledge, experience, and passion wherever they go. Many MVRT alumni have
started and mentored new teams, volunteered at FIRST regionals, and inspired
kids across the country to join robotics.

If you are an MVRT alumni and you are not listed below, please send an email to
mvrt@mvrt.com. <!-- or submit an issue/PR at github.com/mvrt-115/MVRT_Site -->

{% for group in site.data.alumni %}
  {% assign year = group[0] %}
  {% assign alumni = group[1] %}

## Class of {{ year }}

<ul>
  {% for alumnus in alumni %}

    <li>{% if alumnus.story %}<a href="{{ alumnus.story }}">{% endif %}{{ alumnus.name }}{% if alumnus.story %}</a>{% endif %} {% if alumnus.college %}({{ alumnus.college }}){% endif %}</li>

  {% endfor %}
</ul>

{% endfor %}
