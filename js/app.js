app = angular.module('stockMng', ["firebase"]);
app.controller('appCtrl', ["$scope", "$firebaseObject","$firebaseAuth", function($scope,$firebaseObject,$firebaseAuth,$http) {
    var ref = new Firebase("https://pragathisc.firebaseio.com");
    var membObject = $firebaseObject(ref.child("members"));
    $scope.members = membObject;
    $scope.user={};
    $scope.authObj = $firebaseAuth(ref);
    $scope.user.auth =function(){        
        $scope.authObj.$authWithPassword({
          email: $scope.user.email,
          password: $scope.user.password
      }).then(function(authData) {
           console.log("Logged in as:", authData.uid);
      }).catch(function(error) {
          console.error("Authentication failed:", error);
            $scope.user.error=error;
      });        
    }
    
    ref.onAuth(function(authData) {
        if (authData) {
            $scope.user.authenticated =true;
            //$scope.tab=1;
            //load data            
            console.log(authData.uid.email + " User " + authData.uid + " is logged in with " + authData.provider);
        } else {
            $scope.user.authenticated =false;
            //$scope.tab=1;
            console.log("User is logged out");
        }
    }); 
    
    $scope.addNewMember = function(){ 
        var tempNewMember={"Id": $scope.newMember.Id,"Name":$scope.newMember.Name,"Phone":$scope.newMember.Phone};
        $scope.members[$scope.newMember.Id]=tempNewMember;  
        $scope.members.$save().then(function(ref) {            
            $scope.newMember=emptyMember();
            tempNewMember={};
            alert("Updated");
        }, function(error) {
            alert("Something Went wrong: " , error);
        });
    }
    
    $scope.checkMember=function(membId){
        if($scope.members[membId]){
            $scope.messageCustExist=true; 
        }
        else{
            $scope.messageCustExist=false;
        }
    }
    $scope.editMember= function(membId){
        $scope.messageCustExist=false;
        $scope.newMember=$scope.members[membId];
    }
    
}]);

app.directive('home',function(){
    return{
        restrict: 'E',
        templateUrl: 'templates/home.html'
    }
});
app.directive('member',function(){
    return{
        restrict: 'E',
        templateUrl: 'templates/member.html'
    }
});