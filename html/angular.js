angular.module('weatherNews', [])
.controller('MainCtrl', [
 '$scope',
  function($scope){
      $scope.test = "Hellow world!";
      $scope.post = [
      	{title:'Post 1', upvotes: 5},
	{title:'Post 2', upvotes: 6},
	{title: 'Post 3', upvotes: 7}
	];
      $scope.addPost = function(){
	$scope.post.push({title:$scope.formContent, upvotes:0});
	$scope.formContent= '';
	};
	$scope.incrementUpvotes = function(post){
		post.upvotes += 1;
	};
  }
]);

