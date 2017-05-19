/**
 * Module : Kero webpack entry index
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 14:51:05
 */
import { extend } from 'tinper-sparrow/src/extend';

import { BaseAdapter } from './keroa-baseAdapter';
import { CascaderAdapter } from './keroa-cascader';
import { CheckboxAdapter } from './keroa-checkbox';
import { CkEditorAdapter } from './keroa-ckeditor';
import { ComboboxAdapter } from './keroa-combo';
import { CurrencyAdapter } from './keroa-currency';
import { DateTimeAdapter } from './keroa-datetimepicker';
import { FloatAdapter } from './keroa-float';
import { GridAdapter } from './keroa-grid';
import { IntegerAdapter } from './keroa-integer';
import { MonthAdapter } from './keroa-month';
import { PaginationAdapter } from './keroa-pagination';
import { PassWordAdapter } from './keroa-password';
import { PercentAdapter } from './keroa-percent';
import { PhoneNumberAdapter } from './keroa-phoneNumber';
import { LandLineAdapter } from './keroa-landLine';
import { StringAdapter } from './keroa-string';
import { ProgressAdapter } from './keroa-progress';
import { RadioAdapter } from './keroa-radio';
import { SwitchAdapter } from './keroa-switch';
import { TextAreaAdapter } from './keroa-textarea';
import { TextFieldAdapter } from './keroa-textfield';
import { TimeAdapter } from './keroa-time';
import { UrlAdapter } from './keroa-url';
import { YearAdapter } from './keroa-year';
import { YearMonthAdapter } from './keroa-yearmonth';
import { MonthDateAdapter } from "./keroa-monthdate";
import { TreeAdapter } from './keroa-tree';
import { MultilangAdapter } from './keroa-multilang';

import { EnableMixin } from 'neoui-kero-mixin/src/enableMixin';
import { RequiredMixin } from 'neoui-kero-mixin/src/requiredMixin';
import { ValidateMixin } from 'neoui-kero-mixin/src/validateMixin';
import { ValueMixin } from 'neoui-kero-mixin/src/valueMixin';

var ex = {
	BaseAdapter: BaseAdapter,
	CascaderAdapter: CascaderAdapter,
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

extend(ex, window.u || {});
window.u = ex;
export { ex as u };