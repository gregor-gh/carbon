import ComponentActions from './../../../actions/component';
import OptionsHelper from 'utils/helpers/options-helper';

export default (definition) => {
  definition.propValues["data-binding"] = definition.key + ",value";
  definition.propValues.onChange = ComponentActions.updateDefinitionFromDemo;
  definition.propValues.fieldHelp = 'This text provides help for the input.';
  definition.propValues.label = 'Example ' + definition.name;
  definition.propValues.labelHelp = 'This text provides more information for the label.';
  definition.propOptions.labelAlign = OptionsHelper.alignBinary();
  definition.hiddenProps = definition.hiddenProps.concat(['warnings', 'validations']);
  definition.propRequires.labelWidth = 'labelInline';
  definition.propRequires.labelAlign = 'labelInline';
}
