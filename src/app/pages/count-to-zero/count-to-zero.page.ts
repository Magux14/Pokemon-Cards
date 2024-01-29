import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-count-to-zero',
  templateUrl: './count-to-zero.page.html',
  styleUrls: ['./count-to-zero.page.scss'],
})
export class CountToZeroPage implements OnInit {


  public defaultCounter: number = 700;
  public counter: number = this.defaultCounter;
  public interval;
  public gameFinished: boolean = false;
  public review: string;

  //-------------------------------------------------------------------------------------------------------------------
  constructor() { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ngOnInit() {
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public stop() {
    clearInterval(this.interval);
    this.gameFinished = true;
    this.setReview(this.counter);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public startCounter = () => {
    this.counter = this.defaultCounter;
    this.review = '';
    this.interval = setInterval(() => {
      if (--this.counter < -200) {
        this.stop();
      }
      console.log(this.counter);
    }, 10)
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private setReview = (time) => {
    if (time > 300) {
      this.review = 'Vaya amigo/a si que besas mal :(';
    } else if (time > 250) {
      this.review = 'Necesitas meter más pasión a tu vida amigo/a';
    } else if (time > 200) {
      this.review = '¡No vayas tan rápido! hay que meterle más amor a tu beso.';
    } else if (time > 150) {
      this.review = 'Estás comiendo ansias, las cosas llevan su tiempo';
    } else if (time > 100) {
      this.review = 'No está mal... pero puedes mejorar';
    } else if (time > 50) {
      this.review = 'Meh... supongo que está bien.';
    } else if (time > 40) {
      this.review = 'Besas bien, palomita';
    } else if (time > 30) {
      this.review = 'Ufff Estás que ardes!';
    } else if (time > 20) {
      this.review = 'Eso es pasión al besar!';
    } else if (time > 10) {
      this.review = 'Demonios eres bueno besando!';
    } else if (time > 5) {
      this.review = '¡Felicidades!, besas como si fuera tu último beso.';
    } else if (time > 0) {
      this.review = 'Diablos señorit/a, eres todo un bugbuster besando!!!';
    } else {
      this.review = 'Esperaste demasiado amigo/a, tu chico/a se fue, te viste lento/a';
    }
  }

}
