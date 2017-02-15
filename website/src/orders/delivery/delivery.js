(function () {
    'use strict';
    /**
     * @function FeaturedBrandsController
     * @desc Controller to load the brands from Catalog service or search service
     * @param  {Object} CatalogService catalog service
     * @param  {Object} SearchService search service
     * @param  {Object} BrandingModel Branding Model service
     * @param  {const} UTILS_CONSTANT used to go search state based on selected brand
     * @param  {const} DISPLAY_SIZES display size
     * @param  {Object} URLUtils util to validate the image url
     * @param  {Object} UtilityService Utility Service
     * @param  {Object} _ Lodash lodash
     */
    function DeliveryController(CommonService, BikeEnabledService, BussinessService, ProductService, UtilityService, _, OrderService, ModalUtility, $q, $scope, AddressService) {
        var deliveryCtrl = this;
        var KEYS = {
            PICK: 'Recoger',
            USER: 'Usuario',
            BIKE: 'Moto'
        };

        /**
         * @function $onInit
         * @memberOf FeaturedBrandsController
         * @desc Initializes controller and brands from featured Brands or catalog brands
         * @author Arturo Aguilar
         */
        function $onInit() {
            deliveryCtrl.searchText = '';
            deliveryCtrl.searchableAddress = [];
            deliveryCtrl.userEnable = false;
            deliveryCtrl.bikeEnable = false;
            deliveryCtrl.selectedStep = {};
            deliveryCtrl.todayBikes = [];
            deliveryCtrl.userTitle = 'Datos Usuario';
            deliveryCtrl.number = '';

            deliveryCtrl.steps = [
                {
                    title: KEYS.PICK,
                    content: 'fa fa-road',
                    number: '1',
                    selected: true,
                    validated: false
                },
                {
                    title: KEYS.USER,
                    content: 'fa fa-user',
                    number: '2',
                    selected: false,
                    validated: false
                },
                {
                    title: KEYS.BIKE,
                    content: 'fa fa-motorcycle',
                    number: '4',
                    selected: false,
                    validated: false
                }
            ];

            initializeNewOrder();

            deliveryCtrl.selectedStep = deliveryCtrl.steps[0];
            BikeEnabledService.getTodayAvaliableWithouOrder().then(loadTodayBikes);
            AddressService.getSearchable().then(loadSearchableBuss);
        }

        function loadSearchableBuss(response) {
            deliveryCtrl.searchableAddress = response;
        }

        function initializeNewOrder() {

            deliveryCtrl.order = {
                id: '',
                client: {
                    id: 0,
                    phones: [],
                    name: '',
                    nit: '',
                    lastName: '',
                    imageUrl: '',
                    addresses: []
                },
                orderProducts: [],
                orderDelivery: {
                    id: '',
                    identifier: '',
                    deliveryAddress: {
                        id: '',
                        location: '',
                        date: '',
                        direction: '',
                        displayMap: false
                    },
                    note: ''
                },
                bike: {}
            };
        }


        function loadUser(response) {
            deliveryCtrl.order.client = response;
        }

        function searchUser(number) {
            console.log('search User', number);
            if (_.isNull(number)) {
                return;
            }

            if (!_.isEmpty(number.toString())) {
                CommonService.getUserByPhone(number).then(loadUser);
            }
        }

        function loadTodayBikes(response) {
            var bikes = [];

            function filterBikes(regBike) {
                bikes.push(regBike.bike);
            }
            _.forEach(response, filterBikes);
            deliveryCtrl.todayBikes = bikes;
        }

        function selectAddressChange() {
            deliveryCtrl.order.deliveryAddress = UtilityService.getSelected(deliveryCtrl.order.client.addresses);
            if (!_.isUndefined(deliveryCtrl.order.deliveryAddress)) {
                if (!_.isEmpty(deliveryCtrl.order.deliveryAddress.location)) {
                    validateStep(KEYS.USER, true);
                }
            }
        }

        function validateStep(key, selected) {
            function findStep(item) {
                return item.title === key;
            }
            var step = _.find(deliveryCtrl.steps, findStep);
            step.validated = selected;
        }

        function isStepsValidated() {
            var validated = true;
            function verifyStep(step) {
                validated = step.validated;
                return validated;
            }
            _.forEach(deliveryCtrl.steps, verifyStep);

            return validated;
        }

        function onlyBikeIsNotValidated() {
            var validated = true;
            function verifyStepIgnoringBike(step) {
                if (step.title !== KEYS.BIKE) {
                    validated = step.validated;
                }
                return validated;
            }
            _.forEach(deliveryCtrl.steps, verifyStepIgnoringBike);

            return validated;
        }

        function saveOrder() {
            var deferred = $q.defer();
            function closemod(option) {
                if (option === okeyKey) {
                    deferred.resolve(OrderService.saveOrder(deliveryCtrl.order));
                }
            }
            if (isStepsValidated()) {
                deferred.resolve(OrderService.saveOrder(deliveryCtrl.order));
            } else if (onlyBikeIsNotValidated()) {
                var okeyKey = 'Guardar Orden sin moto';
                var modResult = ModalUtility.openAskOrderWithoutBikeModal(okeyKey);
                modResult.result.then(closemod);
            } else {
                ModalUtility.openVerifyOrdenData();
                deferred.reject();
            }

            return deferred.promise;
        }

        function selectionBikeChange() {
            function findSelectedBike(bike) {
                return bike.selected;
            }
            var bike = _.find(deliveryCtrl.todayBikes, findSelectedBike);
            deliveryCtrl.order.bike = bike;
            validateStep(KEYS.BIKE, !_.isUndefined(bike));
        }

        function searchBusinessChange() {
            console.log('text', deliveryCtrl.searchBussinesText);
        }

        function onDirectionChange() {
            console.log('direction change', deliveryCtrl.order.orderDelivery);

            if (_.isNil(deliveryCtrl.order.orderDelivery)) {
                validateStep(KEYS.PICK, false);
                return;
            }
            validateStep(KEYS.PICK, !_.isEmpty(deliveryCtrl.order.orderDelivery.deliveryAddress.direction));
        }

        deliveryCtrl.$onInit = $onInit;
        deliveryCtrl.searchUser = searchUser;
        deliveryCtrl.selectAddressChange = selectAddressChange;
        deliveryCtrl.saveOrder = saveOrder;
        deliveryCtrl.selectionBikeChange = selectionBikeChange;
        deliveryCtrl.searchBusinessChange = searchBusinessChange;
        deliveryCtrl.onDirectionChange = onDirectionChange;
    }
    angular
        .module('EasyBikeApp.Orders')
        .controller('DeliveryController', DeliveryController);
})();
