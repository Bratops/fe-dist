(function(){"use strict";angular.module("brasFeApp",["ngCookies","ngResource","ngAnimate","ngSanitize","ui.router","ui.bootstrap","restangular","duScroll","angular-growl","timer","ngGrid","ui.tree","angular-loading-bar"]).config(["cfpLoadingBarProvider",function(a){return a.includeSpinner=!1,a.includeBar=!0,a.latencyThreshold=1e3}]).config(["growlProvider",function(a){return a.globalTimeToLive(1e4),a.onlyUniqueMessages(!1),a.globalReversedOrder(!0),a.globalDisableCountDown(!0)}]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(a,b,c){return b.otherwise("/"),c.html5Mode(!0)}]).config(["$httpProvider",function(a){return a.interceptors.push("errorHandler")}])}).call(this),function(){"use strict";angular.module("brasFeApp").factory("errorHandler",["$q","$log","$rootScope","growl",function(a,b,c,d){var e;return e=function(a){var b,c;return a&&a.msg?(c=d[a.status],b=a.msg,c(b.body,{title:b.title})):void console.log("unscoped server error")},{response:function(c){return b.debug(""+c.config.method+"["+c.status+"] ("+c.config.url+")"),c||a.when(c)},responseError:function(f){var g;switch(b.debug("error with status "+f.status+" and data: "+f.data.message),g=f.data,e(g),c.$broadcast("httpError",f.status),f.status){case 401:break;case 400:d.error("如果您仍需這個功能，請來信:<mailto:little_beaver@gmail.com>",{title:"參數錯誤"});break;case 403:d.error("此頁面禁止存取",{title:"禁止進入"});break;case 404:d.error("找不到您要的功能",{title:"找不到海狸"});break;case 405:d.error("系統回應：您無法使用此功能",{title:"被限制的功能"});break;case 406:d.error("抱歉，系統無法處理您的請求",{title:"無法處理的請求"});break;case 408:d.error("請確認連線狀態及網路速度",{title:"請求逾時"});break;case 0:d.error("No connection, check your internet connection. Or the server might be maintainace.");break;default:f.status>=500?d.error("正在記錄錯誤，並且尋找海狸工程師來修理",{title:"海狸忙碌中..."}):d.error("Error: "+f,{title:"未知的錯誤",ttl:1e6})}return a.reject(f)}}}])}.call(this),function(){"use strict";angular.module("brasFeApp").directive("landingSize",["$window",function(a){return function(b){var c;return c=angular.element(a),b.getWindowDimensions=function(){return{h:c.height(),w:c.width()}},b.$watch(b.getWindowDimensions,function(a){return b.windowHeight=a.h,b.windowWidth=a.w,b.style=function(){return{height:a.h-100+"px",width:"100%"}}},!0),c.bind("resize",function(){return b.$apply()})}}])}.call(this),function(){"use strict";angular.module("brasFeApp").service("sessionInjector",["sessionServ",function(a){var b;return b={request:function(b){return a.isGuest()||(b.headers["x-auth-login"]=a.user.login_alias,b.headers["x-auth-token"]=a.user.auth_token),b}}}])}.call(this),function(){"use strict";angular.module("brasFeApp").factory("sestangular",["Restangular",function(a){var b;return b=function(a){return"http://"+a+"/"},{rest:function(c,d){return d.cache=null!=d.cache?d.cache:!0,a.withConfig(function(a){return a.setBaseUrl(b(d.host)),a.setDefaultHttpFields({cache:d.cache,withCredentials:!0}),a.setRestangularFields({id:"_id",route:"restangularRoute",selfLink:"self.href"}),a.setDefaultHeaders({"Content-Type":"application/json","X-AUTH-LOGIN":c.login_alias||"","X-AUTH-TOKEN":c.auth_token||"","X-Requested-With":"XMLHttpRequest",Accept:"application/bebras.tw; ver=1"})})}}}])}.call(this),function(){"use strict";angular.module("brasFeApp").controller("DashAdminCtrl",["$scope","$state","dashUser","menu",function(a,b,c,d){var e,f,g;return g="dashboard.admin",f=function(a){var b,c;return c=a.source.nodesScope.$modelValue,b=0,_.each(c,function(a){return a.pos=b,b+=1})},e=function(a){return a.$element.addClass("dragging")},a.data={menu:{serv:d.data,selected:{}},menuTree:{beforeDrag:e,dropped:f},users:{},edit_role:""},a.userGrid={data:"data.users"},a.$on("$stateChangeStart",function(){return console.log(b.current.name)}),a.$on("$stateChangeSuccess",function(a,b){return b.name===""+g+".users"?c.load_users():b.name===""+g+".tasks"?c.load_users():void 0}),a.$on("users_loaded",function(){return a.data.users=c.users}),a.$watch("data.edit_role",function(a){return a?d.get_menu_list(a):void 0}),a.$on("cfpLoadingBar:loading",function(a,b){return console.log("here lodaing",b)}),a.not_in_base=function(){return null==a.user?!1:!b.is("dashboard."+a.user.role.name)},a.show_menu_item=function(b){var c;return c=b.$modelValue,a.data.menu.selected=c},a.menu_item_selected=function(b){return a.data.menu.selected===b},a.menu_cancel_edit=function(){return a.data.menu.selected={},a.data.menu.serv.raw={},b.go(g)},a.menu_save=function(){return d.update_raw(a.data.edit_role)},a.menu_mark_as_remove=function(a){var b;return b=a.$modelValue,b.destroy=!b.destroy},a.menu_add=function(){var b;return b=a.data.menu.serv.raw.length,a.data.menu.serv.raw.push({id:-1,name:"New item",pos:b,nodes:[]})}}])}.call(this),function(){"use strict";angular.module("brasFeApp").controller("DashManagerCtrl",["$scope",function(a){return a.message="manager Hello"}])}.call(this),function(){"use strict";angular.module("brasFeApp").controller("DashMenuCtrl",["$scope","$state","menu","sessionServ",function(a,b,c,d){return a.$on("$stateChangeSuccess",function(){return b.includes("dashboard.**")?(c.load(),a.data=c.data):void 0}),a.$on("role_switched",function(){return c.reload()}),a.menu_click=function(a){var e,f;return e=d.user.role.name,c.data.clicked=a,f="dashboard."+e+"."+a.link,b.go(f)}}])}.call(this),function(){"use strict";angular.module("brasFeApp").controller("DashStudentCtrl",["$scope",function(a){return a.message="studnet Hello"}])}.call(this),function(){"use strict";angular.module("brasFeApp").controller("DashTeacherCtrl",["$scope",function(a){return a.message="Hello teacher"}])}.call(this),function(){"use strict";angular.module("brasFeApp").controller("DashUserCtrl",["$scope",function(a){return a.message="Hello user"}])}.call(this),function(){"use strict";var a,b;a={base:function(a){return{url:"",templateUrl:"app/dashboard/view/base.html",views:{menu:{templateUrl:"app/dashboard/view/menu.html",controller:"DashMenuCtrl"},panel:{templateUrl:"app/dashboard/view/"+a+"/base.html",controller:"Dash"+(a[0].toUpperCase()+a.slice(1))+"Ctrl"}}}},extend:function(b,c){var d;return d=a.base(b),d.url="/"+c,d.views={box:{templateUrl:"app/dashboard/view/"+b+"/"+c+".html",controller:"Dash"+(b[0].toUpperCase()+b.slice(1))+"Ctrl"}},d},magic:function(b,c){return null==c?a.base(b):a.extend(b,c)},dash_admin:function(b){return a.magic("admin",b)},dash_teacher:function(b){return a.magic("teacher",b)},dash_manager:function(b){return a.magic("teacher",b)},dash_student:function(b){return a.magic("teacher",b)},dash_user:function(b){return a.magic("teacher",b)},admin:"dashboard.admin",teacher:"dashboard.teacher"},b=a,angular.module("brasFeApp").config(["$stateProvider",function(a){return a.state("dashboard",{url:"/dashboard","abstract":!0,templateUrl:"app/dashboard/view/base.html",controller:"DashboardCtrl"}).state(b.admin,b.dash_admin()).state(""+b.admin+".users",b.dash_admin("users")).state(""+b.admin+".tasks",b.dash_admin("tasks")).state(""+b.admin+".menu",b.dash_admin("menu")).state("dashboard.manager",b.base("manager")).state(b.teacher,b.dash_teacher()).state(""+b.teacher+".groups",b.dash_teacher("groups")).state("dashboard.student",b.base("student")).state("dashboard.user",b.base("user"))}]),angular.module("brasFeApp").controller("DashboardCtrl",["$scope","$state","menu","sessionServ","growl",function(a,b,c,d,e){var f;return d.warm_up(),a.$on("$stateChangeStart",function(){}),f=function(b){var c,d;return d=a.user.roles,c=_.findIndex(d,function(a){return a.id===b.id}),0>c?d[0]:d[c]},a.$on("$stateChangeSuccess",function(){var c;return d.auth_user(b),b.includes("dashboard.**")?(c=d.user,a.user=c,a.role=f(c.role)):void 0}),a.$on("redirect",function(a,c){return"dashboard"===c?b.go(c+"."+d.user.role.name):void 0}),a.$watch("role",function(a,b){return b.id!==a.id?d.switch_role(a.id):void 0}),a.logout=function(){return d.logout()},a.$on("$stateNotFound",function(a,b){return console.log(b.name),e.error("未實作的功能",{title:"Oops"}),a.preventDefault()}),a.data.menu=c.data}])}.call(this),function(){"use strict";angular.module("brasFeApp").service("dashUser",["$rootScope","sessionServ",function(a,b){var c;return c={users:{},user:{},init:!1,load:function(){return c.init?void 0:(c.init=!0,c.user=b.user)},load_users:function(){var d,e;return d=b.rest,e=b.user.role,d.all(""+e.name+"/users").get("").then(function(b){return c.users=b.data,a.$broadcast("users_loaded")})}}}])}.call(this),function(){"use strict";angular.module("brasFeApp").service("menu",["$log","sessionServ","growl",function(a,b,c){var d,e;return d=function(a){var b,d;return b=c[a.status],d=a.msg,b(d.body,{title:d.title})},e={init:!1,reload:function(){return e.init=!1,e.load()},load:function(){return e.init?void 0:(e.init=!0,e.load_menu())},data:{clicked:{},menu:{},raw:{}},load_menu:function(){var a;return a=b.rest,a.all("dashboard/menu?t="+_.now()).get("").then(function(a){return e.data.menu=a.menu})},get_menu_list:function(a){var c;return c=b.fest(),c.all("dashboard/menu?edit="+a).get("").then(function(a){return e.data.raw=a.menu})},update_raw:function(a){var c,f,g;return c={role:a,menu:e.data.raw},f=b.fest(),g=b.user.role.name,f.all(""+g).one("menu").post("",c).then(function(b){return e.get_menu_list(a),d(b)})}}}])}.call(this),function(){"use strict";angular.module("brasFeApp").config(["$stateProvider",function(a){return a.state("landing",{url:"/",templateUrl:"app/landing/landing.html",controller:"LandingCtrl"})}]),angular.module("brasFeApp").controller("LandingCtrl",["$scope","$state","sessionServ",function(a,b,c){var d;return a.data={user:c.user},c.warm_up(),d=function(a){return b.current.name==="session."+a},a.dim_bg=function(){return d("login")||d("register")||d("reset")},a.loggedin=function(){return c.is_user},a.logout=function(){return c.logout()},a.$on("$stateChangeStart",function(){})}])}.call(this),function(){"use strict";angular.module("brasFeApp").config(["$stateProvider",function(a){return a.state("session",{"abstract":!0,url:"/",templateUrl:"app/landing/landing.html",controller:"LandingCtrl"}).state("session.login",{url:"login",views:{control:{templateUrl:"components/form/session/login.html",controller:"SessionCtrl"}}}).state("session.register",{url:"register",views:{control:{templateUrl:"components/form/session/register.html",controller:"SessionCtrl"}}}).state("session.reset",{url:"password/edit?reset_password_token",views:{control:{templateUrl:"components/form/session/pw_reset.html",controller:"SessionCtrl"}}}).state("session.auth",{url:"oauth/{provider}?code&state",views:{control:{template:"<h2></h2><h2>Loading...</h2>",controller:"SessionCtrl"}}}).state("session.gauth",{url:"gauth?key&login&role&role_id",views:{control:{template:"<h2></h2><h2>Loading...</h2>",controller:"SessionCtrl"}}})}]),angular.module("brasFeApp").controller("SessionCtrl",["$scope","$state","$stateParams","$timeout","$location","sessionServ",function(a,b,c,d,e,f){return a.form={submitted:!1},a.onTimeout=function(){return a.form.password="",a.form.password_confirmation="",a.timer=d(a.onTimeout,9e4)},a.timer=d(a.onTimeout,9e4),a.stop=function(){return d.cancel(a.timer)},a.$on("$stateChangeStart",function(){return a.stop(),a.form.submitted=!1}),a.$on("redirect",function(a,c){var d;return"dashboard"===c?(d=f.user.role?f.user.role.name:"user",b.go(c+"."+d)):void 0}),a.$on("httpError",function(){return a.form.submitted=!1}),a.$on("$stateChangeSuccess",function(a,b){return"session.auth"===b.name?f.auth(c):"session.gauth"===b.name?f.gauth(c):void 0}),a.$on("$viewContentLoaded",function(){var a;return a="reset_password_token","sessionServ.reset"!==b.current.name||a in c&&c[a]&&"true"!==c[a]?void 0:b.go("landing")}),a.$watch("school",function(b){return b&&"object"==typeof b&&"moeid"in b?a.form.moeid=b.moeid:void 0}),a.reset=function(){var b,d;return a.form.submitted=!0,d=_.clone(a.form),b=_.extend(d,c),f.reset_pw(b)},a.register=function(){return a.form.submitted=!0,f.register(a.form)},a.login=function(){return a.form.submitted=!0,f.login(a.form)},a.aquire_new_pw=function(){return f.request_link(a.form)},a.moeid_not_set=function(){return!("moeid"in a.form&&a.form.moeid)},a.get_school_list=function(a){return f.sclist(a).then(function(a){return a})},a.password_matched=function(a){return a.password===a.password_confirm},a.loginable=function(b){return!a.form.submitted&&b.$valid},a.resetable=function(b){return!a.form.submitted&&b.$valid&&!a.password_matched(b)},a.registerable=function(b){return!a.form.submitted&&b.$valid&&!a.moeid_not_set()},a.auth=function(b){var c;return a.form.submitted=!0,c="http://"+f.host,console.log(""+c+"/users/auth/"+b),window.location.href=""+c+"/users/auth/"+b}}]),angular.module("brasFeApp").service("sessionServ",["$rootScope","$cookieStore","$state","sestangular","growl",function(a,b,c,d,e){var f,g,h,i,j;return i=function(a){var b,c;return c=e[a.status],b=a.msg,c(b.body,{title:b.title})},g={login_alias:"",auth_token:"",roles:[],role:{name:"user",id:1}},h="bebras01.csie.ntnu.edu.tw",f=function(){},j={init:!1,is_user:!1,user:{login_alias:"",auth_token:""},redirect:"",host:h,rest:d.rest(g,{host:h}).all(""),fest:function(){var a;return a={host:h,cache:!1},d.rest(j.user,a).all("")},validate:function(){return j.is_user?j.rest.one("").get().then(function(){return i(data)}):void 0},warm_up:function(){var a;if(!j.init)return j.init=!0,a=b.get("tiny_beaver")||g,j.set_user(a)},gauth:function(a){return j._success({status:"success",msg:{title:"Google",body:"已登入"},user:{login_alias:a.login,auth_token:a.key,roles:[],role:{name:a.role,id:a.role_id}},redirect:"dashboard"})},auth:function(a){var b;return b="users/auth/"+a.provider+"/callback",j.rest.all(b).get("",a).then(function(a){return j._session_base(a)})},logout:function(){return j.rest.all("session").remove().then(function(a){return i(a),b.put("tiny_beaver",g),j.set_user(g)})},sclist:function(a){return j.rest.all("group/publist/school").getList({query:a})},set_user:function(a){return j.user=a,j.rest=d.rest(a,{host:h}),j.is_user=j.user&&j.user.login_alias&&j.user.auth_token?!0:!1},request_link:function(b){return b&&"login_alias"in b&&b.login_alias?j.rest.all("password/forget").post(b).then(function(b){return i(b),b.status?a.$broadcast("redirect",b.redirect):void 0}):void i({status:"error",msg:{title:"錯誤",body:"請先輸入賬號"}})},register:function(a){return j.rest.one("user").post("",{user:a}).then(function(a){return j._session_base(a)})},login:function(a){return j.rest.one("session").post("",{user:a}).then(function(a){return j._session_base(a)})},reset_pw:function(a){return j.rest.one("password/reset").put(a).then(function(a){return j._session_base(a)})},_session_base:function(a){var b;return i(a),(b=j["_"+a.status])(a)},_success:function(c){return b.put("tiny_beaver",c.user),j.set_user(c.user),c.redirect?a.$broadcast("redirect",c.redirect):void 0},_error:function(){return j.set_user(g),a.$broadcast("sessionError")},isGuest:function(){return!j.user.login_alias&&!j.user.auth_token},switch_role:function(b){return e.warning("請稍後。。。",{title:"轉換中"}),j.fest().all("session/role").get("",{role_id:b}).then(function(b){return j._session_base(b),a.$broadcast("role_switched")})},auth_user:function(a){var b,c;return b=j.user.role,c="dashboard."+b.name,a.includes(""+c+".**")?void 0:(console.log("go stat "+c),a.go(c))}}}])}.call(this),function(){"use strict";angular.module("brasFeApp").config(["$stateProvider",function(a){return a.state("tasks",{url:"/tasks",templateUrl:"app/task/task.html",controller:"TaskCtrl"})}]),angular.module("brasFeApp").controller("TaskCtrl",["$scope","sessionServ","sestangular",function(a,b){var c;return b.warm_up(),c=b,a.$on("$viewContentLoaded",function(){var b;return b=c.rest.all("task"),b.all("list").getList().then(function(b){return a.task_list=b})}),a.$watch("task_token",function(b){var d;if(b)return d=c.rest.all("task"),d.one(b.qid).get().then(function(b){return a.cur_task=b})})}])}.call(this),function(){"use strict";angular.module("brasFeApp").controller("NavbarCtrl",["$scope","$location",function(a,b){return a.menu=[{title:"Home",link:"/"}],a.isCollapsed=!0,a.isActive=function(a){return a===b.path()}}])}.call(this),angular.module("brasFeApp").run(["$templateCache",function(a){"use strict";a.put("app/dashboard/view/admin/base.html",'<div class=base><a ui-sref=dashboard.admin ng-show=not_in_base()>Back</a></div><div ui-view=box class="admin view"><p>admin panel</p></div>'),a.put("app/dashboard/view/admin/menu.html",'<div class=info><div class=tip>1.選擇欲編輯之菜單&nbsp;<select ng-model=data.edit_role name=roles ng-options="role.name as role.name for role in user.roles"></select></div><ul class=options><li><a ng-click=menu_add() href="">Add</a></li><li><a ng-click=menu_save() href="">Save</a></li><li><a ng-click=menu_cancel_edit() href="">Cancel</a></li></ul></div><div class="half edit_form"><div class=tip>2.點選左方選項編輯</div><form name=menu_item><div class=field><label>名稱</label><input ng-model=data.menu.selected.name></div><div class=field><label>圖示 (參考<a href="http://fortawesome.github.io/Font-Awesome/icons/">命名</a>)</label><input ng-model=data.menu.selected.icon></div><div class=field><label>鏈結</label><input ng-model=data.menu.selected.link></div><div class=field><label>功能描述</label><textarea ng-model=data.menu.selected.desc></textarea></div></form></div><script type=text/ng-template id=menu_item><i ng-click="menu_mark_as_remove(this)" class="fa fa-fw fa-times"></i><i ui-tree-handle="" ng-class="{dragging: this.is_dragging }" class="fa fa-fw fa-arrows"></i><i class="fa fa-fw fa-{{node.icon}}"></i><span>{{node.name}}</span><ol ui-tree-nodes="" ng-model="node.nodes"><li ng-repeat="node in node.nodes" ui-tree-node="" ng-include="\'menu_item\'"></li></ol></script><div ui-tree=data.menuTree class="half menu_tree"><ol id=tree-root ui-tree-nodes="" data-max-depth=5 ng-model=data.menu.serv.raw><li ng-repeat="node in data.menu.serv.raw" ng-click=show_menu_item(this) ng-class="{\'node-selected\': menu_item_selected(node), \'destroy\': node.destroy}" ng-include="\'menu_item\'" ui-tree-node=""></li></ol></div>'),a.put("app/dashboard/view/admin/tasks.html","<div class=cool>Tasks</div><div class=task></div>"),a.put("app/dashboard/view/admin/users.html","<div class=cool>user panel</div><div ng-grid=userGrid class=userGrid></div>"),a.put("app/dashboard/view/base.html",'<div class=db><div class=hide><dashboard></dashboard></div><div class=wrap><header id=header><div id=title><div class="beaver avatar"><img src=/assets/images/3419cf66.beaver128.png></div><h1><a ui-sref=landing>Bebras</a></h1><h2><a ui-sref=landing>國際資訊競賽</a></h2></div><ul id=nav><li></li><li class=user><div class=name><a href=#>{{ user.name || \'小海狸\' }}</a></div><ul class=switches><li ng-show="user.roles.length &gt; 0" class=roles><select ng-model=role ng-options="role.name for role in user.roles"></select></li><li><a href=# ng-click=logout() class=logout>登出</a></li></ul></li><li class=avatar><img src=/assets/images/d58c6515.user_nil.png></li></ul></header><div class=drow><div ui-view=menu class=wg></div><div ui-view=panel class=pan><div class=data><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p><p>aaaaa:a</p></div></div></div></div></div>'),a.put("app/dashboard/view/header.html",'<header id=header><div id=title><div class="beaver avatar"><img src=/assets/images/3419cf66.beaver128.png></div><h1><a ui-sref=landing>Bebras</a></h1><h2><a ui-sref=landing>國際資訊競賽</a></h2></div><ul id=nav><li></li><li class=user><div class=name><a href=#>{{ user.name || \'小海狸\' }}</a></div><ul class=switches><li ng-show="user.roles.length &gt; 0" class=roles><select ng-model=role ng-options="role.name for role in user.roles"></select></li><li><a href=# ng-click=logout() class=logout>登出</a></li></ul></li><li class=avatar><img src=/assets/images/d58c6515.user_nil.png></li></ul></header>'),a.put("app/dashboard/view/manager/base.html","<h1>manager panel {{message}}</h1>"),a.put("app/dashboard/view/menu.html",'<ul class=menu><li ng-repeat="item in data.menu"><a ng-click=menu_click(item) href=""><span title={{item.desc}}>{{ item.name }}</span><i class="fa fa-fw fa-{{item.icon}}"></i></a></li></ul>'),a.put("app/dashboard/view/student/base.html","<h1>studnet panel {{message}}</h1>"),a.put("app/dashboard/view/teacher/base.html",'<!-- teacher panel--><div ui-view=box class="teacher view"></div>'),a.put("app/dashboard/view/teacher/groups.html","<h2>yay</h2>"),a.put("app/dashboard/view/user/base.html","<h1>user panel {{message}}</h1>"),a.put("app/landing/landing.html",'<div class=landing><div class=header><div class=power>Powered By National Taiwan Normal University Department of Computer Science and Information Engineering</div><h1>Bebras</h1><h2><span>國</span><span>際</span><span>B</span><span>e</span><span>b</span><span>r</span><span>a</span><span>s</span><span>測</span><span>驗</span></h2><div ui-view=control ng-class="{dim: dim_bg()}" class=control><div id=nav><ul><li><a du-smooth-scroll=du-smooth-scroll duration=1000 href=#body>測驗介紹</a></li><li><a ui-sref=tasks>開始測驗</a></li><li><a ng-show=!loggedin() ui-sref=session.login>登入<i class="fa fa-flash"></i></a><a ng-show=loggedin() ng-click=logout() href=#>登出<i class="fa fa-coffee"></i></a></li></ul></div></div></div><div id=body ng-class="{dim: dim_bg()}" class=body><div id=intro class=intro><h1>關於Bebras</h1><article class=article><h2>測驗介紹</h2><p>Bebras測驗是一個針對8至18歲（三年級至十二年級）學生的國際資訊潛能測驗，每年於11月中的國際Bebras週（World-Wide Bebras Week）舉行。此測驗的目的旨在激起學生對於資訊學科之興趣，同時了解學生是否俱備學習資訊科學之性向。本測驗利用淺顯易懂的方式呈現題目（tasks），各題皆以情境式的任務呈現，讓學習者利用自己既有的知識進行解題。 Bebras測驗於2004年首次舉行；至2012年止，共有21國的學生參與此測驗，總計超過500,000名學生。臺灣於2012年始加入Bebras測驗。首年加入，參與學生數便為亞洲之冠，且廣受師生好評。 每年年中舉辦的Bebras 研討會，廣邀世界各地的資訊科學學者，研議新題目，並分享該國實施Bebras的成果。研討會結束後，便將編修完成的題目納入Bebras題庫中國際Bebras委員會期望透過此測驗的推廣，增進學校資訊學科之教授及學習品質。</p><h2>測驗目標</h2><p>激發學生對資訊科學之學習興趣 Bebras測驗的目的除了瞭解學生是否俱備學習資訊科學之性向，更希望對學生介紹資訊科學或資訊教育的基本概念，激發他們的學習興趣。利用情境式的題型，讓學生瞭解生活中隨處可見資訊科學概念之運用；而解謎推理的題目述敘方式，更可以提升學生思考動機，並增進學生深層思考的能力。 提升學生利用資訊方法解決問題之能力 Bebras測驗題目包含家庭生活、團體合作、工作情境等。測驗內容多樣化，希望透過題目讓學生了解資訊科學概念在生活中隨處可見，而生活中的許多問題都能透過資訊科學之概念解決。 降低學生對資訊科學之恐懼 Bebras測驗透過巧思，將題目以生活化的方式呈現，讓抽象的資訊科學題目具體化，以日常生活中會碰到的問題呈現，使未曾受過資訊科學教育的學生亦能利用邏輯、推理、運算等能力解題。另一方面，Bebras題目呈現有趣且生動，不論學生是否曾受過資訊科學的訓練，都可以降低其對資訊科學的懼怕感。</p><h2>測驗對象</h2><p>Bebras測驗每年於11月施測一次，受測學生並無特定資格限制，凡是三年級至十二年級之在學學生（年紀約8至18歲），皆能參與。受測學生依年齡分為五組，分別為：Little Beaver、Benjamin、Cadet、Junior及Senior組。每組考題又分難、中、易三種等級。</p><h2>測驗方式</h2><p>測驗以班級為參加單位，利用測驗當週中的一堂課，在學校內即可完成施測。測驗中，學生必須解一連串的題目（task），每一題約耗時三分鐘，每次測驗15題，故測驗時間約45分鐘。 測驗規定學生只能用電腦作答，學生不可利用紙筆解題；因此測驗時須在電腦教室完成，且每一位學生皆備有一台作答電腦。目前全球共有六個不同進行Bebras測驗的系統；臺灣目前使用線上測驗方式，不需額外安裝任何軟體，只要有網路連線即可透過瀏覽器進行測驗。 本測驗的題目設定讓學生可於三分鐘左右完成，題庫中之題型包含單一選擇題、開放作答題、或互動題。互動題即測驗題目中包含的物件可供學生以電腦操作，以利思考；待學生找出答案後，再選擇正確的選項。 每一個年齡組的題目皆包含難、中及易三個難度。每一難度的給分不同，且題目答錯皆會倒扣。因有倒扣計分，避免負分的情形，每次測驗的起始分數為所有倒扣分數的總和，例如：臺灣今年正式測驗的起始分數為60分，滿分為300分，最低分為0分。每次測驗將遴選適合該年齡組的題目，難、中、易各佔總測驗的三分之一。</p></article></div><footer class=footer>2014 &copy; Bebras Taiwan</footer></div></div>'),a.put("app/landing/nav.html",'<div id=nav><ul><li><a du-smooth-scroll=du-smooth-scroll duration=1000 href=#body>測驗介紹</a></li><li><a ui-sref=tasks>開始測驗</a></li><li><a ng-show=!loggedin() ui-sref=session.login>登入<i class="fa fa-flash"></i></a><a ng-show=loggedin() ng-click=logout() href=#>登出<i class="fa fa-coffee"></i></a></li></ul></div>'),a.put("app/task/task.html",'<div class=task><div class=heading><div class=header><select ng-model=task_token ng-options="task.name for task in task_list"><option value="">-- 選擇題目 --</option></select></div><div class=title>2014<a ui-sref=landing>國際Bebras測驗</a></div></div><div class=view><div class=contents><div class=date>題目年份：{{ cur_task.year }}</div><div class=body>題文：<span ng-bind-html=cur_task.body></span></div><div class=quest>問題：<span ng-bind-html=cur_task.quest></span></div></div></div></div>'),a.put("components/form/session/login.html",'<form id=login name=loginform novalidate><label for=school>學校<i ng-show=loadingSclist class="fa fa-spin fa-dot-circle-o"></i></label><input id=school name=moeid typeahead="sc as sc.name for sc in get_school_list($viewValue)" typeahead-persistent=0 typeahead-loading=loadingSclist typeahead-on-select="set_moeid($item, $model, $label)" typeahead-wait-ms=10 placeholder=選擇學校 ng-class="{error: moeid_not_set() &amp;&amp; !loginform.moeid.$pristine}" ng-model=school><p ng-show="moeid_not_set() &amp;&amp; !loginform.moeid.$pristine" class=error><span>必填欄位(請從清單中選擇學校)</span></p><label for=login_alias>賬號</label><input id=login_alias name=login_alias placeholder=學號或Email ng-required=true ng-model=form.login_alias ng-class="{error: loginform.login_alias.$invalid &amp;&amp; !loginform.login_alias.$pristine}" ng-minlength=5 ng-maxlength=32><p ng-show="loginform.login_alias.$invalid &amp;&amp; !loginform.login_alias.$pristine" class=error>賬號格式錯誤</p><label for=password>密碼</label><input type=password placeholder=# name=password ng-required=true ng-model=form.password ng-class="{error: loginform.password.$invalid &amp;&amp; !loginform.password.$pristine}" ng-minlength=8 ng-maxlength=32 class=password><p class=error><span ng-show="loginform.password.$invalid &amp;&amp; !loginform.password.$pristine">密碼至少8個字</span></p><button type=submit ng-disabled=!loginable(loginform) ng-click=login(loginform) class=btn>登入</button><ul class=login><li><button ng-click="auth(\'facebook\')" ng-disabled=form.submitted class="btn facebook">Facebook</button></li><li><button ng-click="auth(\'google\')" ng-disabled=form.submitted class="btn gplus">Google</button></li></ul><ul><li><a ng-click=aquire_new_pw()>重設密碼</a></li><li><a ui-sref=session.register>註冊</a></li><li><a ui-sref=landing>返回</a></li></ul></form>'),a.put("components/form/session/mixin/email.html",""),a.put("components/form/session/mixin/login_alias.html",""),a.put("components/form/session/mixin/name.html",""),a.put("components/form/session/mixin/password.html",""),a.put("components/form/session/mixin/phone.html",""),a.put("components/form/session/mixin/school_typeahead.html",""),a.put("components/form/session/pw_reset.html",'<form id=reset name=resetform><label for=password>密碼</label><input type=password placeholder=# name=password ng-required=true ng-model=form.password ng-class="{error: resetform.password.$invalid &amp;&amp; !resetform.password.$pristine}" ng-minlength=8 ng-maxlength=32 class=password><p class=error><span ng-show="resetform.password.$invalid &amp;&amp; !resetform.password.$pristine">密碼至少8個字</span></p><label for=password_confirmation>確認密碼</label><input type=password placeholder=# name=password_confirmation ng-required=true ng-model=form.password_confirmation ng-class="{error: resetform.password_confirmation.$invalid &amp;&amp; !resetform.password_confirmation.$pristine}" ng-minlength=8 ng-maxlength=32 class=password><p class=error><span ng-show="resetform.password_confirmation.$invalid &amp;&amp; !resetform.password_confirmation.$pristine">密碼至少8個字</span><span ng-show="(form.password != form.password_confirmation) &amp;&amp; !resetform.password_confirmation.$pristine">&nbsp;確認密碼需與密碼相同</span></p><button type=submit ng-disabled=!resetable(resetform) ng-click=reset() class=btn>更新密碼</button><ul><li><a ui-sref=landing>返回</a></li><li><a ui-sref=landing.register>註冊</a></li></ul></form>'),a.put("components/form/session/register.html",'<form id=reg name=regform novalidate><label for=school>學校<i ng-show=loadingSclist class="fa fa-spin fa-dot-circle-o"></i></label><input id=school name=moeid typeahead="sc as sc.name for sc in get_school_list($viewValue)" typeahead-persistent=0 typeahead-loading=loadingSclist typeahead-on-select="set_moeid($item, $model, $label)" typeahead-wait-ms=10 placeholder=選擇學校 ng-required=ng-required ng-class="{error: moeid_not_set() &amp;&amp; !regform.moeid.$pristine}" ng-model=school><p ng-show="moeid_not_set() &amp;&amp; !regform.moeid.$pristine" class=error><span>必填欄位(請從清單中選擇學校)</span></p><label for=email>電郵</label><input id=email type=email name=email placeholder=@ ng-required=true ng-model=form.email ng-class="{error: regform.email.$invalid &amp;&amp; !regform.email.$pristine}" ng-minlength=8 ng-maxlength=32><p ng-show="regform.email.$invalid &amp;&amp; !regform.email.$pristine" class=error>Email 格式錯誤</p><div class=half><label for=name>名字</label><input id=name name=uname placeholder=OOO ng-required=true ng-model=form.name ng-class="{error: regform.uname.$invalid &amp;&amp; !regform.uname.$pristine}" ng-minlength=2 ng-maxlength=8><p ng-show="regform.uname.$invalid &amp;&amp; !regform.uname.$pristine" class=error><span>必填欄位</span><span ng-show=regform.uname.$error.minlength>(太短)</span><span ng-show=regform.uname.$error.maxlength>(太長)</span></p></div><div class=half><label for=phone>電話</label><input id=phone type=phone placeholder=# name=phone ng-model=form.phone ng-pattern="/^[0-9]+$/" ng-class="{error: regform.phone.$invalid &amp;&amp; !regform.phone.$pristine}" ng-minlength=5 ng-maxlength=20><p ng-show="regform.phone.$invalid &amp;&amp; !regform.phone.$pristine" class=error><span>電話格式錯誤</span><span ng-show=regform.phone.$error.minlength>(太短)</span><span ng-show=regform.phone.$error.maxlength>(太長)</span></p></div><input id=role type=checkbox ng-model=form.as_teacher><label for=role>註冊為教師</label><button type=submit ng-disabled=!registerable(regform) ng-click=register(regform) class=btn>註冊</button><ul><li><a ui-sref=session.login>登入</a></li><li><a ui-sref=landing>返回</a></li></ul></form>'),a.put("components/navbar/navbar.html",'<div ng-controller=NavbarCtrl class="navbar navbar-default navbar-static-top"><div class=container><div class=navbar-header><button type=button ng-click="isCollapsed = !isCollapsed" class=navbar-toggle><span class=sr-only>Toggle navigation</span><span class=icon-bar></span><span class=icon-bar></span><span class=icon-bar></span></button><a href="/" class=navbar-brand>bras-fe</a></div><div id=navbar-main collapse=isCollapsed class="navbar-collapse collapse"><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li></ul></div></div></div>')}]);