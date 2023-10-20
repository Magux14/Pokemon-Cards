import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { isPlatform, ModalController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { WebRestService } from 'src/app/services/web-rest.service';

@Component({
  selector: 'app-embebed-generic',
  templateUrl: './embebed-generic.page.html',
  styleUrls: ['./embebed-generic.page.scss'],
})
export class EmbebedGenericPage implements OnInit {

  public sanitizedEmbebedUrl: SafeResourceUrl;
  @Input('url') url;
  @Input() padding: boolean = false;
  public loading: boolean = true;
  public isIOS: boolean = false;
  public classCloseModal: string = 'close-modal';

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    private domSanitizer: DomSanitizer,
    private modalController: ModalController,
    private webRestService: WebRestService,
    private utilitiesService: UtilitiesService
  ) {
    if (isPlatform('ios')) {
      this.isIOS = true;
      this.classCloseModal = 'close-modal-ios';
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {
    this.loading = true;
    this.sanitizedEmbebedUrl = this.sanitizeUrl(this.url);
    setTimeout(() => {
      this.loading = false;
    }, 6_000);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public sanitizeUrl(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public close() {
    this.modalController.dismiss();
  }

}
