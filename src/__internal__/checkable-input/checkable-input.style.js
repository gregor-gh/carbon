import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import FieldHelpStyle from "../../__experimental__/components/field-help/field-help.style";
import { FieldLineStyle } from "../../__experimental__/components/form-field/form-field.style";
import HiddenCheckableInputStyle from "./hidden-checkable-input.style";
import LabelStyle, {
  StyledLabelContainer,
} from "../../__experimental__/components/label/label.style";
import StyledHelp from "../../components/help/help.style";
import baseTheme from "../../style/themes/base";
import StyledValidationIcon from "../../components/validations/validation-icon.style";

const StyledCheckableInput = styled.div`
  display: inline-block;
  position: relative;
`;

const StyledCheckableInputWrapper = styled.div`
  ${({
    disabled,
    fieldHelpInline,
    inputWidth,
    labelWidth,
    labelInline,
    ml,
    reverse,
    theme,
  }) => css`
    ${FieldLineStyle} {
      display: flex;
    }

    ${ml &&
    css`
      margin-left: ${ml};
    `}

    ${StyledLabelContainer} {
      ${labelInline &&
      css`
        justify-content: ${reverse ? "flex-start" : "flex-end"};
      `}
      padding-top: 0;
      width: auto;

      & ${StyledHelp}, & ${StyledValidationIcon} {
        color: ${theme.help.color};
        vertical-align: middle;

        &:hover,
        &:focus {
          color: ${theme.text.color};
        }
      }
    }

    ${FieldHelpStyle} {
      flex-basis: 100%;
    }

    ${disabled &&
    css`
      ${HiddenCheckableInputStyle},
      ${LabelStyle} {
        &:hover,
        &:focus {
          outline: none;
          cursor: not-allowed;
        }
      }
    `}

    ${fieldHelpInline &&
    css`
      ${FieldLineStyle} {
        flex-wrap: nowrap;
      }

      ${StyledCheckableInput} {
        margin-right: 0;
        margin-left: 8px;
      }

      ${FieldHelpStyle} {
        flex-grow: 0;
        flex-basis: auto;
        padding-left: 0;
        width: auto;
      }
    `}

    ${reverse &&
    fieldHelpInline &&
    css`
      ${StyledCheckableInput} {
        margin-left: 0;
      }

      ${FieldHelpStyle} {
        flex-grow: 1;
      }
    `}

    ${inputWidth !== undefined &&
    inputWidth !== 0 &&
    css`
      ${StyledCheckableInput} {
        width: ${inputWidth}% !important;
      }
    `}

    ${labelWidth !== undefined &&
    labelWidth !== 0 &&
    `
      ${StyledLabelContainer} {
        width: ${labelWidth}% !important;
      }
    `}
  `}
`;

StyledCheckableInputWrapper.propTypes = {
  disabled: PropTypes.bool,
  fieldHelpInline: PropTypes.bool,
  inputWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  labelWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  theme: PropTypes.object,
};

StyledCheckableInputWrapper.defaultProps = {
  theme: baseTheme,
};

export { StyledCheckableInput, StyledCheckableInputWrapper };
