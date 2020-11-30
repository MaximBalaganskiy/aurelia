var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@aurelia/kernel", "../../dom.js", "../../platform.js", "../../templating/view.js", "../custom-attribute.js", "../../bindable.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Portal = void 0;
    const kernel_1 = require("@aurelia/kernel");
    const dom_js_1 = require("../../dom.js");
    const platform_js_1 = require("../../platform.js");
    const view_js_1 = require("../../templating/view.js");
    const custom_attribute_js_1 = require("../custom-attribute.js");
    const bindable_js_1 = require("../../bindable.js");
    let Portal = class Portal {
        constructor(factory, originalLoc, p) {
            this.factory = factory;
            this.originalLoc = originalLoc;
            this.p = p;
            this.id = kernel_1.nextId('au$component');
            this.strict = false;
            // to make the shape of this object consistent.
            // todo: is this necessary
            this.currentTarget = p.document.createElement('div');
            this.view = this.factory.create();
            dom_js_1.setEffectiveParentNode(this.view.nodes, originalLoc);
        }
        attaching(initiator, parent, flags) {
            if (this.callbackContext == null) {
                this.callbackContext = this.$controller.scope.bindingContext;
            }
            const newTarget = this.currentTarget = this.resolveTarget();
            this.view.setHost(newTarget);
            return this.$activating(initiator, newTarget, flags);
        }
        detaching(initiator, parent, flags) {
            return this.$deactivating(initiator, this.currentTarget, flags);
        }
        targetChanged() {
            const { $controller } = this;
            if (!$controller.isActive) {
                return;
            }
            const oldTarget = this.currentTarget;
            const newTarget = this.currentTarget = this.resolveTarget();
            if (oldTarget === newTarget) {
                return;
            }
            this.view.setHost(newTarget);
            // TODO(fkleuver): fix and test possible race condition
            const ret = kernel_1.onResolve(this.$deactivating(null, newTarget, $controller.flags), () => {
                return this.$activating(null, newTarget, $controller.flags);
            });
            if (ret instanceof Promise) {
                ret.catch(err => { throw err; });
            }
        }
        $activating(initiator, target, flags) {
            const { activating, callbackContext, view } = this;
            view.setHost(target);
            return kernel_1.onResolve(activating === null || activating === void 0 ? void 0 : activating.call(callbackContext, target, view), () => {
                return this.activate(initiator, target, flags);
            });
        }
        activate(initiator, target, flags) {
            const { $controller, view } = this;
            if (initiator === null) {
                view.nodes.appendTo(target);
            }
            else {
                // TODO(fkleuver): fix and test possible race condition
                return kernel_1.onResolve(view.activate(initiator !== null && initiator !== void 0 ? initiator : view, $controller, flags, $controller.scope), () => {
                    return this.$activated(target);
                });
            }
            return this.$activated(target);
        }
        $activated(target) {
            const { activated, callbackContext, view } = this;
            return activated === null || activated === void 0 ? void 0 : activated.call(callbackContext, target, view);
        }
        $deactivating(initiator, target, flags) {
            const { deactivating, callbackContext, view } = this;
            return kernel_1.onResolve(deactivating === null || deactivating === void 0 ? void 0 : deactivating.call(callbackContext, target, view), () => {
                return this.deactivate(initiator, target, flags);
            });
        }
        deactivate(initiator, target, flags) {
            const { $controller, view } = this;
            if (initiator === null) {
                view.nodes.remove();
            }
            else {
                return kernel_1.onResolve(view.deactivate(initiator, $controller, flags), () => {
                    return this.$deactivated(target);
                });
            }
            return this.$deactivated(target);
        }
        $deactivated(target) {
            const { deactivated, callbackContext, view } = this;
            return deactivated === null || deactivated === void 0 ? void 0 : deactivated.call(callbackContext, target, view);
        }
        resolveTarget() {
            const p = this.p;
            // with a $ in front to make it less confusing/error prone
            const $document = p.document;
            let target = this.target;
            let context = this.renderContext;
            if (target === '') {
                if (this.strict) {
                    throw new Error('Empty querySelector');
                }
                return $document.body;
            }
            if (typeof target === 'string') {
                let queryContext = $document;
                if (typeof context === 'string') {
                    context = $document.querySelector(context);
                }
                if (context instanceof p.Node) {
                    queryContext = context;
                }
                target = queryContext.querySelector(target);
            }
            if (target instanceof p.Node) {
                return target;
            }
            if (target == null) {
                if (this.strict) {
                    throw new Error('Portal target not found');
                }
                return $document.body;
            }
            return target;
        }
        dispose() {
            this.view.dispose();
            this.view = (void 0);
            this.callbackContext = null;
        }
        accept(visitor) {
            var _a;
            if (((_a = this.view) === null || _a === void 0 ? void 0 : _a.accept(visitor)) === true) {
                return true;
            }
        }
    };
    __decorate([
        bindable_js_1.bindable({ primary: true })
    ], Portal.prototype, "target", void 0);
    __decorate([
        bindable_js_1.bindable({ callback: 'targetChanged' })
    ], Portal.prototype, "renderContext", void 0);
    __decorate([
        bindable_js_1.bindable()
    ], Portal.prototype, "strict", void 0);
    __decorate([
        bindable_js_1.bindable()
    ], Portal.prototype, "deactivating", void 0);
    __decorate([
        bindable_js_1.bindable()
    ], Portal.prototype, "activating", void 0);
    __decorate([
        bindable_js_1.bindable()
    ], Portal.prototype, "deactivated", void 0);
    __decorate([
        bindable_js_1.bindable()
    ], Portal.prototype, "activated", void 0);
    __decorate([
        bindable_js_1.bindable()
    ], Portal.prototype, "callbackContext", void 0);
    Portal = __decorate([
        custom_attribute_js_1.templateController('portal'),
        __param(0, view_js_1.IViewFactory),
        __param(1, dom_js_1.IRenderLocation),
        __param(2, platform_js_1.IPlatform)
    ], Portal);
    exports.Portal = Portal;
});
//# sourceMappingURL=portal.js.map