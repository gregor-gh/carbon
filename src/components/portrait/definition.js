import Portrait from './';
import Definition from './../../../demo/utils/definition';
import OptionsHelper from 'utils/helpers/options-helper';

let definition = new Definition('portrait', Portrait, {
  description: `Represents a person with their initials or an avatar.`,
  designerNotes: `
* Useful to represent a person, user, or organisation, similar to an avatar.
* Use initials rather than an icon if you prefer.

* __See initials at first, then an avatar on hover?__ Try Profile.
 `,
  propOptions: {
    size: OptionsHelper.sizesFull,
    shape: OptionsHelper.shapesVaried
  },
  propTypes: {
    size: "String",
    src: "String",
    gravatar: "String",
    alt: "String",
    shape: "String",
    initials: "String",
    darkBackground: "Boolean"
  },
  propDescriptions: {
    size: "Defines the size of the Portrait.",
    src: "Define an image source.",
    gravatar: "Define an email address registered with gravatar.",
    alt: "Defines the alt HTML string.",
    shape: "Defines the shape of the Portrait.",
    initials: "Define some initials to render in the Portrait.",
    darkBackground: "Switch to a dark background (requires a re-render)."
  }
});

export default definition;
