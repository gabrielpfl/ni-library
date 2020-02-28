import { Injectable, Optional } from '@angular/core'
import * as algoliasearch_ from 'algoliasearch';
import { async, TestBed } from '@angular/core/testing';
import { NiAlgoliaFunctionsComponent } from './ni-algolia-functions.component';
const algoliasearch = algoliasearch_;

export class NiAlgoliaConfig {
    apiId = null
    apiKey = null
}

@Injectable({
  providedIn: 'root'
})
export class NiAlgoliaService {
	
	client

    private _apiId = null
    private _apiKey = null

	constructor(@Optional() config: NiAlgoliaConfig) {
        if (config) { 
            this._apiId = config.apiId
            this._apiKey = config.apiKey
            this.client = algoliasearch(this._apiId, this._apiKey)
        }
    }

	saveObject(index: string, objectId: string, object: any, partial?: boolean){
		// Add an 'objectID' field which Algolia requires
		object['objectID'] = objectId

		// Write to the algolia index
		const algoliaIndex = this.client.initIndex(index)
		return partial ? algoliaIndex.partialUpdateObject(object) : algoliaIndex.saveObject(object)
	}

	saveObjects(index: string, objects: any[]){
		// Write to the algolia index
		const algoliaIndex = this.client.initIndex(index)
		return algoliaIndex.saveObjects(objects)
	}

	search(args): Promise<any[]>{
		let algoliaIndex = this.client.initIndex(args.index)
		if(args.orderBy && args.order){
			const replicaIndexName = `${args.index}_${args.orderBy}_${args.order}`
			// // algoliaIndex.setSettings({
			// // 	replicas: [
			// // 		replicaIndexName
			// // 	]
			// // })
			algoliaIndex = this.client.initIndex(replicaIndexName)
			// algoliaIndex.setSettings({'ranking': [`${args.order}(${args.orderBy})`]}, (err, content) => {
			// 	if (err) throw err;
			// });
		}
		if(args.search.filters){
			const filters = []
			args.search.filters.map(AND => {
				const filterValues = []
				AND.map(OR => {
					if(OR.operator === '=='){
						filterValues.push(`${OR.key}:${OR.value}`)
					}else if(OR.operator === '!='){
						filterValues.push(`NOT ${OR.key}:${OR.value}`)
					}else if(OR.operator === '>'){
						filterValues.push(`${OR.key} > ${OR.value}`)
					}else if(OR.operator === '<'){
						filterValues.push(`${OR.key} < ${OR.value}`)
					}else if(OR.operator === '>='){
						filterValues.push(`${OR.key} >= ${OR.value}`)
					}else if(OR.operator === '<='){
						filterValues.push(`${OR.key} <= ${OR.value}`)
					}else if(OR.operator === 'BETWEEN'){
						filterValues.push(`${OR.key}:${OR.from} TO ${OR.to}`)
					}else if(OR.operator === 'IN'){
						const inVals = []
						if(OR.value && Array.isArray(OR.value)){
							OR.value.map(v => {
								inVals.push(`(${OR.key}:${OR.v})`)
							})
						}
						if(inVals.length){
							filterValues.push(`(${inVals.join(' AND ')})`)
						}
					}
				})
				const filterString = `(${filterValues.join(' OR ')})`
				if(filterValues.length){
					filters.push(filterString)
				}
			})
			const filtersString = filters.join(args.search.filterComparator ? args.search.filterComparator : ' AND ')
			delete args.search['filterComparator']
			args.search.filters = filtersString
		}
		return algoliaIndex.search(args.search)
	}

	deleteObject(index: string, objectId: string){
		let algoliaIndex = this.client.initIndex(index)
		return algoliaIndex.deleteObject(objectId)
	}
}
