(function () {
    'use strict';


    function BusinessController(BussinessService) {
        var busCtrl = this;

        /**
         * @function $onInit
         * @memberOf FeaturedBrandsController
         * @desc Initializes controller and brands from featured Brands or catalog brands
         * @author Arturo Aguilar
         */
        function $onInit() {
            BussinessService.getBusinesses().then(loadBusiness);
        }

        function loadBusiness(response) {
            busCtrl.businesses = response;
        }


        busCtrl.$onInit = $onInit;
    }
    angular
        .module('EasyBikeApp.Business')
        .controller('BusinessController', BusinessController);
})();
