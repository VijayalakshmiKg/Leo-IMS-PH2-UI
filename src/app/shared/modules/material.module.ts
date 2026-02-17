import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

//Angular Material



//Font Awesome
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSquare as farSquare, faCheckSquare as farCheckSquare, } from '@fortawesome/free-regular-svg-icons';
import { faStackOverflow, faGithub, faMedium, faFacebook, } from '@fortawesome/free-brands-svg-icons';
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faSun as farSun, faStar as farStar, faMoon as farMoon } from '@fortawesome/free-regular-svg-icons';
import { faSun as fasSun, faStar as fasStar, faMoon as fasMoon } from '@fortawesome/free-solid-svg-icons';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBadgeModule } from "@angular/material/badge";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { CommonModule, DatePipe } from '@angular/common';
import { NumberOnlyDirective } from '../directives/number-only.directive';
import { CustomMessageBoxComponent } from '../components/custom-message-box/custom-message-box.component';
import { LettersOnlyDirective } from '../directives/letters-only.directive';
import { FaxNumberPipe } from '../pipes/fax-number.pipe';
import { CustomPaginatorComponent } from '../components/custom-paginator/custom-paginator.component';
import { TemplatePaginatorComponent } from '../components/template-paginator/template-paginator.component';


export const UK_DATE_FORMATS = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY', // Format inside input field
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'DD/MM/YYYY',
      monthYearA11yLabel: 'MMM YYYY',
    },
  };

@NgModule({

    declarations: [
        NumberOnlyDirective,
        LettersOnlyDirective,
        CustomMessageBoxComponent,
        CustomPaginatorComponent,
        TemplatePaginatorComponent,
        FaxNumberPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,

        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatTooltipModule ,
        //   MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        // MatProgressSpinnerModule,
        MatRadioModule,
        // MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        // MatTabsModule,
        MatToolbarModule,
        // MatTooltipModule,
        //   DragDropModule,
        MatStepperModule,
        // MatTreeModule,
        MatDividerModule,
        MatFormFieldModule,
        MatBadgeModule,
        // MatBottomSheetModule,


    ],
    exports: [
        DatePipe,
        CommonModule,
        FormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatNativeDateModule,
        MatTooltipModule ,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatInputModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        // MatProgressSpinnerModule,
        MatRadioModule,
        // MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        // MatTooltipModule,
        //   DragDropModule,
        MatStepperModule,
        // MatTreeModule,
        MatDividerModule,
        MatFormFieldModule,
        MatBadgeModule,
        // MatBottomSheetModule,


        // Do not remove 

        NumberOnlyDirective,
        LettersOnlyDirective,

        CustomMessageBoxComponent,
        FaxNumberPipe,
        CustomPaginatorComponent,
        TemplatePaginatorComponent
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Set locale to UK
        { provide: MAT_DATE_FORMATS, useValue: UK_DATE_FORMATS }, // Use UK date format
        DatePipe, // Provide DatePipe globally
      ],
})
export class MaterialModule {

    //Refer for adding a icons...  https://edupala.com/angular-font-awesome/
    //Add multiple icons to the library

    constructor(private library: FaIconLibrary) {
        library.addIcons(
            faSquare,
            faCheckSquare,
            farSquare,
            farCheckSquare,
            faStackOverflow,
            faGithub,
            faMedium,
            fasSun,
            fasStar,
            fasMoon,
            farSun,
            farMoon,
            farStar,
            faStackOverflow,
            faGithub,
            faFacebook
        );
    }

}
