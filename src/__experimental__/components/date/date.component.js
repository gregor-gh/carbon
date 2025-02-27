import React from "react";
import PropTypes from "prop-types";
import invariant from "invariant";
import styledSystemPropTypes from "@styled-system/prop-types";

import { filterStyledSystemMarginProps } from "../../../style/utils";
import Events from "../../../utils/helpers/events";
import DateHelper from "../../../utils/helpers/date";
import tagComponent from "../../../utils/helpers/tags";
import DatePicker from "./date-picker.component";
import StyledDateInput from "./date.style";
import Textbox from "../textbox";
import withUniqueIdProps from "../../../utils/helpers/with-unique-id-props";
import { isEdge } from "../../../utils/helpers/browser-type-check";

const defaultDateFormat = "DD/MM/YYYY";
const hiddenDateFormat = "YYYY-MM-DD";

const marginPropTypes = filterStyledSystemMarginProps(
  styledSystemPropTypes.space
);

// Spacing props filtering is a temporary solution until FormField and all related components are refactored
// FIXME FE-3370
const filterOutSpacingProps = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !styledSystemPropTypes.space[key])
  );

class BaseDateInput extends React.Component {
  isBlurBlocked = false;

  isOpening = false;

  inputHasFocus = this.props.autoFocus || false;

  isControlled = this.props.value !== undefined;

  initialVisibleValue = generateAdjustedValue(this.props);

  inputFocusedViaPicker = false;

  hasMounted = false;

  state = {
    isDatePickerOpen: false,
    /** Date object to pass to the DatePicker */
    selectedDate: DateHelper.stringToDate(
      isoFormattedValueString(this.initialVisibleValue)
    ),
    /** Displayed value, format dependent on a region */
    visibleValue: this.initialVisibleValue,
    /** Stores last valid values to be emitted onBlur if current input is invalid */
    lastValidEventValues: {
      formattedValue: this.initialVisibleValue,
      rawValue: isoFormattedValueString(this.initialVisibleValue),
    },
    shouldPickerOpen: false,
  };

  componentDidMount() {
    this.hasMounted = true;
    if (this.props.autoFocus) {
      this.isAutoFocused = true;
      this.openDatePicker(true);
      this.setState({ shouldPickerOpen: true });
    }
  }

  componentDidUpdate(prevProps) {
    const message =
      "Input elements should not switch from uncontrolled to controlled (or vice versa). " +
      "Decide between using a controlled or uncontrolled input element for the lifetime of the component";
    invariant(this.isControlled === (this.props.value !== undefined), message);

    if (
      this.isControlled &&
      !this.inputHasFocus &&
      this.hasValueChanged(prevProps)
    ) {
      this.updateSelectedDate(this.props.value);
    }
  }

  componentWillUnmount() {
    this.hasMounted = false;
  }

  hasValueChanged = (prevProps) => {
    if (this.props.allowEmptyValue) {
      return prevProps.value !== this.props.value;
    }
    return this.props.value && prevProps.value !== this.props.value;
  };

  assignInput = (input) => {
    this.input = input.current;
    this.inputRef = input;
  };

  shouldAllowBlur = () => {
    return isEdge(navigator) && !this.inputFocusedViaPicker;
  };

  shouldBlockBlur = () => {
    const { disabled, readOnly } = this.props;
    const block =
      this.isBlurBlocked ||
      this.inputFocusedViaPicker ||
      this.input === document.activeElement;
    if (disabled || readOnly || block) {
      this.inputFocusedViaPicker = this.input === document.activeElement;
      // needed to block blur properly in Edge
      if (!this.shouldAllowBlur()) {
        return true;
      }
    }
    return false;
  };

  handleBlur = () => {
    // needed to make blur work properly in Edge
    // https://stackoverflow.com/a/24695316/10894881
    setTimeout(() => {
      this.inputHasFocus = false;

      if (this.shouldBlockBlur()) {
        return;
      }

      this.reformatVisibleDate();

      if (this.props.onBlur && !this.state.isDatePickerOpen) {
        const dateWithSlashes = DateHelper.sanitizeDateInput(
          this.state.visibleValue
        );
        const event = this.buildCustomEvent(
          { target: this.input, type: "blur" },
          isoFormattedValueString(dateWithSlashes)
        );
        this.props.onBlur(event);
      }
    }, 0);
  };

  handleFocus = (ev) => {
    this.inputHasFocus = true;
    const { disabled, readOnly } = this.props;

    if (disabled || readOnly) return;

    if (this.isAutoFocused) {
      this.isAutoFocused = false;
    } else {
      this.openDatePicker();
    }

    if (this.props.onFocus) {
      this.props.onFocus(ev);
    }
  };

  handleKeyDown = (ev) => {
    if (this.props.onKeyDown) this.props.onKeyDown(ev);

    if (Events.isTabKey(ev)) {
      this.isOpening = false;
      this.inputFocusedViaPicker = false;
      this.closeDatePicker();
    }
  };

  openDatePicker = (openedOnMount) => {
    document.addEventListener("click", this.closeDatePicker);

    if (!openedOnMount && this.inputFocusedViaPicker) {
      this.isBlurBlocked = true;
      return;
    }
    this.updateSelectedDate(
      this.props.value || isoFormattedValueString(this.state.visibleValue)
    );
    this.setState({ isDatePickerOpen: true });
  };

  updateValidEventValues = (value) => {
    if (this.hasMounted) {
      this.setState({
        visibleValue: DateHelper.formatDateToCurrentLocale(value),
        lastValidEventValues: {
          formattedValue: DateHelper.formatDateToCurrentLocale(value),
          rawValue: isoFormattedValueString(value),
        },
      });
    }
  };

  reformatVisibleDate = () => {
    const { lastValidEventValues, visibleValue } = this.state;
    if (
      DateHelper.isValidDate(visibleValue) ||
      this.canBeEmptyValues(visibleValue)
    ) {
      this.updateValidEventValues(visibleValue);
    } else if (!visibleValue.length) {
      this.updateValidEventValues(lastValidEventValues.formattedValue);
    }
  };

  closeDatePicker = () => {
    if (this.isOpening) {
      this.isOpening = false;
      return;
    }

    document.removeEventListener("click", this.closeDatePicker);
    this.setState({ isDatePickerOpen: false, shouldPickerOpen: false }, () => {
      this.isBlurBlocked = false;
      if (this.input !== document.activeElement) {
        this.handleBlur();
      }
    });
  };

  handleIconClick = () => {
    if (this.props.disabled || this.props.readOnly) return;
    this.isOpening = true;
    this.setState(
      ({ shouldPickerOpen }) => ({
        shouldPickerOpen: !shouldPickerOpen,
      }),
      () => {
        if (this.state.shouldPickerOpen) {
          this.isBlurBlocked = true;
          this.inputFocusedViaPicker = false;
          this.openDatePicker();
        } else {
          this.inputFocusedViaPicker = false;
          this.isOpening = false;
          this.closeDatePicker();
        }
      }
    );
  };

  handleDateSelect = (selectedDate) => {
    const stringDateIso = DateHelper.formatDateString(selectedDate);
    this.isBlurBlocked = true;
    this.isOpening = false;
    this.updateVisibleValue(stringDateIso);
  };

  updateVisibleValue = (date) => {
    const visibleValue = DateHelper.formatDateToCurrentLocale(date);
    const newDate = this.getDateObject(date);

    this.setState(
      {
        selectedDate: newDate,
      },
      () => {
        this.updateValidEventValues(visibleValue);
        const event = { target: this.input };
        event.target.value = visibleValue;
        this.emitOnChangeCallback(event, date);
        this.focusInput();
      }
    );
  };

  focusInput = () => {
    this.inputFocusedViaPicker = true;
    this.isOpening = false;
    this.closeDatePicker();
    this.input.focus();
    this.isBlurBlocked = false;
  };

  handleVisibleInputChange = (ev) => {
    const { disabled, readOnly } = this.props;
    const value = ev.target.value.formattedValue || ev.target.value;
    const dateWithSlashes = DateHelper.sanitizeDateInput(value);
    const isValidDate = DateHelper.isValidDate(dateWithSlashes);
    let isoDateString;

    if (disabled || readOnly) return;

    this.isBlurBlocked = false;

    if (isValidDate || this.canBeEmptyValues(value)) {
      isoDateString = isoFormattedValueString(dateWithSlashes);
      this.updateSelectedDate(isoDateString);
      this.emitOnChangeCallback(ev, isoDateString);
    }

    this.setState({ visibleValue: value });
  };

  updateSelectedDate = (newValue) => {
    let selectedDate;
    let visibleValue;
    if (!newValue.length) {
      selectedDate = newValue;
      visibleValue = newValue;
    } else {
      selectedDate = this.getDateObject(newValue);
      visibleValue = DateHelper.formatDateToCurrentLocale(newValue);
    }

    this.setState({ selectedDate, visibleValue });
  };

  getDateObject = (newValue) => {
    if (!DateHelper.isValidDate(newValue)) {
      return DateHelper.stringToDate(DateHelper.todayFormatted());
    }

    return DateHelper.stringToDate(isoFormattedValueString(newValue));
  };

  emitOnChangeCallback = (ev, isoFormattedValue) => {
    if (this.props.onChange) {
      const event = this.buildCustomEvent(ev, isoFormattedValue);
      this.props.onChange(event);
    }
  };

  canBeEmptyValues = (value) => {
    return this.props.allowEmptyValue && !value.length;
  };

  buildCustomEvent = (ev, isoFormattedValue) => {
    const { type } = ev;
    const { id, name, value } = ev.target;
    const { lastValidEventValues } = this.state;
    const validRawValue = DateHelper.isValidDate(isoFormattedValue);
    const validValues = this.canBeEmptyValues(value)
      ? { formattedValue: "", rawValue: "" }
      : lastValidEventValues;
    ev.target = {
      ...(name && { name }),
      ...(id && { id }),
      value: {
        ...validValues,
        ...(validRawValue && {
          formattedValue: DateHelper.formatDateToCurrentLocale(value),
        }),
        ...(validRawValue && { rawValue: isoFormattedValue }),
        ...(type === "blur" && { formattedValue: value, rawValue: value }),
      },
    };
    return ev;
  };

  renderDatePicker = (dateRangeProps) => {
    if (!this.state.isDatePickerOpen) return null;

    let { visibleValue } = this.state;

    if (!DateHelper.isValidDate(visibleValue)) {
      visibleValue = "";
    }

    return (
      <div onClick={this.markCurrentDatepicker} role="presentation">
        <DatePicker
          inputElement={this.inputRef}
          selectedDate={this.state.selectedDate}
          handleDateSelect={this.handleDateSelect}
          inputDate={visibleValue}
          disablePortal={this.props.disablePortal}
          size={this.props.size}
          {...dateRangeProps}
        />
      </div>
    );
  };

  markCurrentDatepicker = () => {
    if (this.props.disabled || this.props.readOnly) return;
    this.isOpening = true;
    this.inputFocusedViaPicker = false;
    this.isBlurBlocked = true;
    this.openDatePicker();
  };

  hiddenValue = () => {
    if (DateHelper.isValidDate(this.state.visibleValue)) {
      return DateHelper.formatValue(this.state.visibleValue, hiddenDateFormat);
    }
    return this.state.lastValidEventValues.rawValue;
  };

  renderHiddenInput = () => {
    const props = {
      name: this.props.name,
      type: "hidden",
      "data-element": "hidden-input",
      value: this.hiddenValue(),
    };

    return <input {...props} />;
  };

  render() {
    const {
      minDate,
      maxDate,
      labelInline,
      adaptiveLabelBreakpoint,
      disablePortal,
      ...inputProps
    } = this.props;

    let events = {};
    delete inputProps.defaultValue;
    delete inputProps.value;

    events = {
      onBlur: this.handleBlur,
      onChange: this.handleVisibleInputChange,
      onFocus: this.handleFocus,
      onKeyDown: this.handleKeyDown,
      onClick: this.handleIconClick,
      iconOnClick: this.handleIconClick,
    };

    return (
      <StyledDateInput
        role="presentation"
        size={inputProps.size}
        labelInline={labelInline}
        {...tagComponent("date", this.props)}
        {...filterStyledSystemMarginProps(this.props)}
      >
        <Textbox
          {...filterOutSpacingProps(inputProps)}
          inputIcon="calendar"
          value={this.state.visibleValue}
          labelInline={labelInline}
          rawValue={isoFormattedValueString(this.state.visibleValue)}
          inputRef={this.assignInput}
          adaptiveLabelBreakpoint={adaptiveLabelBreakpoint}
          {...events}
        />
        {this.renderHiddenInput()}
        {this.renderDatePicker({ minDate, maxDate })}
      </StyledDateInput>
    );
  }
}

function isoFormattedValueString(valueToFormat) {
  return DateHelper.formatValue(valueToFormat);
}

function generateAdjustedValue({ value, defaultValue, allowEmptyValue }) {
  if (value !== undefined && canReturnValue(value, allowEmptyValue)) {
    return DateHelper.formatDateToCurrentLocale(value);
  }
  if (canReturnValue(defaultValue, allowEmptyValue)) {
    return DateHelper.formatDateToCurrentLocale(defaultValue);
  }
  return DateHelper.formatDateToCurrentLocale(DateHelper.todayFormatted());
}

function isValidInitialFormat(value) {
  return DateHelper.isValidDate(value, { defaultValue: hiddenDateFormat });
}

function canReturnValue(value, allowEmptyValue) {
  if (!allowEmptyValue && value && value.length) {
    const message =
      "The Date component must be initialised with a value in the iso (YYYY-MM-DD) format";
    invariant(isValidInitialFormat(value), message);
  }

  return isValidInitialFormat(value) || (allowEmptyValue && !value);
}

const DateInput = withUniqueIdProps(BaseDateInput);

BaseDateInput.propTypes = {
  ...Textbox.propTypes,
  ...marginPropTypes,
  /** Boolean to allow the input to have an empty value */
  allowEmptyValue: PropTypes.bool,
  /** Automatically focus on component mount */
  autoFocus: PropTypes.bool,
  /** Boolean to toggle where DatePicker is rendered in relation to the Date Input */
  disablePortal: PropTypes.bool,
  /** Minimum possible date YYYY-MM-DD */
  minDate: PropTypes.string,
  /** Maximum possible date YYYY-MM-DD */
  maxDate: PropTypes.string,
  /** Specify a callback triggered on blur */
  onBlur: PropTypes.func,
  /** Specify a callback triggered on change */
  onChange: PropTypes.func,
  /** Specify a callback triggered on focus */
  onFocus: PropTypes.func,
  /** Name of the input */
  name: PropTypes.string,
  /** The current date YYYY-MM-DD */
  value: PropTypes.string,
  /** Breakpoint for adaptive label (inline labels change to top aligned). Enables the adaptive behaviour when set */
  adaptiveLabelBreakpoint: PropTypes.number,
  /** Flag to configure component as mandatory */
  required: PropTypes.bool,
};

BaseDateInput.defaultProps = {
  disablePortal: false,
};

export { defaultDateFormat, BaseDateInput };
export default DateInput;
