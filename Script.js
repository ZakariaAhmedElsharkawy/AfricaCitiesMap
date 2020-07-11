//Creat countriesDDL & citessDDL and Apply Style 
var ButtonsDDLDiv = document.createElement('div');
//countriesDDL & Add Default Options
var countriesDDL = document.createElement('select');
countriesDDL.setAttribute('class', 'esri-component esri-select');
countriesDDL.setAttribute('id', 'select');
var selectedOption = document.createElement('option');
selectedOption.textContent = 'Select Country';
selectedOption.disabled = true;
countriesDDL.appendChild(selectedOption);
countriesDDL.selectedIndex = "0";
var selectedOption2 = document.createElement('option');
selectedOption2.textContent = 'All';
countriesDDL.appendChild(selectedOption2);
//citessDDL
var citessDDL = document.createElement('select');
citessDDL.setAttribute('class', 'esri-component esri-select');
citessDDL.setAttribute('id', 'select');
//Get panelBottom Elements
var countryNameHtml = document.getElementById("counter0");
var countryPOPHtml = document.getElementById("counter1");
var cityNameHtml = document.getElementById("counter2");
var cityPOPHtml = document.getElementById("counter3");
var cityAreaHtml = document.getElementById("counter4");

// country class
function country(countryname, cites, pop) {
    this.countryname = countryname;
    this.cites = cites;
    this.pop = pop;
}
//City Class
function city(cityname, pop, area) {
    this.cityname = cityname;
    this.pop = pop;
    this.area = area;
}
var countries = [];

require(
    [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/widgets/BasemapGallery",
        "esri/widgets/Expand",
        "esri/widgets/Home",
        "esri/Viewpoint",
        "esri/widgets/Legend",
        "esri/request"
    ],
    function(Map, MapView, FeatureLayer, BasemapGallery, Expand, Home, Viewpoint, Legend, esriRequest) {
        // Cities Layer Popup Template
        var template = {
            title: "{CNTRY_NAME}, {CITY_NAME}",
            content: [{
                type: "fields",
                fieldInfos: [{
                        fieldName: "POP",
                        label: "Population",
                        format: {
                            digitSeparator: true,
                            places: 0
                        }
                    },
                    {
                        fieldName: "POP_CLASS",
                        label: "Population Class",
                    },
                    {
                        fieldName: "SQKM",
                        label: "City Area (sq.km)",
                        format: {
                            digitSeparator: true,
                            places: 0
                        }
                    },

                ]
            }]
        };
        // Cities Layer Popup Renderers
        var citesRenderer = {
            type: "class-breaks",
            field: "POP",
            legendOptions: {
                title: "City Population"
            },
            classBreakInfos: [{
                minValue: -1000,
                maxValue: 50000,
                label: "< 50000",
                symbol: {
                    type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                    url: "https://static.arcgis.com/images/Symbols/Firefly/FireflyA11.png",
                    width: "24px",
                    height: "24px",
                }
            }, {
                minValue: 50000,
                maxValue: 250000,
                label: "50000-250000",
                symbol: {
                    type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                    url: "https://static.arcgis.com/images/Symbols/Firefly/FireflyB6.png",
                    width: "24px",
                    height: "24px",
                }
            }, {
                minValue: 250000,
                maxValue: 1000000,
                label: "250000-1000000",
                symbol: {
                    type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                    url: "https://static.arcgis.com/images/Symbols/Firefly/FireflyB18.png",
                    width: "24px",
                    height: "24px",
                }
            }, {
                minValue: 1000000,
                maxValue: 100000000,
                label: "> 1000000",
                symbol: {
                    type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                    url: "https://static.arcgis.com/images/Symbols/Firefly/FireflyC20.png",
                    width: "24px",
                    height: "24px",
                }
            }]
        };
        var citesRendererAtCountryZoom = {
            type: "class-breaks",
            field: "POP",
            legendOptions: {
                title: "City Population"
            },
            classBreakInfos: [{
                minValue: -1000,
                maxValue: 50000,
                label: "< 50000",
                symbol: {
                    type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                    url: "https://static.arcgis.com/images/Symbols/Firefly/FireflyA11.png",
                    width: "48px",
                    height: "48px",
                }
            }, {
                minValue: 50000,
                maxValue: 250000,
                label: "50000-250000",
                symbol: {
                    type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                    url: "https://static.arcgis.com/images/Symbols/Firefly/FireflyB6.png",
                    width: "48px",
                    height: "48px",
                }
            }, {
                minValue: 250000,
                maxValue: 1000000,
                label: "250000-1000000",
                symbol: {
                    type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                    url: "https://static.arcgis.com/images/Symbols/Firefly/FireflyB18.png",
                    width: "48px",
                    height: "48px",
                }
            }, {
                minValue: 1000000,
                maxValue: 100000000,
                label: "> 1000000",
                symbol: {
                    type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                    url: "https://static.arcgis.com/images/Symbols/Firefly/FireflyC20.png",
                    width: "48px",
                    height: "48px",
                }
            }]
        };
        var citesRendererAtCityZoom = {
            type: "unique-value",
            field: "CITY_NAME",
            defaultSymbol: {
                type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                url: "https://static.arcgis.com/images/Symbols/Firefly/FireflyA11.png",
                width: "48px",
                height: "48px",
            },
            legendOptions: {
                title: "City"
            },
            uniqueValueInfos: [{
                    value: "CityName",
                    symbol: {
                        type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                        url: "https://static.arcgis.com/images/Symbols/Firefly/FireflyC20.png",
                        width: "150px",
                        height: "150px",
                    }
                },

            ]
        };
        // Cities layer label classes
        const cityLabelClass = {

            symbol: {
                type: "text",
                color: "white",
                font: {
                    size: 8,
                    weight: "bold"
                },
                haloSize: 1,
                haloColor: "black"
            },
            labelPlacement: "below-center",
            labelExpressionInfo: {
                expression: "$feature.CITY_NAME"
            },
            maxScale: 0,
            minScale: 25000000,
        };

        const cityLabelClassAtZoom = {

            symbol: {
                type: "text",
                color: "yellow",
                font: {
                    size: 14,
                    weight: "bold"
                },
                haloSize: 2,
                haloColor: "black"
            },
            labelPlacement: "below-center",
            labelExpressionInfo: {
                expression: "$feature.CITY_NAME"
            },
            maxScale: 0,
            minScale: 25000000,

        };
        // Countries layer label class
        const countryLabelClass = {
            symbol: {
                type: "text",
                color: "white",
                font: {
                    size: 9,
                    weight: "bold"
                },
                haloSize: 1,
                haloColor: "black"
            },
            // labelPlacement: "above-after",
            labelExpressionInfo: {
                expression: "$feature.NAME"
            },
            maxScale: 30000000,
            minScale: 0,

        };

        // Define Cities Layer
        const citiesLayer = new FeatureLayer({
            // URL to the service
            url: "https://services8.arcgis.com/zNrTBuYXV2f35M0U/arcgis/rest/services/Africa%20Cities/FeatureServer/0",
            popupTemplate: template,
            renderer: citesRenderer,
            minScale: 0,
            maxScale: 0,
            labelingInfo: cityLabelClass
        });

        // Define Countries Layer
        const countriesLayer = new FeatureLayer({
            // URL to the service
            url: "https://services8.arcgis.com/zNrTBuYXV2f35M0U/arcgis/rest/services/Africa_Countries/FeatureServer",
            legendEnabled: false,
            opacity: 0.1,
            labelingInfo: countryLabelClass
        });

        // Map
        var map = new Map({
            basemap: "dark-gray-vector",
            layers: [countriesLayer, citiesLayer]
        });

        //Map View
        var view = new MapView({
            container: "viewDiv",
            map: map,

        });
        //remove Base Map Refrence layer from all base maps
        view.on("layerview-create", function(event) {
            map.basemap.referenceLayers.items[0].visible = false;
        });
        //BaseMAp Gallery
        var basemapGallery = new BasemapGallery({
            view: view,
            container: document.createElement("div")
        });
        //BaseMap Gallery Expand Widget
        var bgExpand = new Expand({
            view: view,
            content: basemapGallery.domNode,
            expandIconClass: "esri-icon-basemap",
            expandTooltip: "Base Map Gallery"
        });
        // Add the expand instance to the ui
        view.ui.add(bgExpand, "top-left");
        //Home Widget
        countriesLayer.when(function() {
            view.extent = countriesLayer.fullExtent
            var homeWidget = new Home({
                view: view,
                viewpoint: new Viewpoint({
                    targetGeometry: countriesLayer.fullExtent
                })
            });
            view.ui.add(homeWidget, "top-left");
        });
        // Define Map Legend
        const legend = new Legend({
            view: view,
            layerInfos: [{
                layer: citiesLayer,
                title: "Africa Cites"
            }]
        });
        view.ui.add(legend, "bottom-left");
        ////  Extract Layer Data Using Esri Request

        //City
        var cityUrl = citiesLayer.url + "/0/query"
        var cityOpt = {
                query: {
                    where: "1=1",
                    f: "json",
                    outfields: "CNTRY_NAME,CITY_NAME,POP,SQKM"
                }
            }
            //Country
        var countryUrl = countriesLayer.url + "/0/query"
        var countryOpt = {
            query: {
                where: "1=1",
                f: "json",
                outfields: "NAME,TOTPOP"
            }
        }

        //add Data to country & City classes
        esriRequest(cityUrl, cityOpt).then(function(result) {
            for (let i = 0; i < result.data.features.length; i++) {
                if (!countries.map(function(country) { return country.countryname }).includes(result.data.features[i].attributes.CNTRY_NAME)) {
                    var ciites = result.data.features
                        .filter(function(element) { return element.attributes.CNTRY_NAME === result.data.features[i].attributes.CNTRY_NAME })
                        .map(function(country) { return new city(country.attributes.CITY_NAME, country.attributes.POP, country.attributes.SQKM) })
                        .sort((a, b) => (a.cityname > b.cityname) ? 1 : -1);

                    countries.push(new country(result.data.features[i].attributes.CNTRY_NAME, ciites));
                }
            }
            countries.sort((a, b) => (a.countryname > b.countryname) ? 1 : -1).forEach(element => {
                var option = document.createElement("option");
                option.id = element.countryname;
                option.textContent = element.countryname;
                countriesDDL.appendChild(option);
            });
            esriRequest(countryUrl, countryOpt).then(function(countryResult) {
                countries.forEach(country => {
                    country.pop = countryResult.data.features
                        .filter(function(f) { return f.attributes.NAME === country.countryname })
                        .map(function(f) { return f.attributes.TOTPOP })[0];
                });
            });
        });

        //add DDL buttons to top right location
        var topRightWidgetDiv = document.querySelector("#viewDiv > div.esri-view-root > div.esri-ui > div.esri-ui-inner-container.esri-ui-corner-container > div.esri-ui-top-right.esri-ui-corner");
        ButtonsDDLDiv.appendChild(countriesDDL);
        ButtonsDDLDiv.appendChild(citessDDL);
        citessDDL.style.display = "none"
        topRightWidgetDiv.appendChild(ButtonsDDLDiv);

        var currentCountry;
        var currentCountryZoom;
        // Add actions for countriesDDL
        countriesDDL.addEventListener('change', function() {
            currentCountry = this.value;
            if (currentCountry === "All") {
                //Reset and Hide citessDDL
                citessDDL.innerHTML = ``;
                citessDDL.style.display = "none";
                //Reset citiesLayer & countriesLayer definitionExpression
                citiesLayer.definitionExpression = null;
                countriesLayer.definitionExpression = null;
                //Empty panel Bottom data
                countryNameHtml.textContent = "";
                countryPOPHtml.textContent = "";
                cityNameHtml.textContent = "";
                cityPOPHtml.textContent = "";
                cityAreaHtml.textContent = "";
                //Apply citiesLayer Renderer and Label
                citiesLayer.renderer = citesRenderer;
                citiesLayer.labelingInfo = cityLabelClass;
                countriesLayer.opacity = 0.1;
                //Zoom to all Africa
                countriesLayer.queryExtent().then(function(e) {
                    view.goTo({ target: e.extent }, { duration: 1500 })
                })
            } else {
                //Reset and Set Default Options 
                citessDDL.innerHTML = ``;
                var selectedOption1 = document.createElement('option');
                selectedOption1.textContent = 'Select City';
                selectedOption1.disabled = true;
                citessDDL.appendChild(selectedOption1)
                var selectedOption2 = document.createElement('option');
                selectedOption2.textContent = 'All';
                citessDDL.appendChild(selectedOption2);
                citessDDL.selectedIndex = "0";
                //Fill panel Bottom Country data
                countryNameHtml.textContent = currentCountry;
                var countryPOP = countries.filter(function(e) { return e.countryname == currentCountry })[0].pop;
                countryPOPHtml.textContent = countryPOP != undefined ? countryPOP : "N/A";
                // Reset panel Bottom City data
                cityNameHtml.textContent = "";
                cityPOPHtml.textContent = "";
                cityAreaHtml.textContent = "";
                //Zoom to the Current Country
                CountryZoom(currentCountry);
                //Set citessDDL Options
                var cites = countries.filter(function(e) { return e.countryname == currentCountry })[0]
                    .cites.map(function(c) { return c.cityname });
                for (let i = 0; i < cites.length; i++) {
                    var option = document.createElement("option");
                    option.id = cites[i];
                    option.textContent = cites[i];
                    citessDDL.appendChild(option);
                }
                citessDDL.style.display = "initial"
            }
        })

        // Add actions for citessDDL
        citessDDL.addEventListener('change', function() {
            currentCity = this.value;
            if (currentCity === "All") {
                //Zoom to The Current Country
                CountryZoom(currentCountry);
                // Reset panel Bottom City data
                cityNameHtml.textContent = "";
                cityPOPHtml.textContent = "";
                cityAreaHtml.textContent = "";
            } else {
                //Fill panel Bottom City data
                cityNameHtml.textContent = currentCity;
                var cityPOP = countries.filter(function(e) { return e.countryname == currentCountry })[0]
                    .cites.filter(function(e) { return e.cityname == currentCity })[0].pop;
                cityPOPHtml.textContent = cityPOP > 0 ? cityPOP : "N/A";
                cityAreaHtml.textContent = countries.filter(function(e) { return e.countryname == currentCountry })[0]
                    .cites.filter(function(e) { return e.cityname == currentCity })[0].area;
                //Add Label Style for the Zoomed City and Renderer
                cityLabelClassAtZoom.where = "CITY_NAME = '" + currentCity + "'";
                citiesLayer.labelingInfo = cityLabelClassAtZoom;
                citesRendererAtCityZoom.uniqueValueInfos[0].value = currentCity;
                citiesLayer.renderer = citesRendererAtCityZoom;
                //Zoom to the selected City
                citiesLayer.queryExtent({ where: "CITY_NAME = '" + currentCity + "' AND CNTRY_NAME = '" + currentCountry + "'" })
                    .then(function(e) {
                        view.goTo({
                            target: e.extent,
                            zoom: currentCountryZoom + 2
                        }, {
                            duration: 1500
                        });
                    })
            }
        })

        //Country Zoom Function
        function CountryZoom(countryName) {

            citiesLayer.definitionExpression = "CNTRY_NAME='" + countryName + "'";
            citiesLayer.renderer = citesRendererAtCountryZoom;
            citiesLayer.labelingInfo = cityLabelClass;
            countriesLayer.definitionExpression = "NAME='" + countryName + "'";
            countriesLayer.queryFeatureCount().then(function(numFeatures) {
                if (numFeatures > 0) {
                    countriesLayer.queryExtent().then(function(e) {
                        view.goTo({
                            target: e.extent
                        }, {
                            duration: 1500
                        }).then(function() {
                            currentCountryZoom = view.zoom;
                            countriesLayer.opacity = 0.4;
                        });
                    });

                } else {
                    citiesLayer.queryExtent().then(function(e) {
                        view.goTo({
                            target: e.extent
                        }, {
                            duration: 1500
                        }).then(function() {
                            countriesLayer.opacity = 0.4;
                            currentCountryZoom = view.zoom;
                        });
                    });

                }
            });

        }

    });