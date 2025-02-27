import React from "react";
import PropTypes from "prop-types";
import styledSystemPropTypes from "@styled-system/prop-types";

import {
  StyledFieldset,
  StyledFieldsetContent,
  StyledLegendContainer,
} from "./fieldset.style";
import ValidationIcon from "../../components/validations/validation-icon.component";
import { InputGroupBehaviour, InputGroupContext } from "../input-behaviour";
import { filterStyledSystemMarginProps } from "../../style/utils";

const marginPropTypes = filterStyledSystemMarginProps(
  styledSystemPropTypes.space
);

const Fieldset = ({
  legend,
  children,
  inline,
  legendWidth,
  legendAlign = "right",
  legendSpacing = 2,
  error,
  warning,
  info,
  isRequired,
  blockGroupBehaviour,
  ...rest
}) => (
  <InputGroupBehaviour blockGroupBehaviour={blockGroupBehaviour}>
    <StyledFieldset data-component="fieldset" m={0} {...rest}>
      <StyledFieldsetContent inline={inline}>
        {legend && (
          <StyledLegendContainer
            inline={inline}
            width={legendWidth}
            align={legendAlign}
            rightPadding={legendSpacing}
            isRequired={isRequired}
          >
            <InputGroupContext.Consumer>
              {({ onMouseEnter, onMouseLeave }) => (
                <legend onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                  {legend}
                </legend>
              )}
            </InputGroupContext.Consumer>
            <ValidationIcon
              error={error}
              warning={warning}
              info={info}
              tooltipFlipOverrides={["top", "bottom"]}
            />
          </StyledLegendContainer>
        )}
        {children}
      </StyledFieldsetContent>
    </StyledFieldset>
  </InputGroupBehaviour>
);

Fieldset.propTypes = {
  /** Filtered styled system margin props */
  ...marginPropTypes,
  /** Fieldset content */
  children: PropTypes.node.isRequired,
  /** The content for the Fieldset Legend */
  legend: PropTypes.string,
  /** Indicate that error has occurred
  Pass string to display icon, tooltip and red border
  Pass true boolean to only display red border */
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /** Indicate that warning has occurred
  Pass string to display icon, tooltip and orange border
  Pass true boolean to only display orange border */
  warning: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /** Indicate additional information
  Pass string to display icon, tooltip and blue border
  Pass true boolean to only display blue border */
  info: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /** When true, legend is placed in line with the children */
  inline: PropTypes.bool,
  /** Percentage width of legend (only when legend is inline)  */
  legendWidth: PropTypes.number,
  /** Text alignment of legend when inline */
  legendAlign: PropTypes.oneOf(["left", "right"]),
  /** Spacing between legend and field for inline legend, number multiplied by base spacing unit (8) */
  legendSpacing: PropTypes.oneOf([1, 2]),
  /** If true, an asterisk will be added to the label */
  isRequired: PropTypes.bool,
  /** Controls whether group behaviour should be enabled */
  blockGroupBehaviour: PropTypes.bool,
};

Fieldset.defaultProps = {
  inline: false,
};

export default Fieldset;
