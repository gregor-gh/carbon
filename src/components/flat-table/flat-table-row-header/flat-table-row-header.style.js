import styled, { css } from "styled-components";
import { space } from "styled-system";

import baseTheme from "../../../style/themes/base";

const verticalBorderSizes = {
  small: "1px",
  medium: "2px",
  large: "4px",
};

const StyledFlatTableRowHeader = styled.th`
  ${({
    align,
    theme,
    colWidth,
    leftPosition,
    isTruncated,
    expandable,
    verticalBorder,
  }) => css`
    background-color: #fff;
    border: 1px solid ${theme.table.secondary};
    border-top: none;
    box-sizing: border-box;
    left: 0;
    font-weight: normal;
    position: sticky;
    text-align: ${align};
    top: auto;
    vertical-align: middle;
    padding: 0;
    z-index: ${baseTheme.zIndex.overlay};

    ${colWidth &&
    css`
      width: ${colWidth}px;
    `}

    &&& {
      > div {
        box-sizing: border-box;

        ${isTruncated &&
        css`
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        `}

        ${colWidth &&
        css`
          width: ${colWidth}px;
        `}
 
        ${space}
      }
    }

    &&& {
      left: ${leftPosition}px;
    }

    ${expandable &&
    css`
      white-space: nowrap;
    `}

    ${verticalBorder &&
    css`
      &&& {
        border-right: ${verticalBorderSizes[verticalBorder]} solid
          ${theme.table.secondary};
      }
    `}
  `}
`;

StyledFlatTableRowHeader.defaultProps = {
  theme: baseTheme,
};

const StyledFlatTableRowHeaderContent = styled.div`
  ${({ expandable }) =>
    expandable &&
    css`
      display: flex;
      align-items: center;
      line-height: 1em;
    `}
`;

StyledFlatTableRowHeaderContent.defaultProps = {
  theme: baseTheme,
};

export { StyledFlatTableRowHeader, StyledFlatTableRowHeaderContent };
