/**
 * Module : Kero webpack entry index
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 14:51:05
 */
import {extend} from 'neoui-sparrow/js/extend';

import {BaseAdapter} from './baseAdapter';
import {CheckboxAdapter} from './checkbox';
import {CkEditorAdapter} from './ckeditor';
import {ComboboxAdapter} from './combobox';
import {CurrencyAdapter} from './currency';
import {DateTimeAdapter} from './datetime';
import {FloatAdapter} from './float';
import {GridAdapter} from './grid';
import {IntegerAdapter} from './integer';
import {MonthAdapter} from './month';
import {NativeCheckAdapter} from './native-checkbox';
import {NativeRadioAdapter} from './native-radio';
import {PaginationAdapter} from './pagination';
import {PassWordAdapter} from './password';
import {PercentAdapter} from './percent';
import {StringAdapter} from './string';
import {ProgressAdapter} from './progress';
import {RadioAdapter} from './radio';
import {SwitchAdapter} from './switch';
import {TextAreaAdapter} from './textarea';
import {TextFieldAdapter} from './textfield';
import {TimeAdapter} from './time';
import {UrlAdapter} from './url';
import {YearAdapter} from './year';
import {YearMonthAdapter} from './yearmonth';
import {TreeAdapter} from './tree';
import {EnableMixin} from './enableMixin';
import {RequiredMixin} from './requiredMixin';
import {ValidateMixin} from './validateMixin';
import {ValueMixin} from './valueMixin';

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
	NativeCheckAdapter: NativeCheckAdapter,
	NativeRadioAdapter: NativeRadioAdapter,
	PaginationAdapter: PaginationAdapter,
	PassWordAdapter: PassWordAdapter,
	PercentAdapter: PercentAdapter,
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
	ValueMixin: ValueMixin
};

extend(ex,window.u || {});
window.u = ex;
export { ex as u };