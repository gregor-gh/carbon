import React from "react";
import propTypes from "@styled-system/prop-types";
import PropTypes from "prop-types";
import { StyledDl, StyledDtDiv, StyledDdDiv } from "./definition-list.style";
import Dt from "./dt.component";

const Dl = ({
  children,
  w = 50,
  dtTextAlign = "right",
  ddTextAlign = "left",
  ...rest
}) => {
  const listChildren = React.Children.toArray(children);

  const wrapChild = (child, key) => {
    let wrappedChild;

    if (child?.type === Dt) {
      wrappedChild = (
        <StyledDtDiv key={key} dtTextAlign={dtTextAlign}>
          {child}
        </StyledDtDiv>
      );
    } else {
      wrappedChild = (
        <StyledDdDiv key={key} ddTextAlign={ddTextAlign}>
          {child}
        </StyledDdDiv>
      );
    }

    return wrappedChild;
  };

  const composeContent = (childArray) => {
    const contentArray = [];

    childArray.forEach((child) => {
      if (child?.type === React.Fragment) {
        const fragmentList = child.props.children.map(
          (fragmentChild, fragmentIndex) =>
            wrapChild(fragmentChild, contentArray.length + fragmentIndex)
        );

        contentArray.push(fragmentList);
      } else {
        contentArray.push(wrapChild(child, contentArray.length));
      }
    });

    return contentArray;
  };

  return (
    <StyledDl w={w} data-component="dl" {...rest}>
      {composeContent(listChildren)}
    </StyledDl>
  );
};

Dl.propTypes = {
  ...propTypes.space,
  /** Child elements */
  children: PropTypes.node.isRequired,
  /** This string will specify the text align styling of the `<dt></dt>`. */
  dtTextAlign: PropTypes.oneOf(["left", "center", "right"]),
  /** This string will specify the text align styling of the `<dd></dd>`. */
  ddTextAlign: PropTypes.oneOf(["left", "center", "right"]),
  /** This value will specify the width of the `StyledDtDiv` as a percentage. The remaining space will be taken up
      by the `StyledDdDiv`.
   */
  w: PropTypes.number,
};
export default Dl;
