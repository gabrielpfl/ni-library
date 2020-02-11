# NiFirestoreFunctions

Simple functions for angular to query and update dollections and documents in Firestore database from Firebase.

## Requirements

This library requires packages bellow to be installed: 

`npm i firebase`

`npm i @angular/fire`

import the `NiFirestoreFunctions` module

```typescript
import { NiFirestoreFunctions } from 'ni-firestore-functions';
```

## Example Use

```typescript
import { NiFirestoreService } from 'ni-firestore-functions';

constructor(
    private firestoreService: NiFirestoreService,
) { }

ngOnInit() {
    //Get a dollection
    this.firestoreService.getCollection({collection: 'documentation'})

    //Get a document
    this.firestoreService.getDoc({path: '/books/book_id'})
}
```

