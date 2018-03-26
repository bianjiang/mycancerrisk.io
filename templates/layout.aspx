
<!DOCTYPE html>
<!--[if lt IE 7]>      <html lang="en" ng-app="myApp" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html lang="en" ng-app="myApp" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html lang="en" ng-app="myApp" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>CRC Risk App</title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta property="og:title" content=""/>
  <meta property="og:type" content=""/>
  <meta property="og:url" content=""/>
  <meta property="og:image" content="" />
  <meta property="og:site_name" content=""/>
  <meta property="og:description" content=""/>
  <link rel="stylesheet" href="/static/app/bundle/main.min.v1.css">
</head>
  <body ng-app="CRCRiskApp" ng-controller="GlobalCtrl">
   <!--[if lt IE 8]>
      <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
  <![endif]-->
    <!-- Fixed navbar -->
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">&nbsp;</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          {% if not session.logged_in %}
            <ul class="nav navbar-nav navbar-right">
              <li><a href="/login">Login</a></li>
            </ul>
          {% else %}
            <ul class="nav navbar-nav ">
            <li id="about" class="active"><a href="#!/welcome">Welcome</a></li>
            <!-- <li id="risk" ><a href="#risk">CRC Risk Assessment</a></li> -->
            <li id="testresults" ><a href="#!/test-results">Test Results</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
            <!-- <li><a href="/logout">Welcome {{ session.user_name }}</a></li> -->
              <li class="dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                Welcome {{ session.user_name }}
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                <li><a ng-click="logout()">Logout</a></li>
                <li><a href="#!/user">Update Information</a></li>
              </ul>
              </li>
            </ul>
          {% endif %}
        </div>
      </div>
    </nav>

  {% block content %}
  {% endblock content %}
  </body>
</html>