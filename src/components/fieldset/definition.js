import Fieldset from './';
import OptionsHelper from '../../utils/helpers/options-helper';
import Definition from './../../../demo/utils/definition';
import textboxDefinition from './../textbox/definition';

let definition = new Definition('fieldset', Fieldset, {
  description: `Allows the user to edit a set of closely related inputs that are grouped together visually.`,
  designerNotes: `
* You can nest any Carbon input into this component.
* Useful for presenting a series of inputs that are closely related, within a wider Form or Pod (e.g. an address or contact details).
* Configure Pod and Fieldset components to work together, or choose the pre-configured Show/Edit Pod component:
* The Show/Edit Pod Component automatically presents content as a read-only Pod, until the user clicks an edit icon, which shows the same information in an editable Fieldset. 
* But, configuring Pod and Fieldset components manually will give you more customization options, like the following.
* Top-aligned labels (Carbon default) or inline right-aligned labels are usually fastest for users.
* Create a single path to completion with your inputs, and between your inputs and the primary action Button.
* Indicate mandatory, or optional fields, whichever is the minority. Think carefully before collecting optional data - don’t collect information you don’t need! Try suffixing ‘(optional)’ after your field label.
* More guidance is available for each of the individual inputs you might place inside this component.


* __Filling in a broad series of inputs?__ Try Form.
* __Viewing content that’s grouped together visually?__ Try Pod.
* __Using Fieldset and Pod components together?__ Try Show/Edit Pod.
* __Creating a new entity that is usually presented in a pod?__ Try Create.
 `,
  propTypes: {
    legend: "String"
  },
  propDescriptions: {
    legend: "Adds a legend to the fieldset."
  }
});

definition.addChildByDefinition(textboxDefinition, {
  fieldHelp: null,
  labelHelp: null,
  labelInline: true,
  label: "First Name",
  labelAlign: "right",
});
definition.addChildByDefinition(textboxDefinition, {
  fieldHelp: null,
  labelHelp: null,
  labelInline: true,
  label: "Last Name",
  labelAlign: "right",
});
definition.addChildByDefinition(textboxDefinition, {
  fieldHelp: null,
  labelHelp: null,
  labelInline: true,
  label: "Address",
  labelAlign: "right",
});
definition.addChildByDefinition(textboxDefinition, {
  fieldHelp: null,
  labelHelp: null,
  labelInline: true,
  label: "City",
  labelAlign: "right",
});
definition.addChildByDefinition(textboxDefinition, {
  fieldHelp: null,
  labelHelp: null,
  labelInline: true,
  label: "Country",
  labelAlign: "right",
});
definition.addChildByDefinition(textboxDefinition, {
  fieldHelp: null,
  labelHelp: null,
  labelInline: true,
  label: "Telephone",
  labelAlign: "right",
});

export default definition;
