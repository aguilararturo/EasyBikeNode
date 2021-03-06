(function () {
    'use strict';

    function OrderService($log, $http, $q, BASE_URL, requestService) {
        $http.defaults.headers.common.Accept = 'text/plain';
        $http.defaults.headers.common['Content-Type'] = 'application/json';

        var orderURL = BASE_URL + '/Order';


        function saveOrder(Product) {
            return $http.post(orderURL, Product);
        }

        function getTodayInTransit() {
            return $http.get(orderURL + '/GetTodayInTransit')
                .then(requestService.successRequest)
                .catch(requestService.errorLoadingScripts('GetTodayInTransit'));
        }

        function deliverOrder(order) {
            return $http.post(orderURL + '/DeliverOrder', order);
        }

        function setBike(order) {
            return $http.post(orderURL + '/SetBike', order);
        }
        function getOrders() {
            return $http.get(orderURL)
                .then(requestService.successRequest)
                .catch(requestService.errorLoadingScripts('getOrders'));
        }

        return {
            saveOrder: saveOrder,
            setBike: setBike,
            getTodayInTransit: getTodayInTransit,
            deliverOrder: deliverOrder,
            getOrders: getOrders
        };
    }

    angular
        .module('EasyBikeApp.Services')
        .service('OrderService', OrderService);
})();
