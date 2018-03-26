{% extends "layout.aspx" %}

{% block content %}

    <div id="content" class="container">
        <div ng-view></div>
    </div>



<script src="/static/app/bundle/main.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.v1.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
{% endblock content %}