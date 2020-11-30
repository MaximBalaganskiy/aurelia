(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@aurelia/kernel"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IFileSystem = exports.FileKind = exports.Encoding = void 0;
    const kernel_1 = require("@aurelia/kernel");
    var Encoding;
    (function (Encoding) {
        Encoding["utf8"] = "utf8";
        Encoding["utf16le"] = "utf16le";
        Encoding["latin1"] = "latin1";
        Encoding["base64"] = "base64";
        Encoding["ascii"] = "ascii";
        Encoding["hex"] = "hex";
        Encoding["raw"] = "raw";
    })(Encoding = exports.Encoding || (exports.Encoding = {}));
    var FileKind;
    (function (FileKind) {
        FileKind[FileKind["Unknown"] = 0] = "Unknown";
        FileKind[FileKind["Script"] = 1] = "Script";
        FileKind[FileKind["Markup"] = 2] = "Markup";
        FileKind[FileKind["Style"] = 3] = "Style";
        FileKind[FileKind["JSON"] = 4] = "JSON";
    })(FileKind = exports.FileKind || (exports.FileKind = {}));
    exports.IFileSystem = kernel_1.DI.createInterface('IFileSystem').noDefault();
});
//# sourceMappingURL=interfaces.js.map