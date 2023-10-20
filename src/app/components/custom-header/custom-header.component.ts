import { Component, Input } from '@angular/core';

@Component({
  selector: 'custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
})
export class CustomHeaderComponent {

  @Input() back: boolean;
  @Input() title: string;
  @Input() notifications: boolean;
  @Input() hideAll: boolean;

}
