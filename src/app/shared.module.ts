import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from './components/components.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        ComponentsModule
    ],
    declarations: [
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        ComponentsModule
    ],
    entryComponents: [
    ],
    providers: [

    ]
})
export class SharedModule { }
