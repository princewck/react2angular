"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fromPairs = require("lodash.frompairs");
var ngcomponent_1 = require("ngcomponent");
var React = require("react");
var react_dom_1 = require("react-dom");
var HTMLtoJSX = require("htmltojsx");
var Parser = require("html-react-parser");
var converter = new HTMLtoJSX({
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
    var names = bindingNames
        || (Class.propTypes && Object.keys(Class.propTypes))
        || [];
    return {
        bindings: fromPairs(names.map(function (_) { return [_, '<']; })),
        controller: ['$element', '$transclude', '$compile', (function (_super) {
                __extends(class_1, _super);
                function class_1($element, $transclude, $compile) {
                    var _this = 
                    // constructor(private $element: IAugmentedJQuery) {
                    _super.call(this) || this;
                    _this.$element = $element;
                    _this.$transclude = $transclude;
                    _this.$compile = $compile;
                    return _this;
                }
                // render() {
                //   // TODO: rm any when https://github.com/Microsoft/TypeScript/pull/13288 is merged
                //   render(<Class {...(this.props as any)} />, this.$element[0])
                // }
                class_1.prototype.render = function () {
                    var _this = this;
                    var children;
                    this.$transclude(function (clone, scope) {
                        children = Array.prototype.slice.call(clone).map(function (element) {
                            _this.$compile(element)(scope);
                            var phase = scope.$root.$$phase;
                            if (phase !== '$apply' && phase !== '$digest') {
                                scope.$apply();
                            }
                            return converter.convert(element.outerHTML);
                        });
                        _this.transcludedContent = clone;
                        _this.transclusionScope = scope;
                    });
                    react_dom_1.render(React.createElement(Class, __assign({}, this.props), Parser(children && children.join(''))), this.$element[0]);
                };
                class_1.prototype.componentWillUnmount = function () {
                    react_dom_1.unmountComponentAtNode(this.$element[0]);
                };
                class_1.prototype.$onDestroy = function () {
                    _super.prototype.$onDestroy.call(this);
                    this.transcludedContent.remove();
                    this.transclusionScope.$destroy();
                };
                return class_1;
            }(ngcomponent_1.default))],
        transclude: true
    };
}
exports.react2angular = react2angular;
//# sourceMappingURL=index.js.map