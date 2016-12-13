(function () {
    'use strict';

    function BikeEnabledService($log, $http, $q, BASE_URL, requestService) {
        $http.defaults.headers.common.Accept = 'text/plain';
        $http.defaults.headers.common['Content-Type'] = 'application/json';

        var BikeRegisterURL = BASE_URL + '/BikeRegister';

        function getTodayBikes() {
            return $http.get(BikeRegisterURL + '/GetTodayAvaliable')
                .then(requestService.successRequest)
                .catch(requestService.errorLoadingScripts('GetTodayAvaliable bikes'));
        }

        function saveBikeRegister(bike) {
            return $http.post(BikeRegisterURL, bike);
        }

        function disableBikeRegister(bike) {
            var url = BikeRegisterURL + '/Disable';
            return $http.put(url, bike);
        }

        return {
            disableBikeRegister: disableBikeRegister,
            getTodayBikes: getTodayBikes,
            saveBikeRegister: saveBikeRegister
        };
    }

    angular
        .module('EasyBikeApp.Services')
        .service('BikeEnabledService', BikeEnabledService);
})();