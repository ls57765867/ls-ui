import { componentSizes, datePickTypes } from '@ls-ui/constants';
import type { ComponentSize, DatePickType } from '@ls-ui/constants';

export const isValidComponentSize = (val: string): val is ComponentSize | '' => ['', ...componentSizes].includes(val);

export const isValidDatePickType = (val: string): val is DatePickType => ([...datePickTypes] as string[]).includes(val);
