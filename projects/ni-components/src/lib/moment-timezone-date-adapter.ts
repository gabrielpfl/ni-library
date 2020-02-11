import { Inject, Injectable, Optional, NgModule } from '@angular/core';
import { MAT_DATE_LOCALE, MatDatepickerModule, MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';   
import { MomentDateAdapter, MatMomentDateAdapterOptions, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import * as _moment from 'moment-timezone';
const moment = _moment

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
	parse: {
	  dateInput: 'LL',
	},
	display: {
	  dateInput: 'LL',
	  monthYearLabel: 'MMM YYYY',
	  dateA11yLabel: 'LL',
	  monthYearA11yLabel: 'MMMM YYYY',
	},
};

const TIMEZONE = 'UTC'

@Injectable()
export class MomentTimezoneDateAdapter extends MomentDateAdapter {

	constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
		super(dateLocale);
	}

	createDate(year: number, month: number, date: number): Moment {
		// Moment.js will create an invalid date if any of the components are out of bounds, but we
		// explicitly check each case so we can throw more descriptive errors.
		if (month < 0 || month > 11) {
			throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
		}

		if (date < 1) {
			throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
		}

		//let result = moment.utc({ year, month, date }).locale(this.locale);
		//let result = moment.utc({ year, month, date });
		let result: Moment = moment([ year, month, date ]).tz(TIMEZONE).hour(0)
		result = result.minute(0)
		result = result.second(0)
		result = result.millisecond(0)

		//const utcOffset = result.utcOffset()
		//if(Math.sign(utcOffset) === -1){
			//result = result.subtract(utcOffset*-1, 'minutes')
		//}else if(Math.sign(utcOffset) === 1){
			//result = result.add(utcOffset, 'minutes')
		//}

		// If the result isn't valid, the date must have been out of bounds for this month.
		if (!result.isValid()) {
			throw Error(`Invalid date "${date}" for month with index "${month}".`);
		}

		return result;
	}

	/**
	 * Returns the given value if given a valid Moment or null. Deserializes valid ISO 8601 strings
	 * (https://www.ietf.org/rfc/rfc3339.txt) and valid Date objects into valid Moments and empty
	 * string into null. Returns an invalid date for all other values.
	 */
	deserialize(value: any): Moment | null {
		let date;
		if (value instanceof Date) {
		date = this.createMoment(value).locale(this.locale);
		} else if (this.isDateInstance(value)) {
		// Note: assumes that cloning also sets the correct locale.
		return this.clone(value);
		}
		if (typeof value === 'string') {
		if (!value) {
			return null;
		}
		date = this.createMoment(value, moment.ISO_8601).locale(this.locale);
		}
		if (date && this.isValid(date)) {
		return this.createMoment(date).locale(this.locale);
		}
		return super.deserialize(value);
	}

	/** Creates a Moment instance while respecting the current UTC settings. */
	private createMoment(...args: any[]): Moment {
		let result: Moment = moment(...args).tz(TIMEZONE).hour(0)
		result = result.minute(0)
		result = result.second(0)
		result = result.millisecond(0)
		return result;
	}

}

@NgModule({
	declarations: [],
	imports: [],
	exports: [MatDatepickerModule, MatNativeDateModule],
	providers: [
		{provide: DateAdapter, useClass: MomentTimezoneDateAdapter},
		{provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
	]
})

export class MomentTimezoneDateAdapterModule {

}