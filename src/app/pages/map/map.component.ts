import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ReportService } from 'src/app/services/report.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";

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
  currentReport: any;
  modalReference: any;
  closeResult: string;
  imageToShow: any;
  isImageLoading = false;

  constructor(private reportService : ReportService,private modalService: NgbModal
    , private toastr : ToastrService) {}

  @ViewChild('report_details_modal') reportDetailsModal : TemplateRef<any>;

  /**
   * Créer une image à partir d'un fichier obtenu à partir d'une requête HTTP
   * @param image Reponse HTTP
   */
   createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
        "load",
        () => { this.imageToShow = reader.result; },
        false
    );

    if (image) { reader.readAsDataURL(image); }
  }

  /**
   * Avoir le photo d'un signalement
   * @param idReport ID su signalement
   */
  getImageFromService(idReport) {
    this.isImageLoading = true;
    this.reportService.getImage(idReport).subscribe(
      data => {
        this.createImageFromBlob(data);
        this.isImageLoading = false;
      },
      error => {
        this.isImageLoading = false;
        console.log(error);
      }
    );
  }

  /**
   * Changer le status d'un signalement
   */
  changeReportStatus(status: string) {
    this.reportService.changeReportStatus(this.currentReport.id, status)
    .subscribe(
      (response) => {
        this.toastr.success(
          '<span class="tim-icons icon-check-2" [data-notify]="icon"></span> Signalement mis à jour avec succès',
          '',
          {
            enableHtml: true,
            closeButton: false,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: 'toast-top-center'
          }
        );
        this.modalReference.close();
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          '<span class="tim-icons icon-alert-circle-exc" [data-notify]="icon"></span> Echec du changement de status',
          '',
          {
            enableHtml: true,
            closeButton: false,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: 'toast-top-center'
          }
        );
      }
    );
  }

  ngOnInit() {

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

        // Afficher le détails du signalement dans une autre page
        // si le marqeur sur le map est cliqué
        marker.addListener('click', () => {
          this.getImageFromService(this.reports[i].id);
          this.displayReportDetails(i);
        });
      }

      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );


  }

  /**
   * Ouvrir le modal pour afficer les détails d'un signalement
   * @param index Indice du signalement au tableau des signalements
   */
  private displayReportDetails(index : number) {
    this.currentReport = this.reports[index];
    this.open( this.reportDetailsModal );
  }

  private open(content) {
    this.modalReference = this.modalService.open(content, {centered: false, size: 'md'});
    this.modalReference.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
