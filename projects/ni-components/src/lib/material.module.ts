import { NgModule } from '@angular/core';
import 'hammerjs';
import 'mousetrap';
import {
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
    MatBottomSheetModule
} from '@angular/material';
//import { MatMomentDateModule } from '@angular/material-moment-adapter';
//import { DragDropModule } from '@angular/cdk/drag-drop';
import { MomentTimezoneDateAdapterModule } from './moment-timezone-date-adapter';

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

        MomentTimezoneDateAdapterModule,
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

        MomentTimezoneDateAdapterModule,
        //DragDropModule
    ],
    entryComponents: [
    ],
    providers: [
    ],
})
export class MaterialModule {}
