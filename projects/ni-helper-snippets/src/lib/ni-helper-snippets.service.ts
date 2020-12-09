import { Injectable, Directive, Input } from '@angular/core'
import { NgControl } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, ValidationErrors } from '@angular/forms'
import { difference, differenceWith, isEqual, transform, isObject, round, differenceBy, filter, intersection } from 'lodash'

import * as _moment from 'moment-timezone'
import { Observable } from 'rxjs';
const moment = _moment

@Injectable({
  providedIn: 'root'
})
export class NiHelperSnippetsService {

	setForm(formGroup: AbstractControl, obj: any, opts: any = { disabled: false, emitEvent: true}){
		const { disabled = false, emitEvent = true} = opts

        if(!obj) return;

        let keys = []
        if(formGroup instanceof FormGroup){
            keys = Object.keys(obj)
        }else if(formGroup instanceof FormArray){
            keys = obj
            let diff1 = differenceBy(formGroup.getRawValue(), obj, '_id')
            if(diff1.length){
                this.removeFromFormArray(formGroup, diff1, '_id')
            }
            let diff2 = differenceBy(formGroup.getRawValue(), obj, 'id')
            if(diff2.length){
                this.removeFromFormArray(formGroup, diff2, 'id')
            }
        }

		keys.map(async (key, i) => {
            if(formGroup instanceof FormArray){
                key = i
            }
            let value = obj[key]

			if((!isObject(value) && !Array.isArray(value)) || this.isValidTimeStamp(value) || moment.isMoment(value) || value instanceof Date){
                let control: FormControl = formGroup['controls'][key];
                if(this.isValidTimeStamp(value) || moment.isMoment(value)){
                    value = value.toDate()
                }
				if(control && control.value !== value){
                    control.patchValue(value, { emitEvent });
				}else if(!control){
                    control = new FormControl({value, disabled})
					if(formGroup instanceof FormGroup){
						formGroup.addControl(key, control);
					}else if(formGroup instanceof FormArray){
						(<FormArray>formGroup).push(control);
					}
                }
                if(control){
                    if(disabled === true && !control.disabled){
                        control.disable({emitEvent: false})
                    }else if(disabled === false && control.disabled){
                        control.enable({emitEvent: false})
                    }
                }
			}else if(isObject(value) && !Array.isArray(value) && !(value instanceof Date) && !this.isValidTimeStamp(value)){
				let group = formGroup['controls'][key];
				if(group){
					this.setForm(group, value, opts)
				}else if(!group){
					group = new FormGroup({});
					this.setForm(group, value, opts);
					if(formGroup instanceof FormGroup){
						formGroup.addControl(key, group);
					}else if(formGroup instanceof FormArray){
						(<FormArray>formGroup).push(group);
					}
				}
			}else if(Array.isArray(value)){
                let array = formGroup['controls'][key];
                if(array){
                    this.setForm(array, value, opts);
                }else{
                    array = new FormArray([]);
                    this.setForm(array, value, opts);
                    if(formGroup instanceof FormGroup){
                        formGroup.addControl(key, array);
                    }else if(formGroup instanceof FormArray){
                        (<FormArray>formGroup).push(array);
                    }
                }
			}
        })
    }

    setFormStatus(form: AbstractControl, canActivate: Observable<boolean> | Promise<boolean> | boolean): Promise<void>{
        return new Promise(async (resolve, reject) => {
            let perm: boolean
            if(canActivate instanceof Promise){
                perm = await canActivate
            }else if(canActivate === true || canActivate === false){
                perm = canActivate
            }

            if(perm === true){
                form.enable({emitEvent: false})
            }else if(perm === false){
                form.disable({emitEvent: false})
            }

            resolve()
            
            if(canActivate instanceof Observable){
                canActivate.subscribe(perm => {
                    if(perm === true){
                        form.enable({emitEvent: false})
                    }else if(perm === false){
                        form.disable({emitEvent: false})
                    }
                    resolve()
                })
            }
        })
    }

    removeFromFormArray(array, diff, comparator){
        array.getRawValue().map((objGroup, i) => {
            let findId = filter(diff, [comparator, objGroup[comparator]])
            if(findId.length){
                (<FormArray>array).removeAt(i);
                //(<FormArray>array).controls.splice(i, 1);
            }
        })
    }

    removeFromArray(array: any[], diff: any[], comparator){
        //remove diff from array
        diff.map((obj, i) => {
            array = array.filter(o => o[comparator] !== obj[comparator])
        })

        return array
    }

    addToArray(array, diff, comparator){
        diff.map((obj, i) => {
            array.push(obj)
        })
    }

    createFormGroup(formGroup: FormGroup, obj: any){
        let keys = Object.keys(obj)
        keys.map(key => {
            let value = obj[key]
			if(!isObject(value) && !Array.isArray(value)){
                let control = (<FormControl>formGroup.get(key));
				if(control && control.value !== value){
					control.setValue(value);
				}else if(!control){
					formGroup.addControl(key, new FormControl(value));
                }
			}else if(isObject(value) && !Array.isArray(value)){
                let group = (<FormGroup>formGroup.get(key));
				if(group){
					this.createFormGroup(group, value)
				}else if(!group){
					group = new FormGroup({});
					this.createFormGroup(group, value);
					formGroup.addControl(key, group);
				}
            }else if(Array.isArray(value)){
                let array = new FormArray([]);
                //formGroup.get(key).setValue(array)
                value.map((k, i) => {
                    let group = new FormGroup({});
                    this.createFormGroup(group, value[i]);
                    (<FormArray>array).push(group);
                })
                formGroup.addControl(key, array);
            }
        })
    }

    setFormGroup(obj: any){
        let keys, formGroup
        if(isObject(obj) && !Array.isArray(obj)){
            keys = Object.keys(obj)
            formGroup = new FormGroup({});
        }else if(Array.isArray(obj)){
            keys = obj
            formGroup = new FormArray([]);
        }
        keys.map((key, i) => {
            if(formGroup instanceof FormArray){
                key = i
            }
            let value = obj[key]
			if((!isObject(value) && !Array.isArray(value)) || this.isValidTimeStamp(value) || moment.isMoment(value)){
                if(this.isValidTimeStamp(value)){
                    value = moment(value.seconds*1000).toDate()
                }
                if(moment.isMoment(value)){
                    value = value.toDate()
                }
                let control = new FormControl(value);
                if(formGroup instanceof FormArray){
                    (<FormArray>formGroup).push(control);
                }else if(formGroup instanceof FormGroup){
                    formGroup.addControl(key, control);
                }
			}else if(isObject(value) && !Array.isArray(value) && !this.isValidTimeStamp(value)){
                let group = this.setFormGroup(value);
                if(formGroup instanceof FormArray){
                    (<FormArray>formGroup).push(group);
                }else if(formGroup instanceof FormGroup){
                    formGroup.addControl(key, group);
                }
            }else if(!this.isValidTimeStamp(value) && Array.isArray(value)){
                let array = this.setFormGroup(value);
                if(formGroup instanceof FormArray){
                    (<FormArray>formGroup).push(array);
                }else if(formGroup instanceof FormGroup){
                    formGroup.addControl(key, array);
                }
            }
        })
        return formGroup
    }

    deleteFromFormArray(formArray: FormArray, i){
        (<FormArray>formArray).removeAt(i)
    }
    
    generateKeys(obj) {
		return obj ? Object.keys(obj) : null
    }
    
    getKeyValues(obj, key: string) {
		return key ? obj[key] : null
    }

    arr_diff(a1, a2) {
        let a = [], diff = [];
        for (let i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }
        for (let i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }
        for (let k in a) {
            diff.push(k);
        }
        return diff;
    }

    /**
     * Deep diff between two object, using lodash(ignoring objects & array properties)
     * @param  {Object} object Object compared
     * @param  {Object} base   Object to compare with
     * @return {Object}        Return a new object who represent the diff
     */
    differenceObjs(object, base) {
        function changes(object, base) {
            return transform(object, function(result, value, key) {
                if (!isEqual(value, base[key]) && !isObject(value) && !Array.isArray(value)) {
                    result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
                }
            });
        }
        return changes(object, base);
    }

    removeObject(arr, key, val) {
        return arr.filter(function( obj ) {
			return obj[key] !== val
        })
    }

    findObject(arr: any, key, val) {
		return arr.find(function(obj) {
			return obj[key] == val
		})
    }

    removeElement(arr, key) {
        return arr.filter(function( item ) {
			return item !== key
        })
    }

    compareCollections(collection1: any[], collection2: any[]){
        if(collection1.length <= 0 || !collection2) return;
		collection1.map((doc1, i) => {
            let doc2 = this.findObject(collection2, 'id', doc1.id)
            if(!doc2){
                collection2.push(doc1)
            }else{
                let keys = Object.keys(doc1)
                keys.map(key => {
                    let val1 = doc1[key]
                    let val2 = doc2[key]
                    if(val1 !== val2){
                        val2 = val1
                    }
                })
            }
        })
    }

    updateObject(obj){
        Object.assign({}, obj, {
            name: 'bla'
        });
    }

    ObjectById(state){
        state.reduce((acc, item) => ({
            ...acc,
            [item.id]: this.updateObject(item),
        }), {})
    }

    validateForm(formGroup: AbstractControl) {
        let keys
        if(formGroup instanceof FormGroup){
            keys = Object.keys(formGroup.controls)
        }else if(formGroup instanceof FormArray){
            keys = formGroup.controls
        }
        keys.forEach((field, i) => {
            if(formGroup instanceof FormArray){
                field = i
            }
            const control = formGroup['controls'][field];    
            if (control instanceof FormControl){ 
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup){
                this.validateForm(control);
            } else if (control instanceof FormArray){
                this.validateForm(control);
            }
        });
    }

    getFormValidationErrors(formGroup: AbstractControl): boolean {
        let keys
        if(formGroup instanceof FormGroup){
            keys = Object.keys(formGroup.controls)
        }else if(formGroup instanceof FormArray){
            keys = formGroup.controls
        } 
		let validate = keys.every((k, i) => {
            if(formGroup instanceof FormArray){
                k = i
            }
            const control = formGroup['controls'][k];    
            if (control instanceof FormControl){             
                const controlErrors: ValidationErrors = formGroup.get(k).errors;
				if (controlErrors != null) {
					return false
				}
				return true
            } else if (control instanceof FormGroup){    
                return this.getFormValidationErrors(control)
            } else if (control instanceof FormArray){    
                return this.getFormValidationErrors(control)
            }
            return true
		})
		return validate
    }
    
    localDateFormat(date){
        let date2
        if(date instanceof Date){
            date2 = date
        }else{
            date2 = date.toDate()
        }
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return date2.toLocaleDateString('en-US', options)
    }

    dateFormat(date, format, tz?){
        if(!date) return '';
        
        let date2 = date
        if(date instanceof Date){
            date2 = date
        }else if(this.isValidTimeStamp(date)){
            date2 = date.toDate()
        }else if(this.isValidTimeStamp2(date)){
            date2 = moment.unix(date['_seconds']).toDate()
        }
        if(tz){
            return moment(date2).tz(tz).format(format); 
        }
        return moment(date2).format(format); 
    }

    priceFormat(val){
        return val || val === 0 ? Number(round(val, 2).toFixed(2)) : 0
    }

    priceFormat2(val){
        const num = val || val === 0 ? Number(round(val, 2).toFixed(2)).toFixed(2) : 0.00
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    isValidTimeStamp(value){
        if(isObject(value) && value.hasOwnProperty('seconds') && value.hasOwnProperty('nanoseconds')) 
        return true
        return false
    }

    isValidTimeStamp2(value){
        if(isObject(value) && value.hasOwnProperty('_seconds') && value.hasOwnProperty('_nanoseconds')) 
        return true
        return false
    }

    convertMomentFields(obj: any){
        if(!obj) return;

        let keys
        if(isObject(obj)){
            keys = Object.keys(obj)
        }else if(Array.isArray(obj)){
            keys = obj
        }
        
		keys.map((key, i) => {
            if(Array.isArray(obj)){
                key = i
            }

            let value = obj[key]
			if((moment.isMoment(value))){
                obj[key] = value.toDate()
			}else if(isObject(value) && !Array.isArray(value)){
				this.convertMomentFields(value)
			}else if(Array.isArray(value)){
                this.convertMomentFields(value)
			}
        })

        return obj
    }

    timeStampToDate(obj: any){
        if(!obj) return;

        let keys
        if(isObject(obj)){
            keys = Object.keys(obj)
        }else if(Array.isArray(obj)){
            keys = obj
        }
        
		keys.map((key, i) => {
            if(Array.isArray(obj)){
                key = i
            }

            let value = obj[key]
			if(this.isValidTimeStamp(value)){
                obj[key] = value.toDate()
			}else if(isObject(value) && !Array.isArray(value)){
				this.timeStampToDate(value)
			}else if(Array.isArray(value)){
                this.timeStampToDate(value)
			}
        })

        return obj
    }

    dateToTimeStamp(obj: any){
        if(!obj) return;

        let keys
        if(isObject(obj)){
            keys = Object.keys(obj)
        }else if(Array.isArray(obj)){
            keys = obj
        }
        
		keys.map((key, i) => {
            if(Array.isArray(obj)){
                key = i
            }

            let value = obj[key]
			if(value instanceof Date){
                obj[key] = value.getTime()
			}else if(isObject(value) && !Array.isArray(value)){
				this.dateToTimeStamp(value)
			}else if(Array.isArray(value)){
                this.dateToTimeStamp(value)
			}
        })

        return obj
    }

    date(date: any){
        return new Date(date)
    }

    toDate(date: any){
        if(date instanceof Date){
            return date
        }else if(this.isValidTimeStamp(date)){
            return date.toDate()
        }else if(moment.isMoment(date)){
            return date.toDate()
        }
        return date.toDate()
    }

    emptyFormArray(formArray){
		while (formArray.length !== 0) {
			formArray.removeAt(0)
		}
    }
    
    isEqual(obj1: any, obj2: any): boolean{
        if(!obj1 || !obj2) return false
        let keys1, keys2
        if(Array.isArray(obj1)){
            keys1 = obj1
            keys2 = obj2
        }else{
            keys1 = Object.keys(obj1)
            keys2 = Object.keys(obj2)
        }
        
        if(keys2.length !== keys1.length){
            return false
        }
        
		return keys1.every((key, i) => {
            if(Array.isArray(obj1)){
                key = i
            }
            if(!obj2.hasOwnProperty(key)){
                return false
            }
            let value1 = obj1[key]
            let value2 = obj2[key]

			if(!isObject(value1) && !Array.isArray(value1)){
                if(value1 !== value2) {
                    return false
                }
                return true
			}else if(isObject(value1) && !Array.isArray(value1)){
                return this.isEqual(value1, value2)
			}else if(Array.isArray(value1)){
                return this.isEqual(value1, value2)
            }
        })
    }

    renameProp(oldProp, newProp, { [oldProp]: old, ...others }){
        return {
            [newProp]: old,
            ...others
        }
    }

    setData(data: any, newData: any){
        if(!newData) return;

        let keys
        if(Array.isArray(data)){
            keys = newData
            const diff1 = differenceBy(data, newData, '_id')
            const diff2 = differenceBy(data, newData, 'id')
            if(diff1.length){
                data = this.removeFromArray(data, diff1, '_id')
            }
            if(diff2.length){
                data = this.removeFromArray(data, diff2, 'id')
            }
        }else{
            keys = Object.keys(newData)
        }
        
		keys.map((key, i) => {
            if(Array.isArray(data)){
                key = i
            }
            let value = newData[key]

			if((!isObject(value) && !Array.isArray(value)) || this.isValidTimeStamp(value) || moment.isMoment(value) || value instanceof Date){
                let control = data[key];
                if(this.isValidTimeStamp(value) || moment.isMoment(value)){
                    value = value.toDate()
                }
				if(control && control !== value){
                    control = value;
                    if(isObject(data)){
                        data[key] = value
                    }
				}else if(!control){
                    if(isObject(data)){
                        data[key] = value
                    }else if(Array.isArray(data)){
                        data.push(value)
                    }
                }
			}else if(isObject(value) && !Array.isArray(value) && !(value instanceof Date) && !this.isValidTimeStamp(value)){
				let group = data[key];
				if(group){
					this.setData(group, value)
				}else if(!group){
					group = {};
					this.setData(group, value);
					if(isObject(data)){
                        data[key] = group
                    }else if(Array.isArray(data)){
                        data.push(group)
                    }
				}
			}else if(Array.isArray(value)){
                let array = data[key];
                if(array){
                    this.setData(array, value);
                }else{
                    array = [];
                    this.setData(array, value);
                    if(isObject(data)){
                        data[key] = array
                    }else if(Array.isArray(data)){
                        data.push(array)
                    }
                }
			}
        })
    }
    
    getDates(startDate, stopDate) {
        let dateArray = [];
        let currentDate = moment.isMoment(startDate) ? startDate : moment(startDate);
        stopDate = moment.isMoment(stopDate) ? stopDate : moment(stopDate);
        while (currentDate <= stopDate) {
            dateArray.push(currentDate.toDate())
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    }

    array_move(arr: any[], old_index: any, new_index: number) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
    };

    isSameDate(date1, date2, context?){
        return moment(date1).isSame(date2, context ? context : '');
    }

    convertHTML(html){
		const temp = document.createElement("div");
		temp.innerHTML = html;
		return temp.textContent || temp.innerText || "";
    }
    
    verifyProps(obj1: any, obj2: any){
        if(!obj1 || !obj2) return;

        let keys
        if(isObject(obj2)){
            keys = Object.keys(obj2)
        }
        
		keys.map((prop, i) => {
            if(!obj1.hasOwnProperty(prop)){
                obj1 = {...obj1, [prop]: obj2[prop]}
            }
        })

        return obj1
    }

    string_to_slug(str, dash = '-') {
        str = str.replace(/^\s+|\s+$/g, ""); // trim
        str = str.toLowerCase();
      
        // remove accents, swap ñ for n, etc
        var from = `åàáãäâèéëêìíïîòóöôùúüûñç·/${dash},:;`;
        var to = "aaaaaaeeeeiiiioooouuuunc------";
      
        for (var i = 0, l = from.length; i < l; i++) {
          str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
        }
      
        str = str
          .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
          .replace(/\s+/g, dash) // collapse whitespace and replace by -
          .replace(/-+/g, dash) // collapse dashes
          .replace(/^-+/, "") // trim - from start of text
          .replace(/-+$/, ""); // trim - from end of text
      
        return str;
    }

    extend(obj, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] = src[key];
        }
        return obj;
    }

    addLabels(labels: string[], newlabels: string[]){
		newlabels.map(label => {
			if(!intersection(labels, [label]).length){
				labels.push(label)
			}
		})
		return labels
	}

	deleteLabels(labels: string[], toDeleteLabels: string[]){
		toDeleteLabels.map(label => {
			labels = labels.filter(l => l !== label)
		})
		return labels
	}

	hasLabels(labels: string[], toFindLabels: string[]): boolean {
		return intersection(labels, toFindLabels).length ? true : false
	}

	hasLabel(labels: string[], label: string): boolean {
		return intersection(labels, [label]).length ? true : false
    }
    
    b64toBlob(dataURI){
		const parts = dataURI.split(',')
		const byteString = atob(parts[1])
		const ab = new ArrayBuffer(byteString.length)
		const ia = new Uint8Array(ab)
	
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i)
		}
		return new Blob([ab], { type: parts[0].split(';')[0].split(':')[1] })
    }
    
    blobToFile(theBlob: Blob, fileName:string): File {
        var b: any = theBlob;
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        b.lastModifiedDate = new Date();
        b.name = fileName;
    
        //Cast to a File() type
        return <File>theBlob;
    }

    dataURLtoFile(dataurl, filename) {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }

    getPlainText(data: string){
        const newDiv = document.createElement("div")
        newDiv.innerHTML = data
        const textPlain = newDiv.innerText
        return textPlain ? textPlain : null
    }
}
