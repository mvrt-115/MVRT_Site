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

<nav class="people-nav">
  <ul>
    <li><a href="/about/people/#officers">Officers</a></li>
    <li><a href="/about/people/#managers">Managers</a></li>
    <li><a href="/about/people/#team">Team</a></li>
    <li><a href="/about/people/mentors/">Mentors</a></li>
    <li><a href="/about/people/alumni/">Alumni</a></li>
  </ul>
</nav>

<br>

{% for group in site.data.alumni %}
  {% assign year = group[0] %}
  {% assign alumni = group[1] %}

## Class of {{ year }}

<ul>
  {% for alumnus in alumni %}

    <li>{{ alumnus.name }}{% if alumnus.story %}</a>{% endif %} {% if alumnus.college %}({{ alumnus.college }}){% endif %}</li>

  {% endfor %}
</ul>

{% endfor %}
