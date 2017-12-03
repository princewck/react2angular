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
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("angular");
require("angular-mocks");
var ngimport_1 = require("ngimport");
var React = require("react");
var PropTypes = require("prop-types");
var test_utils_1 = require("react-dom/test-utils");
var _1 = require("./");
var TestOne = (function (_super) {
    __extends(TestOne, _super);
    function TestOne() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestOne.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement("p", null,
                "Foo: ",
                this.props.foo),
            React.createElement("p", null,
                "Bar: ",
                this.props.bar.join(',')),
            React.createElement("p", { onClick: function () { return _this.props.baz(42); } }, "Baz"),
            this.props.children);
    };
    TestOne.prototype.componentWillUnmount = function () { };
    return TestOne;
}(React.Component));
var TestTwo = function (props) {
    return React.createElement("div", null,
        React.createElement("p", null,
            "Foo: ",
            props.foo),
        React.createElement("p", null,
            "Bar: ",
            props.bar.join(',')),
        React.createElement("p", { onClick: function () { return props.baz(42); } }, "Baz"),
        props.children);
};
var TestThree = function () {
    return React.createElement("div", null, "Foo");
};
var TestFour = (function (_super) {
    __extends(TestFour, _super);
    function TestFour() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestFour.prototype.render = function () {
        return React.createElement("div", null, "Foo");
    };
    return TestFour;
}(React.Component));
var TestFive = (function (_super) {
    __extends(TestFive, _super);
    function TestFive() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestFive.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement("p", null,
                "Foo: ",
                this.props.foo),
            React.createElement("p", null,
                "Bar: ",
                this.props.bar.join(',')),
            React.createElement("p", { onClick: function () { return _this.props.baz(42); } }, "Baz"),
            this.props.children);
    };
    TestFive.prototype.componentWillUnmount = function () { };
    TestFive.propTypes = {
        bar: PropTypes.array.isRequired,
        baz: PropTypes.func.isRequired,
        foo: PropTypes.number.isRequired
    };
    return TestFive;
}(React.Component));
var TestAngularOne = _1.react2angular(TestOne, ['foo', 'bar', 'baz']);
var TestAngularTwo = _1.react2angular(TestTwo, ['foo', 'bar', 'baz']);
var TestAngularThree = _1.react2angular(TestThree);
var TestAngularFour = _1.react2angular(TestFour);
angular_1.module('test', ['bcherny/ngimport'])
    .component('testAngularOne', TestAngularOne)
    .component('testAngularTwo', TestAngularTwo)
    .component('testAngularThree', TestAngularThree)
    .component('testAngularFour', TestAngularFour);
angular_1.bootstrap(angular_1.element(), ['test'], { strictDi: true });
describe('react2angular', function () {
    var $compile;
    beforeEach(function () {
        angular_1.mock.module('test');
        angular_1.mock.inject(function (_$compile_) {
            $compile = _$compile_;
        });
    });
    describe('initialization', function () {
        it('should give an angular component', function () {
            expect(TestAngularOne.bindings).not.toBe(undefined);
            expect(TestAngularOne.controller).not.toBe(undefined);
        });
        it('should use the propTypes when present and no bindingNames were specified', function () {
            var reactAngularComponent = _1.react2angular(TestFive);
            expect(reactAngularComponent.bindings).toEqual({
                bar: '<',
                baz: '<',
                foo: '<'
            });
        });
        it('should use the bindingNames when present over the propTypes', function () {
            var reactAngularComponent = _1.react2angular(TestFive, ['foo']);
            expect(reactAngularComponent.bindings).toEqual({
                foo: '<'
            });
        });
        it('should have empty bindings when parameter is an empty array', function () {
            var reactAngularComponent = _1.react2angular(TestFive, []);
            expect(reactAngularComponent.bindings).toEqual({});
        });
        it('should have empty bindings when parameter is not passed', function () {
            expect(_1.react2angular(TestThree).bindings).toEqual({});
        });
    });
    describe('react classes', function () {
        it('should render', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            var element = angular_1.element("<test-angular-one foo=\"foo\" bar=\"bar\" baz=\"baz\"></test-angular-one>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('p').length).toBe(3);
        });
        it('should render (even if the component takes no props)', function () {
            var scope = ngimport_1.$rootScope.$new(true);
            var element = angular_1.element("<test-angular-four></test-angular-four>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.text()).toBe('Foo');
        });
        it('should update', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            var element = angular_1.element("<test-angular-one foo=\"foo\" bar=\"bar\" baz=\"baz\"></test-angular-one>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('p').eq(1).text()).toBe('Bar: true,false');
            scope.$apply(function () {
                return scope.bar = [false, true, true];
            });
            expect(element.find('p').eq(1).text()).toBe('Bar: false,true,true');
        });
        it('should destroy', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            var element = angular_1.element("<test-angular-one foo=\"foo\" bar=\"bar\" baz=\"baz\"></test-angular-one>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            spyOn(TestOne.prototype, 'componentWillUnmount');
            scope.$destroy();
            expect(TestOne.prototype.componentWillUnmount).toHaveBeenCalled();
        });
        it('should take callbacks', function () {
            var baz = jasmine.createSpy('baz');
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: baz,
                foo: 1
            });
            var element = angular_1.element("<test-angular-one foo=\"foo\" bar=\"bar\" baz=\"baz\"></test-angular-one>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            test_utils_1.Simulate.click(element.find('p').eq(2)[0]);
            expect(baz).toHaveBeenCalledWith(42);
        });
        // TODO: support children
        it('should support multiple children', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            // const element = $(`<test-angular-one foo="foo" bar="bar" baz="baz"><span>Transcluded</span></test-angular-one>`)
            var element = angular_1.element("<test-angular-one foo=\"foo\" bar=\"bar\" baz=\"baz\"><h1>transcluded</h1><h2>transcluded</h2></test-angular-one>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            // expect(element.find('span').length).toBe(0)
            expect(element.find('h1').length).toBe(1);
            expect(element.find('h1').text()).toBe('transcluded');
            expect(element.find('h2').length).toBe(1);
            expect(element.find('h2').text()).toBe('transcluded');
        });
        it('should support transclusion of other components', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            var element = angular_1.element("<test-angular-one foo=\"foo\" bar=\"bar\"><test-angular-two foo=\"foo\" bar=\"bar\"></test-angular-two></test-angular-one>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('div').length).toBe(2);
            expect(element.find('p').length).toBe(6);
        });
        it('should update with children', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                foo: 1
            });
            var element = angular_1.element("<test-angular-one foo=\"foo\" bar=\"bar\"><span>{{foo}}</span></test-angular-one>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('span').text()).toBe('1');
        });
    });
    describe('react stateless components', function () {
        it('should render', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            var element = angular_1.element("<test-angular-two foo=\"foo\" bar=\"bar\" baz=\"baz\"></test-angular-two>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('p').length).toBe(3);
        });
        it('should render (even if the component takes no props)', function () {
            var scope = ngimport_1.$rootScope.$new(true);
            var element = angular_1.element("<test-angular-three></test-angular-three>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.text()).toBe('Foo');
        });
        it('should update', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            var element = angular_1.element("<test-angular-two foo=\"foo\" bar=\"bar\" baz=\"baz\"></test-angular-two>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            expect(element.find('p').eq(1).text()).toBe('Bar: true,false');
            scope.$apply(function () {
                return scope.bar = [false, true, true];
            });
            expect(element.find('p').eq(1).text()).toBe('Bar: false,true,true');
        });
        // TODO: figure out how to test this
        xit('should destroy', function () { });
        it('should take callbacks', function () {
            var baz = jasmine.createSpy('baz');
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: baz,
                foo: 1
            });
            var element = angular_1.element("<test-angular-two foo=\"foo\" bar=\"bar\" baz=\"baz\"></test-angular-two>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            test_utils_1.Simulate.click(element.find('p').eq(2)[0]);
            expect(baz).toHaveBeenCalledWith(42);
        });
        // TODO: support children
        it('should support multiple children', function () {
            var scope = Object.assign(ngimport_1.$rootScope.$new(true), {
                bar: [true, false],
                baz: function (value) { return value + 1; },
                foo: 1
            });
            // const element = $(`<test-angular-two foo="foo" bar="bar" baz="baz"><span>Transcluded</span></test-angular-two>`)
            var element = angular_1.element("<test-angular-two foo=\"foo\" bar=\"bar\" baz=\"baz\"><span>Transcluded</span><p>Transcluded</p></test-angular-two>");
            $compile(element)(scope);
            ngimport_1.$rootScope.$apply();
            // expect(element.find('span').length).toBe(0)
            expect(element.find('span').length).toBe(1);
            expect(element.find('p').length).toBe(4);
        });
    });
});
//# sourceMappingURL=test.js.map