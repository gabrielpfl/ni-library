import { createNullCache } from '@algolia/cache-common'
import { Injectable, Optional } from '@angular/core'
import algoliasearch, { SearchClient } from 'algoliasearch'

export class NiAlgoliaConfig {
    apiId = null
    apiKey = null
}

@Injectable({
  providedIn: 'root'
})
export class NiAlgoliaService {
	
	client: SearchClient

    private _apiId = null
    private _apiKey = null

	constructor(@Optional() config: NiAlgoliaConfig) {
        if (config) { 
            this._apiId = config.apiId
            this._apiKey = config.apiKey
            this.client = algoliasearch(this._apiId, this._apiKey, {
				responsesCache: createNullCache()
			})
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

	search(args){
		let algoliaIndex = this.client.initIndex(args.index)

		if(args.orderBy && args.order){
			const replicaIndexName = `${args.index}_${args.orderBy}_${args.order}`
			algoliaIndex = this.client.initIndex(replicaIndexName)
		}

		if(args.search.filters){
			this.setFilters(args)
		}

		return algoliaIndex.search(args.search.query, args.search)
	}

	setFilters(args){
		const filters = []
		args.search.filters.map(AND => {
			const filterValues = []
			AND.map(OR => {
				if(OR.operator === '=='){
					if(Array.isArray(OR.value)){
						const inVals = []
						OR.value.map(v => {
							inVals.push(`(${OR.key}:"${v}")`)
						})
						if(inVals.length){
							filterValues.push(`(${inVals.join(' AND ')})`)
						}
					}else{
						filterValues.push(`${OR.key}:"${OR.value}"`)
					}
				}else if(OR.operator === '!='){
					if(Array.isArray(OR.value)){
						const notInVals = []
						OR.value.map(v => {
							notInVals.push(`(NOT ${OR.key}:"${v}")`)
						})
						if(notInVals.length){
							filterValues.push(`(${notInVals.join(' AND ')})`)
						}
					}else{
						filterValues.push(`NOT ${OR.key}:"${OR.value}"`)
					}
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
							inVals.push(`(${OR.key}:"${v}")`)
						})
					}
					if(inVals.length){
						filterValues.push(`(${inVals.join(' AND ')})`)
					}
				}else if(OR.operator === 'NOT_IN'){
					const notInVals = []
					if(OR.value && Array.isArray(OR.value)){
						OR.value.map(v => {
							notInVals.push(`(NOT ${OR.key}:"${v}")`)
						})
					}
					if(notInVals.length){
						filterValues.push(`(${notInVals.join(' AND ')})`)
					}
				}else if(OR.operator === 'ANY'){
					if(OR.value && Array.isArray(OR.value)){
						OR.value.map(v => {
							filterValues.push(`(${OR.key}:"${v}")`)
						})
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
		return args
	}

	deleteObject(index: string, objectId: string){
		let algoliaIndex = this.client.initIndex(index)
		return algoliaIndex.deleteObject(objectId)
	}

	async browseIndex(args){
		const algoliaIndex = this.client.initIndex(args.index)

		this.setFilters(args)

		let hits = []
		await algoliaIndex.browseObjects({
			query: args.search.query, // Empty query will match all records
			filters: args.search.filters,
			batch: batch => {
			  hits = hits.concat(batch)
			}
		})

		return hits
	}
}
