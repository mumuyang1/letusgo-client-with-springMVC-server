'use strict';

angular.module('letusgoApp')
  .service('CartItemsService', function (localStorageService, $http) {

    this.getCartItems = function (callback) {

      $http.get('/api/cartItems')
        .success(function (data) {

          callback(data);
        });
    };


    this.add = function (item) {

      var cartSums = +localStorageService.get('cartSum');
      cartSums += 1;
      localStorageService.set('cartSum', cartSums);

      $http.put('/api/cartItems/' + item.id, {'operation': 'add'});
      return cartSums;
    };

    this.updateCartSumsWhenReduce = function (cartItems, item) {

      var cartSums = localStorageService.get('cartSum');

      _.forEach(cartItems, function (cartItem) {

        if (cartItem.item.name === item.name) {

          if (cartItem.count > 1) {

            cartSums -= 1;
            localStorageService.set('cartSum', cartSums);
          }
        }
      });
      return localStorageService.get('cartSum');
    };

    this.reduceCartItem = function (item) {

      $http.put('/api/cartItems/' + item.id, {'operation': 'reduce'});
    };

    this.updateCartSumsWhenDelete = function (cartItems, item) {

      var cartSums = localStorageService.get('cartSum');

      _.forEach(cartItems, function (cartItem) {

        if (cartItem.item.id === item.id) {

          cartSums = cartSums - cartItem.count;
          localStorageService.set('cartSum', cartSums);
        }
      });

      return localStorageService.get('cartSum');
    };

    this.deleteCartItem = function (item) {

      $http.put('/api/cartItems/' + item.id, {'operation': 'delete'});
    };

    this.updateCartSumsWhenChange = function(cartItems,item) {

      var cartSums = 0;

      _.forEach(cartItems, function (cartItem) {

          if (cartItem.item.id !== item.item.id) {
               cartSums += cartItem.count;
          }
      });
      localStorageService.set('cartSum', cartSums + parseInt(item.count));
      return localStorageService.get('cartSum');
    };

    this.getSubtotal = function (cartItem) {
      var subtotal = cartItem.item.price * cartItem.count;
      return subtotal.toFixed(2);
    };

    this.getTotal = function (cartItems) {
      var total = 0;
      _.forEach(cartItems, function (cartItem) {
        total += cartItem.item.price * cartItem.count;
      });
      return total.toFixed(2);
    };


    this.pay = function (callback) {
      $http.post('/api/payment')
        .success(function (data, status) {

          if (status === 200) {
            var cartSums = 0;
            localStorageService.set('cartSum', cartSums);
            callback();
          }
        });
    };


    this.set = function (key, value) {
      localStorageService.set(key, value);
    };


    this.get = function (key) {
      return localStorageService.get(key);
    };

  });
