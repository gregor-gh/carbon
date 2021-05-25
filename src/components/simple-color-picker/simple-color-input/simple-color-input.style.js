import styled from "styled-components";
import baseTheme from "../../../style/themes/base";
import { Input as SimpleColorInput } from "../../../__experimental__/components/input";
import StyledColorSampleBox from "../color-sample-box/color-sample-box.style";

const StyledSimpleColorInput = styled(SimpleColorInput)`
  position: absolute;
  opacity: 0;
  height: 56px;
  width: 56px;
  margin: 0;

  &:hover {
    cursor: pointer;
  }

  &:focus + ${StyledColorSampleBox} {
    box-shadow: inset 0px 0px 0px 3px ${({ theme }) => theme.colors.white};
    border: 2px solid ${({ theme }) => theme.colors.focus};
  }
`;

StyledSimpleColorInput.defaultProps = {
  theme: baseTheme,
};

export default StyledSimpleColorInput;
