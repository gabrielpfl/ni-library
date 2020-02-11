# NiAlgoliaFunctions

Simple functions to query and update data in indices for Algolia.

## Requirements

This library requires packages bellow to be installed: 

`npm i algoliasearch`

import the `NiAlgoliaFunctionsModule` module

```typescript
import { NiAlgoliaFunctionsModule } from 'ni-algolia-functions';

@NgModule({
  imports: [
	NiAlgoliaFunctionsModule.forRoot({
        apiId: 'your_api_id',
        apiKey: 'your_api_key'
    })
  ],
})
```

## Example Use

```typescript
import { NiAlgoliaService } from 'ni-algolia-functions';

constructor(
    private algoliaService: NiAlgoliaService,
) { }

ngOnInit() {
    //Simple Search
    this.algoliaService.search(const args = {
        index: 'index_name',
        search: {
            query: value
        }
    })
}
