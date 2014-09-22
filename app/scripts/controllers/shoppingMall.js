'use strict';

angular.module('letusgoApp')
    .controller('ShoppingMallCtrl', function ($scope,CartItemService,ItemsService, categoryManageService) {

        $scope.$emit('to-parent-shoppingMallActive');

        ItemsService.getItems(function(data){

          _.forEach(data,function(item){

             categoryManageService.getCategoryById(item.categoryId ,function(category){
               item.category = category;
               $scope.items = data;
            });
          });
        });

    });
