import { NgModule } from '@angular/core';
import 'hammerjs';
import 'mousetrap';
import { MatGridListModule } from '@angular/material/grid-list'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTabsModule } from '@angular/material/tabs'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatCardModule } from '@angular/material/card'
import { MatSelectModule } from '@angular/material/select'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatRadioModule } from '@angular/material/radio'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSliderModule } from '@angular/material/slider'
import { MatChipsModule } from '@angular/material/chips'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatMenuModule } from '@angular/material/menu'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatListModule } from '@angular/material/list'
import { MatBadgeModule } from '@angular/material/badge'
import { MatBottomSheetModule } from '@angular/material/bottom-sheet'
import { MatSortModule } from '@angular/material/sort';

//import { MatMomentDateModule } from '@angular/material-moment-adapter';
// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { MomentTimezoneDateAdapterModule } from '../helpers/moment-timezone-date-adapter';

@NgModule({
    imports: [     
        MatGridListModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatCardModule,
        MatSelectModule,
        MatDatepickerModule,
        MatRadioModule,
        MatAutocompleteModule,
        MatTooltipModule,
        MatDialogModule,
        MatSliderModule,
        MatChipsModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatProgressBarModule,
        MatMenuModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatListModule,
        MatBadgeModule,
        MatBottomSheetModule,

        //MomentTimezoneDateAdapterModule,
        //DragDropModule
    ],
    declarations: [

    ],
    exports: [
        MatGridListModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatCardModule,
        MatSelectModule,
        MatDatepickerModule,
        MatRadioModule,
        MatAutocompleteModule,
        MatTooltipModule,
        MatDialogModule,
        MatSliderModule,
        MatChipsModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatProgressBarModule,
        MatMenuModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatListModule,
        MatBadgeModule,
        MatBottomSheetModule,

        //MomentTimezoneDateAdapterModule,
        //DragDropModule
    ],
    entryComponents: [
    ],
    providers: [
    ],
})
export class MaterialModule {}
