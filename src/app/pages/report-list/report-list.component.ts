import { Report } from './../../interface/report';
import { ReportService } from 'src/app/services/report.service';
import { ToastrService } from 'ngx-toastr';
import { RegionService } from './../../services/regionservice';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { Region } from 'src/app/interface/region';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html'
})
export class ReportListComponent implements OnInit {
  regions : any[];
  actualRegion : any;
  modalReference: any;
  closeResult: string;
  currentPage : number = 0;
  pageNumber : number;
  reports : any[] = [];
  currentReport: any;
  imageToShow: any;
  isImageLoading = false;
  reportCategories: string [] = [];
  noReportFound: boolean = false;


  constructor(private regionService : RegionService,
    private modalService: NgbModal, private toastr : ToastrService,
    private reportService : ReportService) { }

  @ViewChild('report_details_modal') reportDetailsModal : TemplateRef<any>;

  ngOnInit(){
     // Signalements de cet région
     this.reportService.getRegionReportsWithPage(0).subscribe(
      (response : any[]) => {
        this.reports = response;
      });

    // Nombre des pages de signalements
    this.reportService.getReportsPageNb().subscribe(
      (response : number) => {
        this.pageNumber = response;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );

    //Appel à l'API des catégories des signalements
    this.reportService.getCategories().subscribe(
      (response : string[]) => {
        this.reportCategories = response;
        // Majuscule premier lettre
        for(let i = 0; i < this.reportCategories.length;i++) {
          this.reportCategories[i] = this.reportCategories[i][0].toUpperCase()
            + this.reportCategories[i].slice(1);
        }
        // Filtre pour faire un distinct
        this.reportCategories = this.reportCategories.filter(this.onlyUnique);
    });
  }


  /**
   * Page des régions suivant
   */
   nextPage() {
    this.reportService.getRegionReportsWithPage(this.currentPage+1).subscribe(
      (response : any[]) => {
        this.reports = response;
        this.currentPage++;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  /**
   * Page des régions précedent
   */
   previousPage() {
    this.reportService.getRegionReportsWithPage(this.currentPage-1).subscribe(
      (response : any[]) => {
        this.reports = response;
        this.currentPage--;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }


  private searchReport(searchForm : NgForm) {
    this.reportService.searchReportWithCategory(searchForm.value.keyword, searchForm.value.category).subscribe(
      (result : Report[]) => {
        this.reports = result;
        if(this.reports.length === 0)
          this.noReportFound = true;
        else
          this.noReportFound = false;
      }
    );
  }

  /**
   *  Filtre pour ne retenir que les élèments uniques d'un tableau
   * @param value Valeur de l'élèment du tableau
   * @param index Indice de l'élèment du tableau
   * @param self Le tableau
   * @returns Un tableau qui contient des élèments uniques
   */
  private onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  /**
   * Ouvrir le modal pour afficer les détails d'un signalement
   * @param index Indice du signalement au tableau des signalements
   */
   private displayReportDetails(index : number) {
    this.currentReport = this.reports[index];
    this.imageToShow = this.getImageFromService(this.reports[index]);
    this.open( this.reportDetailsModal );
  }

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

  open(content) {
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
