import * as React from "react";
import { MarginProps } from "styled-system";
import { ValidationPropTypes } from "../../../components/validations";

interface DayMonthDate {
  dd: string;
  mm: string;
}

interface MonthYearDate {
  mm: string;
  yyyy: string;
}

interface FullDate extends DayMonthDate {
  yyyy: string;
}

interface NumeralDateEvent {
  target: {
    name: string;
    id: string;
    value: DayMonthDate | MonthYearDate | FullDate;
  };
}

export interface NumeralDateProps extends ValidationPropTypes, MarginProps {
  /** Breakpoint for adaptive label (inline labels change to top aligned). Enables the adaptive behaviour when set */
  adaptiveLabelBreakpoint?: number;
  /* Array of strings to define custom input layout.
  Allowed formats:
  ['dd', 'mm', 'yyyy'],
  ['mm', 'dd', 'yyyy'],
  ['dd', 'mm'],
  ['mm', 'dd'],
  ['mm', 'yyyy'] */
  dateFormat?:
    | ["dd", "mm", "yyyy"]
    | ["mm", "dd", "yyyy"]
    | ["dd", "mm"]
    | ["mm", "dd"]
    | ["mm", "yyyy"];
  /** Default value for use in uncontrolled mode  */
  defaultValue?: DayMonthDate | MonthYearDate | FullDate;
  /**  Value for use in controlled mode  */
  value?: DayMonthDate | MonthYearDate | FullDate;
  /** When true, enables the internal errors to be displayed */
  enableInternalError?: boolean;
  /** When true, enables the internal warnings to be displayed */
  enableInternalWarning?: boolean;
  /** Help content to be displayed under an input */
  fieldHelp?: React.ReactNode;
  /** `id` for events */
  id?: string;
  /** `name` for events */
  name?: string;
  /** Label */
  label?: string;
  /** Label alignment. Works only when labelInline is true */
  labelAlign?: "left" | "right";
  /** Text applied to label help tooltip */
  labelHelp?: React.ReactNode;
  /** When true, label is placed in line with an input */
  labelInline?: boolean;
  /** Label width */
  labelWidth?: number;
  /** Blur event handler  */
  onBlur?: (ev: NumeralDateEvent) => void;
  /** Change event handler */
  onChange?: (ev: NumeralDateEvent) => void;
  /** Flag to configure component as mandatory */
  required?: boolean;
  /** When true, validation icons will be placed on labels instead of being placed on the inputs */
  validationOnLabel?: boolean;
}

declare function NumeralDate(props: NumeralDateProps): JSX.Element;

export default NumeralDate;
