/**
 * widgets/index.js: interactive components that can be dropped into a
 * Markdown article with a line such as   [[widget:token-calculator]]
 *
 * To add one: write the component in this folder and list it below.
 */
import TokenCalculator from './TokenCalculator.jsx';

export const widgets = {
  'token-calculator': TokenCalculator,
};
