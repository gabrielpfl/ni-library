import { Component, OnInit } from '@angular/core';
import { NiAlgoliaService } from './ni-algolia-functions.service';

@Component({
  selector: 'lib-ni-algolia-functions',
  template: `
    <p>
      ni-algolia-functions works!
    </p>
  `,
  styles: []
})
export class NiAlgoliaFunctionsComponent implements OnInit {

	constructor(private algoliaService: NiAlgoliaService) { }

	ngOnInit() {
		this.algoliaService.search({
			index: 'dev_groups',
			search: {
				//query: 'test',
				page: 0,
				hitsPerPage: 100,
				filters: [
					[{
						key: 'dateCreated',
						value: 1572566400000,
						operator: '>='
					}],
					[{
						key: 'dateCreated',
						value: 1575072000000,
						operator: '<='
					}]
				]
			}
		}).then((responses: any) => {
			console.log(responses.hits)
		})
	}

}
