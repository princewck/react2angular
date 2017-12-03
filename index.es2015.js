"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fromPairs = require("lodash.frompairs");
const ngcomponent_1 = require("ngcomponent");
const React = require("react");
const react_dom_1 = require("react-dom");
const HTMLtoJSX = require("htmltojsx");
const Parser = require("html-react-parser");
const converter = new HTMLtoJSX({
    createClass: false
});
/**
 * Wraps a React component in Angular. Returns a new Angular component.
 *
 * Usage:
 *
 *   ```ts
 *   type Props = { foo: number }
 *   class ReactComponent extends React.Component<Props, S> {}
 *   const AngularComponent = react2angular(ReactComponent, ['foo'])
 *   ```
 */
function react2angular(Class, bindingNames) {
    const names = bindingNames
        || (Class.propTypes && Object.keys(Class.propTypes))
        || [];
    return {
        bindings: fromPairs(names.map(_ => [_, '<'])),
        controller: ['$element', '$transclude', '$compile', class extends ngcomponent_1.default {
                constructor($element, $transclude, $compile) {
                    // constructor(private $element: IAugmentedJQuery) {
                    super();
                    this.$element = $element;
                    this.$transclude = $transclude;
                    this.$compile = $compile;
                }
                // render() {
                //   // TODO: rm any when https://github.com/Microsoft/TypeScript/pull/13288 is merged
                //   render(<Class {...(this.props as any)} />, this.$element[0])
                // }
                render() {
                    let children;
                    this.$transclude((clone, scope) => {
                        children = Array.prototype.slice.call(clone).map((element) => {
                            this.$compile(element)(scope);
                            const phase = scope.$root.$$phase;
                            if (phase !== '$apply' && phase !== '$digest') {
                                scope.$apply();
                            }
                            return converter.convert(element.outerHTML);
                        });
                        this.transcludedContent = clone;
                        this.transclusionScope = scope;
                    });
                    react_dom_1.render(React.createElement(Class, Object.assign({}, this.props), Parser(children && children.join(''))), this.$element[0]);
                }
                componentWillUnmount() {
                    react_dom_1.unmountComponentAtNode(this.$element[0]);
                }
                $onDestroy() {
                    super.$onDestroy();
                    this.transcludedContent.remove();
                    this.transclusionScope.$destroy();
                }
            }],
        transclude: true
    };
}
exports.react2angular = react2angular;
//# sourceMappingURL=index.js.map