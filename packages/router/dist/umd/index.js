(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./link-handler.js", "./instruction-resolver.js", "./interfaces.js", "./lifecycle-logger.js", "./hook-manager.js", "./nav.js", "./nav-route.js", "./navigation.js", "./navigator.js", "./runner.js", "./queue.js", "./route-recognizer.js", "./router.js", "./router-options.js", "./viewport.js", "./viewport-content.js", "./viewport-instruction.js", "./configuration.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HrefCustomAttributeRegistration = exports.HrefCustomAttribute = exports.LoadCustomAttributeRegistration = exports.LoadCustomAttribute = exports.GotoCustomAttributeRegistration = exports.GotoCustomAttribute = exports.NavCustomElementRegistration = exports.NavCustomElement = exports.ViewportCustomElementRegistration = exports.ViewportCustomElement = exports.DefaultResources = exports.DefaultComponents = exports.RouterRegistration = exports.RouterConfiguration = exports.ViewportInstruction = exports.ViewportContent = exports.ContentStatus = exports.Viewport = exports.RouterOptions = exports.Router = exports.IRouter = exports.Endpoint = exports.RecognizedRoute = exports.ConfigurableRoute = exports.RouteRecognizer = exports.Queue = exports.Runner = exports.Navigator = exports.Navigation = exports.NavRoute = exports.Nav = exports.HookTypes = exports.HookManager = exports.LifecycleClass = exports.lifecycleLogger = exports.ReentryBehavior = exports.InstructionResolver = exports.LinkHandler = void 0;
    var link_handler_js_1 = require("./link-handler.js");
    Object.defineProperty(exports, "LinkHandler", { enumerable: true, get: function () { return link_handler_js_1.LinkHandler; } });
    var instruction_resolver_js_1 = require("./instruction-resolver.js");
    Object.defineProperty(exports, "InstructionResolver", { enumerable: true, get: function () { return instruction_resolver_js_1.InstructionResolver; } });
    var interfaces_js_1 = require("./interfaces.js");
    Object.defineProperty(exports, "ReentryBehavior", { enumerable: true, get: function () { return interfaces_js_1.ReentryBehavior; } });
    var lifecycle_logger_js_1 = require("./lifecycle-logger.js");
    Object.defineProperty(exports, "lifecycleLogger", { enumerable: true, get: function () { return lifecycle_logger_js_1.lifecycleLogger; } });
    Object.defineProperty(exports, "LifecycleClass", { enumerable: true, get: function () { return lifecycle_logger_js_1.LifecycleClass; } });
    var hook_manager_js_1 = require("./hook-manager.js");
    Object.defineProperty(exports, "HookManager", { enumerable: true, get: function () { return hook_manager_js_1.HookManager; } });
    Object.defineProperty(exports, "HookTypes", { enumerable: true, get: function () { return hook_manager_js_1.HookTypes; } });
    var nav_js_1 = require("./nav.js");
    Object.defineProperty(exports, "Nav", { enumerable: true, get: function () { return nav_js_1.Nav; } });
    var nav_route_js_1 = require("./nav-route.js");
    Object.defineProperty(exports, "NavRoute", { enumerable: true, get: function () { return nav_route_js_1.NavRoute; } });
    var navigation_js_1 = require("./navigation.js");
    Object.defineProperty(exports, "Navigation", { enumerable: true, get: function () { return navigation_js_1.Navigation; } });
    var navigator_js_1 = require("./navigator.js");
    Object.defineProperty(exports, "Navigator", { enumerable: true, get: function () { return navigator_js_1.Navigator; } });
    var runner_js_1 = require("./runner.js");
    Object.defineProperty(exports, "Runner", { enumerable: true, get: function () { return runner_js_1.Runner; } });
    var queue_js_1 = require("./queue.js");
    Object.defineProperty(exports, "Queue", { enumerable: true, get: function () { return queue_js_1.Queue; } });
    var route_recognizer_js_1 = require("./route-recognizer.js");
    Object.defineProperty(exports, "RouteRecognizer", { enumerable: true, get: function () { return route_recognizer_js_1.RouteRecognizer; } });
    Object.defineProperty(exports, "ConfigurableRoute", { enumerable: true, get: function () { return route_recognizer_js_1.ConfigurableRoute; } });
    Object.defineProperty(exports, "RecognizedRoute", { enumerable: true, get: function () { return route_recognizer_js_1.RecognizedRoute; } });
    Object.defineProperty(exports, "Endpoint", { enumerable: true, get: function () { return route_recognizer_js_1.Endpoint; } });
    var router_js_1 = require("./router.js");
    // IRouterActivateOptions,
    // IRouterOptions,
    // IRouterTitle,
    Object.defineProperty(exports, "IRouter", { enumerable: true, get: function () { return router_js_1.IRouter; } });
    Object.defineProperty(exports, "Router", { enumerable: true, get: function () { return router_js_1.Router; } });
    var router_options_js_1 = require("./router-options.js");
    Object.defineProperty(exports, "RouterOptions", { enumerable: true, get: function () { return router_options_js_1.RouterOptions; } });
    var viewport_js_1 = require("./viewport.js");
    Object.defineProperty(exports, "Viewport", { enumerable: true, get: function () { return viewport_js_1.Viewport; } });
    var viewport_content_js_1 = require("./viewport-content.js");
    Object.defineProperty(exports, "ContentStatus", { enumerable: true, get: function () { return viewport_content_js_1.ContentStatus; } });
    Object.defineProperty(exports, "ViewportContent", { enumerable: true, get: function () { return viewport_content_js_1.ViewportContent; } });
    var viewport_instruction_js_1 = require("./viewport-instruction.js");
    Object.defineProperty(exports, "ViewportInstruction", { enumerable: true, get: function () { return viewport_instruction_js_1.ViewportInstruction; } });
    var configuration_js_1 = require("./configuration.js");
    Object.defineProperty(exports, "RouterConfiguration", { enumerable: true, get: function () { return configuration_js_1.RouterConfiguration; } });
    Object.defineProperty(exports, "RouterRegistration", { enumerable: true, get: function () { return configuration_js_1.RouterRegistration; } });
    Object.defineProperty(exports, "DefaultComponents", { enumerable: true, get: function () { return configuration_js_1.DefaultComponents; } });
    Object.defineProperty(exports, "DefaultResources", { enumerable: true, get: function () { return configuration_js_1.DefaultResources; } });
    Object.defineProperty(exports, "ViewportCustomElement", { enumerable: true, get: function () { return configuration_js_1.ViewportCustomElement; } });
    Object.defineProperty(exports, "ViewportCustomElementRegistration", { enumerable: true, get: function () { return configuration_js_1.ViewportCustomElementRegistration; } });
    Object.defineProperty(exports, "NavCustomElement", { enumerable: true, get: function () { return configuration_js_1.NavCustomElement; } });
    Object.defineProperty(exports, "NavCustomElementRegistration", { enumerable: true, get: function () { return configuration_js_1.NavCustomElementRegistration; } });
    Object.defineProperty(exports, "GotoCustomAttribute", { enumerable: true, get: function () { return configuration_js_1.GotoCustomAttribute; } });
    Object.defineProperty(exports, "GotoCustomAttributeRegistration", { enumerable: true, get: function () { return configuration_js_1.GotoCustomAttributeRegistration; } });
    Object.defineProperty(exports, "LoadCustomAttribute", { enumerable: true, get: function () { return configuration_js_1.LoadCustomAttribute; } });
    Object.defineProperty(exports, "LoadCustomAttributeRegistration", { enumerable: true, get: function () { return configuration_js_1.LoadCustomAttributeRegistration; } });
    Object.defineProperty(exports, "HrefCustomAttribute", { enumerable: true, get: function () { return configuration_js_1.HrefCustomAttribute; } });
    Object.defineProperty(exports, "HrefCustomAttributeRegistration", { enumerable: true, get: function () { return configuration_js_1.HrefCustomAttributeRegistration; } });
});
//# sourceMappingURL=index.js.map