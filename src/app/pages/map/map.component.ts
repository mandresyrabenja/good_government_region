import { RegionService } from './../../services/regionservice';
import { Component, OnInit } from "@angular/core";
import { ReportService } from 'src/app/services/report.service';
import { HttpErrorResponse } from '@angular/common/http';

declare const google: any;

interface Marker {
lat: number;
lng: number;
label?: string;
draggable?: boolean;
}

@Component({
  selector: "app-map",
  templateUrl: "map.component.html"
})
export class MapComponent implements OnInit {
  reports : any[] = [];

  constructor(private reportService : ReportService) {}

  ngOnInit() {

    function addInfoWindow(map, marker, message) {
        var infoWindow = new google.maps.InfoWindow({
            content: message
        });

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(map, marker);
        });
    }

    // Signalements de cet région
    this.reportService.getRegionReports().subscribe(
      (response : any[]) => {
        this.reports = response;

        // Config du map
        var mapCenter = new google.maps.LatLng(-18.900936497140908, 47.53392607592775);
        var mapOptions = {
          zoom: 7,
          center: mapCenter,
          // scrollwheel: false,
          styles: [{
              "elementType": "geometry",
              "stylers": [{
                "color": "#1d2c4d"
              }]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [{
                "color": "#8ec3b9"
              }]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [{
                "color": "#1a3646"
              }]
            },
            {
              "featureType": "administrative.country",
              "elementType": "geometry.stroke",
              "stylers": [{
                "color": "#4b6878"
              }]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [{
                "color": "#64779e"
              }]
            },
            {
              "featureType": "administrative.province",
              "elementType": "geometry.stroke",
              "stylers": [{
                "color": "#4b6878"
              }]
            },
            {
              "featureType": "landscape.man_made",
              "elementType": "geometry.stroke",
              "stylers": [{
                "color": "#334e87"
              }]
            },
            {
              "featureType": "landscape.natural",
              "elementType": "geometry",
              "stylers": [{
                "color": "#023e58"
              }]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [{
                "color": "#283d6a"
              }]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [{
                "color": "#6f9ba5"
              }]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.stroke",
              "stylers": [{
                "color": "#1d2c4d"
              }]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry.fill",
              "stylers": [{
                "color": "#023e58"
              }]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [{
                "color": "#3C7680"
              }]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [{
                "color": "#304a7d"
              }]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [{
                "color": "#98a5be"
              }]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.stroke",
              "stylers": [{
                "color": "#1d2c4d"
              }]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [{
                "color": "#2c6675"
              }]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.fill",
              "stylers": [{
                "color": "#9d2a80"
              }]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [{
                "color": "#9d2a80"
              }]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [{
                "color": "#b0d5ce"
              }]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.stroke",
              "stylers": [{
                "color": "#023e58"
              }]
            },
            {
              "featureType": "transit",
              "elementType": "labels.text.fill",
              "stylers": [{
                "color": "#98a5be"
              }]
            },
            {
              "featureType": "transit",
              "elementType": "labels.text.stroke",
              "stylers": [{
                "color": "#1d2c4d"
              }]
            },
            {
              "featureType": "transit.line",
              "elementType": "geometry.fill",
              "stylers": [{
                "color": "#283d6a"
              }]
            },
            {
              "featureType": "transit.station",
              "elementType": "geometry",
              "stylers": [{
                "color": "#3a4762"
              }]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{
                "color": "#0e1626"
              }]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [{
                "color": "#4e6d70"
              }]
            }
          ]
      };
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      map.setMapTypeId('satellite');

      // Marquer des signalements sur la carte
      for(let i = 0; i < this.reports.length; i++) {

        // Coleur du marquer suivant le status du signalement
        // Vert: fini
        // Bleu: En cours de traitement
        // Rouge: Nouveau
        var reportIcon = '';
        if( this.reports[i].status == 'new' )
          reportIcon = './assets/img/marker-red-icon.png';
        else if( this.reports[i].status == 'processing' )
          reportIcon = './assets/img/marker-blue-icon.png';
        else if( this.reports[i].status == 'done' )
          reportIcon = './assets/img/marker-green-icon.png';


        // Ajout du point au map
        let latLng = new google.maps.LatLng(this.reports[i].latitude, this.reports[i].longitude);
        let marker = new google.maps.Marker({
            position: latLng,
            icon: reportIcon,
            title: this.reports[i].title
        });
        marker.setMap(map);

        // Infos minimale du signalement
        let contentString =
          "<div class=\"text-info\">" + this.reports[i].title + "</div>" +
          "<div>" +
              this.reports[i].description +
          "</div>"
        let infowindow = new google.maps.InfoWindow({
          content: contentString,
        });

        //Affichage des infos minimale du signalement seulement quand le souris passe
        marker.addListener("mouseover", () => {
          infowindow.open({
            anchor: marker,
            map,
            shouldFocus: false,
          });
        });
        marker.addListener('mouseout', function() {
          infowindow.close();
      });
      }

      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );


  }
}
