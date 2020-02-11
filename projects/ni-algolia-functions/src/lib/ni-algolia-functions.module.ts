import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { NiAlgoliaFunctionsComponent } from './ni-algolia-functions.component';
import { CommonModule } from '@angular/common';
import { NiAlgoliaConfig } from './ni-algolia-functions.service';

@NgModule({
  declarations: [NiAlgoliaFunctionsComponent],
  imports: [
	CommonModule
  ],
  exports: [NiAlgoliaFunctionsComponent]
})
export class NiAlgoliaFunctionsModule { 
	constructor (@Optional() @SkipSelf() parentModule: NiAlgoliaFunctionsModule) {
		if (parentModule) {
			throw new Error('NiAlgoliaFunctionsModule is already loaded. Import it in the AppModule only');
		}
	}

	static forRoot(config: NiAlgoliaConfig): ModuleWithProviders {
		return {
			ngModule: NiAlgoliaFunctionsModule,
			providers: [
				{provide: NiAlgoliaConfig, useValue: config }
			]
		}
	}
}
