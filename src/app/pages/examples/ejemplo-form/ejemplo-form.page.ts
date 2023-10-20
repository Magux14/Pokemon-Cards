import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-ejemplo-form',
  templateUrl: './ejemplo-form.page.html',
})
export class EjemploFormPage implements OnInit {

  get fc() { return this.form.controls }

  public mensajesValidacion: any = {};
  public loadMensajesValidacion = async () => {
    return {
      name: [
        { type: 'required', message: await this.utilitiesService.getTextFromi18nJsonLabelAsync('i18n_EJEMPLO_FORM.label_err_message_name_required') }
      ],

      phone: [
        { type: 'required', message: await this.utilitiesService.getTextFromi18nJsonLabelAsync('i18n_EJEMPLO_FORM.label_err_message_phone_required') },
        { type: 'pattern', message: await this.utilitiesService.getTextFromi18nJsonLabelAsync('i18n_EJEMPLO_FORM.label_err_message_phone_pattern') }

      ]
    }
  };

  public form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required],
    ],
    phone: ['', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$')
    ]],
  });

  public submitTried: boolean = false;

  //---------------------------------------------------------------------------------------------------------------------
  constructor(
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService) {
    this.loadMensajesValidacion().then(async resp => {
      this.mensajesValidacion = resp
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ngOnInit() {
    return;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public validar() {
    if (!this.form.valid)
      return

    // Pasó las validaciones correspondientes.
    this.utilitiesService.alert('Éxito', 'Validaciones completas');
  }

}
