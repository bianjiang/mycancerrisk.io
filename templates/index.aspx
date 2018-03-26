{% extends "layout.aspx" %}

{% block content %}

    <div id="content" class="container">
        <div ng-view></div>
    </div>

<script src="/static/app/bower_components/angular/angular.min.js"></script>
<script src="/static/app/bower_components/angular-route/angular-route.min.js"></script>
<script src="/static/app/bower_components/angular-cookies/angular-cookies.js"></script>
<script src="/static/app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
<script src="/static/app/bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script src="/static/app/bower_components/tv4/tv4.js"></script>
<script src="/static/app/bower_components/objectpath/lib/ObjectPath.js"></script>
<script src="/static/app/bower_components/angular-schema-form/dist/schema-form.min.js"></script>
<script src="/static/app/bower_components/angular-schema-form/dist/bootstrap-decorator.min.js"></script>
<script src="/static/app/bower_components/angular-loading-bar/build/loading-bar.min.js"></script>
<script src="/static/app/bower_components/angular-smart-table/dist/smart-table.min.js"></script>

<script src="/static/app/app.js"></script>
<script src="/static/app/components/version/version.js"></script>
<script src="/static/app/components/version/version-directive.js"></script>
<script src="/static/app/components/version/interpolate-filter.js"></script>

<script src="/static/app/global/global.js"></script>
<script src="/static/app/about/about.js"></script>
<script src="/static/app/crc-risk/crc-risk.js"></script>
<script src="/static/app/user/user.js"></script>
<script src="/static/app/crc-risk/risk-results.js"></script>
<script src="/static/app/test-results/test-results.js"></script>
<script src="/static/app/welcome/welcome.js"></script>
{% endblock content %}