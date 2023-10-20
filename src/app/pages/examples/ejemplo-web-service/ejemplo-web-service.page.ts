import { Component, OnInit } from '@angular/core';
import { GenericWebResponseModel, SendRequestOptionsModel } from 'src/app/shared-models/generic-web-response.model';
import { WebPersonalizedService } from 'src/app/services/web-personalized.service';
import { WebRestService } from 'src/app/services/web-rest.service';
import { environment } from 'src/environments/environment';
import { WebSoapService } from 'src/app/services/web-soap.service';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-ejemplo-web-service',
  templateUrl: './ejemplo-web-service.page.html',
  styleUrls: ['./ejemplo-web-service.page.scss'],
})
export class EjemploWebServicePage implements OnInit {

  public pokemons: Array<any> = []
  public lstNumbersOfPokemon = [150, 244, 245, 144, 145, 146, 249, 250, 158, 25, 19, 37, 63, 94, 135, 134, 136, 137, 1, 6, 8, 10, 15, 18, 24, 27, 32, 39, 43, 52, 55, 57, 58, 68, 71, 73, 74, 77, 79, 90, 104, 108, 110, 120, 126, 127, 129, 130, 132, 133, 143, 152, 156, 161, 165, 172, 175, 183, 200, 202, 209, 212, 214, 216, 222, 239, 240, 241, 34, 65, 154, 149, 142, 181]

  private countLvl1 = 0;
  private countLvl2 = 0;
  private countLvl3 = 0;
  private countLvl4 = 0;
  private countLvl5 = 0;
  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    private webPersonalizedService: WebPersonalizedService,
    private webRestService: WebRestService,
    private webSoapService: WebSoapService,
    private firebaseService: FirebaseService
  ) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async ngOnInit() {
    // this.getXml();
    this.getPokemon();
    // this.firebaseService.deleteAllCollectionOneByOne('success');
    // if (isPlatform('capacitor') && !isPlatform('mobileweb')) {
    //   this.sendRequest();
    // }
  }

  // //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // public async getPokemon() {
  //   let response: GenericWebResponseModel = await this.webPersonalizedService.getAsync(environment.uri.pokemon.list);
  //   if (!response.success)
  //     return;
  //   let pokemonList = response.data;
  //   this.pokemons = pokemonList.results.map(item => {
  //     const lst = item.url.split('/');
  //     const str = lst[lst.length - 2];
  //     const number = Number(str);
  //     let strNumber = number.toString();
  //     if (number < 100) {
  //       strNumber = '0' + strNumber;
  //     }
  //     if (number < 10) {
  //       strNumber = '0' + strNumber;
  //     }
  //     return {
  //       name: item.name,
  //       detailtUrl: item.url,
  //       imgUri: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/' + strNumber + '.png',
  //       types: []
  //     }
  //   });

  //   this.pokemons.forEach((pokemon, index) => {
  //     this.webRestService.getAsync(pokemon.detailtUrl).then((respPokemonDetail: GenericWebResponseModel) => {
  //       if (!respPokemonDetail.success)
  //         return;
  //       let pokemonDetail: PokemonExampleDetail = respPokemonDetail.data;
  //       if (pokemonDetail?.sprites?.front_default == null)
  //         return

  //       const temp = pokemonDetail.types as any;
  //       this.pokemons[index].types = temp.map(item => item.type.name);
  //     });
  //   });
  // }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getPokemon() {
    let response: GenericWebResponseModel = await this.webPersonalizedService.getAsync(environment.uri.pokemon.list);
    if (!response.success)
      return;
    this.pokemons = this.lstNumbersOfPokemon.map(item => {
      const number = Number(item);
      let strNumber = number.toString();
      if (number < 100) {
        strNumber = '0' + strNumber;
      }
      if (number < 10) {
        strNumber = '0' + strNumber;
      }
      return {
        name: null,
        detailtUrl: 'https://pokeapi.co/api/v2/pokemon/' + number + '/',
        imgUri: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/' + strNumber + '.png',
        types: [],
        number: number
      }
    });

    this.pokemons.forEach((pokemon, index) => {
      this.webRestService.getAsync(pokemon.detailtUrl).then((respPokemonDetail: GenericWebResponseModel) => {
        if (!respPokemonDetail.success)
          return;
        let pokemonDetail: any = respPokemonDetail.data;
        if (pokemonDetail?.sprites?.front_default == null)
          return

        const temp = pokemonDetail.types as any;
        this.pokemons[index] = { ...this.pokemons[index], ...pokemonDetail };
        this.pokemons[index].types = temp.map(item => item.type.name);

        let helpPoints = 0;
        let attackPoints = 0;

        // legendarios
        if ([150, 244, 245, 144, 145, 146, 249, 250,].includes(pokemon.number)) {
          pokemonDetail.base_experience += 150;
        }


        if (pokemonDetail.base_experience < 100) {
          helpPoints = 1;
          this.countLvl1++;
        } else if (pokemonDetail.base_experience < 200) {
          helpPoints = 2;
          this.countLvl2++;
        } else if (pokemonDetail.base_experience < 300) {
          helpPoints = 3;
          this.countLvl3++;
        } else if (pokemonDetail.base_experience < 400) {
          helpPoints = 4;
          this.countLvl4++;
        } else {
          helpPoints = 5;
          this.countLvl5++;
        }

        if (pokemonDetail.base_experience < 80) {
          attackPoints = 6;
        } else if (pokemonDetail.base_experience < 100) {
          attackPoints = 7;
        } else if (pokemonDetail.base_experience < 150) {
          attackPoints = 8;
        } else if (pokemonDetail.base_experience < 200) {
          attackPoints = 9;
        } else if (pokemonDetail.base_experience < 250) {
          attackPoints = 10;
        } else if (pokemonDetail.base_experience < 300) {
          attackPoints = 11;
        } else if (pokemonDetail.base_experience < 400) {
          attackPoints = 12;
        } else {
          attackPoints = 19;
        }

        this.pokemons[index].attackPoints = attackPoints;
        this.pokemons[index].helpPoints = helpPoints;
        this.pokemons[index].name = pokemonDetail.name;
        console.log('countLvl1: ' + this.countLvl1);
        console.log('countLvl2: ' + this.countLvl2);
        console.log('countLvl3: ' + this.countLvl3);
        console.log('countLvl4: ' + this.countLvl4);
        console.log('countLvl5: ' + this.countLvl5);
        console.log('total: ' + (this.countLvl1 + this.countLvl2 + this.countLvl3 + this.countLvl4 + this.countLvl5));
      });
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getXml() {
    let url: string = 'https://portalb.allianz.com.mx/AdminContrasenasWeb/services/LoginService';
    let strXml: string = `<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ser='http://services.admincontrasenas.web.habil.com'>
       <soapenv:Header/>
       <soapenv:Body>
          <ser:loginService>
             <ser:usuario>iborja@visionconsulting.com.mx</ser:usuario>
             <ser:password>azmxtest</ser:password>
             <ser:tipoUsr></ser:tipoUsr>
          </ser:loginService>
       </soapenv:Body>
    </soapenv:Envelope>`;

    let resp: GenericWebResponseModel = await this.webSoapService.postAsync(url, strXml, 'loginServiceReturn');
    console.log(resp.success);

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // testing, este solo sirve para post, put, delete, no sirve para get cuando queires poner body.
  public async sendRequest() {
    const url: string = 'https://web9.abaseguros.com/AjustesMovilNTPSI_DigitalFiles2/api/AjustesMovil/ExisteIncisoReporteKM/';
    const form = new FormData();
    form.append("ClaveId", "CE");
    form.append("NumeroInciso", "1");
    form.append("PolizaId", "50853443");

    const params = {
      'ClaveId': 'CE',
      'NumeroInciso': '1',
      'PolizaId': '50853443'
    }

    const options: SendRequestOptionsModel = {
      method: 'get',
      headers: {
        'Authorization': 'AAEAAAD/////AQAAAAAAAAAMAgAAAF9BYmFzZWd1cm9zLlNlZ3VyaWRhZC5TSS5CdXNpbmVzc0VudGl0aWVzLCBWZXJzaW9uPTEuMC4wLjAsIEN1bHR1cmU9bmV1dHJhbCwgUHVibGljS2V5VG9rZW49bnVsbAwDAAAAXEFiYXNlZ3Vyb3MuU2VndXJpZGFkLlNJLkRhdGFDb250cmFjdHMsIFZlcnNpb249MS4wLjAuMCwgQ3VsdHVyZT1uZXV0cmFsLCBQdWJsaWNLZXlUb2tlbj1udWxsBQEAAAA6QWJhc2VndXJvcy5TZWd1cmlkYWQuU0kuQnVzaW5lc3NFbnRpdGllcy5TZWN1cmVkSGVhZGVyVXNlcgYAAAAqU2VjdXJlZEhlYWRlcis8VXN1YXJpb0d1aWQ+a19fQmFja2luZ0ZpZWxkLVNlY3VyZWRIZWFkZXIrPElzQXV0ZW50aWNhdGVkPmtfX0JhY2tpbmdGaWVsZChTZWN1cmVkSGVhZGVyKzxTaXN0ZW1hSWQ+a19fQmFja2luZ0ZpZWxkKlNlY3VyZWRIZWFkZXIrPElzQXV0b3JpemVkPmtfX0JhY2tpbmdGaWVsZC1TZWN1cmVkSGVhZGVyKzxOb21icmVDb21wbGV0bz5rX19CYWNraW5nRmllbGQqU2VjdXJlZEhlYWRlcis8VGlwb1VzdWFyaW8+a19fQmFja2luZ0ZpZWxkAwAAAAEEC1N5c3RlbS5HdWlkAQgBMUFiYXNlZ3Vyb3MuU2VndXJpZGFkLlNJLkRhdGFDb250cmFjdHMuVGlwb1VzdWFyaW8DAAAAAgAAAAT8////C1N5c3RlbS5HdWlkCwAAAAJfYQJfYgJfYwJfZAJfZQJfZgJfZwJfaAJfaQJfagJfawAAAAAAAAAAAAAACAcHAgICAgICAgKwn+lKXGyNR5plhKEXnZHeAQAAAAABCgX7////MUFiYXNlZ3Vyb3MuU2VndXJpZGFkLlNJLkRhdGFDb250cmFjdHMuVGlwb1VzdWFyaW8BAAAAB3ZhbHVlX18ACAMAAAAAAAAACw==',
        'IdOficinaAjustador': '1',
      },
      params,
      data: form
    }
    let resp: GenericWebResponseModel = await this.webRestService.sendRequestCapacitorAsync(url, options);
    if (resp.success) {
      alert('sucess')
    } else {
      alert('error')
    }


  }

  // //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // private printPDF() {
  //   var doc = new jsPDF();
  //   var elementHTML = $('#content').html();
  //   var specialElementHandlers = {
  //     '#elementH': function (element, renderer) {
  //       return true;
  //     }
  //   };
  //   doc.fromHTML(elementHTML, 15, 15, {
  //     'width': 170,
  //     'elementHandlers': specialElementHandlers
  //   });

  //   // Save the PDF
  //   doc.save('sample-document.pdf');
  // }

}
