global._$ = jQuery;
var Users = require('./model/users');
var Class = require('./model/class');
var Score = require('./model/score');

var app = angular.module('wapp', ['ngRoute']);

//配置路由
app.config(['$routeProvider', function($routeProvider){
    //定义路由
    $routeProvider
        .when('/', { templateUrl: '../view/stu.html', controller: 'StuCtrl' })
        .when('/stu', { templateUrl: '../view/stu.html', controller: 'StuCtrl' })
        .when('/sco', { templateUrl: '../view/sco.html', controller: 'ScoCtrl' })
        .when('/rep', { templateUrl: '../view/rep.html', controller: 'RepCtrl' })
        .otherwise({ redirectTo: '/' });

}]);

//添加学生控制器
app.controller('StuCtrl', ['$scope', function($scope){

    show();

    $scope.submit = function(){
        var name = $scope.name;

        if(name != null && name.length != 0){
            Users.addStu(name, function(err, info){
                show();
            });
        }
    };

    function show(){
        Users.getStuList(function(err, stus){
            $scope.stus = stus;

            //这句代码很重要，你可以尝试不添加这句看看效果
            $scope.$apply();
        });
    };
}]);

//添加分数控制器
app.controller('ScoCtrl', ['$scope', function($scope){
    //读取学生
    Users.getStuList(function(err, stus){
        $scope.stus = stus;

        $scope.$apply();
    });

    //读取科目
    Class.getClass(function(err, classes){
        $scope.clas = classes;
    });

    //选择学生
    $scope.shows = function(name){
        $scope.stuname = name;
    };

    //选择科目
    $scope.showc = function(name){
        $scope.claname = name;
    };

    var scores = [];
    //暂存数据
    $scope.addlist = function(){
        if($scope.stuname != null && $scope.claname != null && $scope.score != null){
            scores[scores.length] = {
                stuname: $scope.stuname,
                claname: $scope.claname,
                score: $scope.score
            };

            $scope.scores = scores;
        }
    };

    //添加数据库到数据库
    $scope.submit = function(){
        if(scores.length > 0){
            Score.addScore(scores, function(err, info){
                //清空数组
                scores.length = 0;
                $scope.stuname = "";
                $scope.claname = "";
                $scope.score = "";
                $scope.$apply();
            });
        }
    };
}]);

//图表控制器
app.controller('RepCtrl', ['$scope', function($scope){

}]);