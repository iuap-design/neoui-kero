/**
 * Module : Kero webpack entry index
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 14:51:05
 */
import {extend} from 'tinper-sparrow/js/extend';

import {BaseAdapter} from './core/baseAdapter';
import {CheckboxAdapter} from './component/keroa-checkbox';
import {CkEditorAdapter} from './component/keroa-ckeditor';
import {ComboboxAdapter} from './component/keroa-combo';
import {CurrencyAdapter} from './component/keroa-currency';
import {DateTimeAdapter} from './component/keroa-datetimepicker';
import {FloatAdapter} from './component/keroa-float';
import {GridAdapter} from './component/keroa-grid';
import {IntegerAdapter} from './component/keroa-integer';
import {MonthAdapter} from './component/keroa-month';
import {PaginationAdapter} from './component/keroa-pagination';
import {PassWordAdapter} from './component/keroa-password';
import {PercentAdapter} from './component/keroa-percent';
import {PhoneNumberAdapter} from './component/keroa-phoneNumber';
import {LandLineAdapter} from './component/keroa-landLine';
import {StringAdapter} from './component/keroa-string';
import {ProgressAdapter} from './component/keroa-progress';
import {RadioAdapter} from './component/keroa-radio';
import {SwitchAdapter} from './component/keroa-switch';
import {TextAreaAdapter} from './component/keroa-textarea';
import {TextFieldAdapter} from './component/keroa-textfield';
import {TimeAdapter} from './component/keroa-time';
import {UrlAdapter} from './component/keroa-url';
import {YearAdapter} from './component/keroa-year';
import {YearMonthAdapter} from './component/keroa-yearmonth';
import {MonthDateAdapter} from "./component/keroa-monthdate";
import {TreeAdapter} from './component/keroa-tree';
import {MultilangAdapter} from './component/keroa-multilang';

import {EnableMixin} from './core/enableMixin';
import {RequiredMixin} from './core/requiredMixin';
import {ValidateMixin} from './core/validateMixin';
import {ValueMixin} from './core/valueMixin';

// console.log(TextAreaAdapter);

var ex = {
	BaseAdapter: BaseAdapter,
	CheckboxAdapter: CheckboxAdapter,
	CkEditorAdapter: CkEditorAdapter,
	ComboboxAdapter: ComboboxAdapter,
	CurrencyAdapter: CurrencyAdapter,
	DateTimeAdapter: DateTimeAdapter,
	FloatAdapter: FloatAdapter,
	IntegerAdapter: IntegerAdapter,
	MonthAdapter: MonthAdapter,
	MonthDateAdapter: MonthDateAdapter,
	PaginationAdapter: PaginationAdapter,
	PassWordAdapter: PassWordAdapter,
	PercentAdapter: PercentAdapter,
	PhoneNumberAdapter: PhoneNumberAdapter,
	LandLineAdapter: LandLineAdapter,
	StringAdapter: StringAdapter,
	ProgressAdapter: ProgressAdapter,
	RadioAdapter: RadioAdapter,
	SwitchAdapter: SwitchAdapter,
	TextAreaAdapter: TextAreaAdapter,
	TextFieldAdapter: TextFieldAdapter,
	TimeAdapter: TimeAdapter,
	UrlAdapter: UrlAdapter,
	YearAdapter: YearAdapter,
	YearMonthAdapter: YearMonthAdapter,
	EnableMixin: EnableMixin,
	RequiredMixin: RequiredMixin,
	ValidateMixin: ValidateMixin,
	ValueMixin: ValueMixin,
	MultilangAdapter: MultilangAdapter
};

extend(ex,window.u || {});
window.u = ex;
export { ex as u };
