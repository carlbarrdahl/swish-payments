"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = __importDefault(require("node-fetch"));
var https_1 = __importDefault(require("https"));
var SWISH_ENDPOINT = "https://mss.swicpc.bankgirot.se/swish-cpcapi/api/v1";
var SWISH_PAYMENT_IP = process.env.NODE_ENV === "production" ? "194.242.111.220:443" : "";
var SwishPayments = /** @class */ (function () {
    function SwishPayments(cert) {
        this.cert = cert;
    }
    /**
     * Get payment from payment request token
     *
     * @param  {string} token
     * @returns PaymentResponseType
     */
    SwishPayments.prototype.getPayment = function (token) {
        return node_fetch_1.default(SWISH_ENDPOINT + "/paymentrequests/" + token, {
            agent: new https_1.default.Agent(this.cert)
        })
            .then(function (res) { return res.json(); })
            .catch(handleError);
    };
    /**
     * Request a payment and return a token. This token is used to launch Swish from the client
     *
     * @param  {PaymentRequestType} data
     * @returns Promise
     */
    SwishPayments.prototype.paymentRequest = function (data) {
        return node_fetch_1.default(SWISH_ENDPOINT + "/paymentrequests", {
            agent: new https_1.default.Agent(this.cert),
            method: "POST",
            body: JSON.stringify(__assign({}, data, { currency: "SEK" })),
            headers: { "Content-Type": "application/json" }
        })
            .then(handleToken)
            .catch(handleError);
    };
    /**
     * Request a refund
     *
     * @param  {RefundRequestType} data
     * @returns Promise
     */
    SwishPayments.prototype.refundRequest = function (data) {
        return node_fetch_1.default(SWISH_ENDPOINT + "/paymentrequests", {
            agent: new https_1.default.Agent(this.cert),
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        }).catch(handleError);
    };
    /**
     * Create a function Swish will call as callbackUrl on payment and refund requests
     *
     * @param  {Function} callback
     */
    SwishPayments.prototype.createHook = function (callback) {
        return function (req, res) {
            var ip = (req.connection && req.connection.remoteAddress) || "";
            if (!ip.includes(SWISH_PAYMENT_IP)) {
                return res.status(401).send("not authorized");
            }
            callback(req.body);
            return res.status(201);
        };
    };
    return SwishPayments;
}());
exports.default = SwishPayments;
function handleToken(res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(res.status !== 201)) return [3 /*break*/, 2];
                    return [4 /*yield*/, res.json()];
                case 1: throw _a.sent();
                case 2: return [2 /*return*/, res.headers.get("location").split("paymentrequests/")[1]];
            }
        });
    });
}
function handleError(err) {
    throw err;
}
//# sourceMappingURL=index.js.map