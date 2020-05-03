"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bodyParser = __importStar(require("body-parser"));
var http = __importStar(require("http"));
var socket = __importStar(require("./socket"));
var path_1 = __importDefault(require("path"));
var Server = /** @class */ (function () {
    function Server() {
        var _this = this;
        this.start = function () {
            var PORT = process.env.PORT || 8080;
            _this.app.use(express_1.default.static(path_1.default.join(__dirname, '../../front/build')));
            _this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
            _this.app.use(bodyParser.json({ limit: '50mb' }));
            _this.app.use(function (req, res, next) {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', '*');
                res.header('Access-Control-Allow-Credentials', 'true');
                next();
            });
            //  require('./routes/')(this.router);
            _this.router.get('/', function (req, res) {
                console.log();
                res.sendFile(path_1.default.join(__dirname, '../../front/build', 'index.html'));
            });
            _this.app.use(_this.router);
            var server = _this.http.listen(PORT, function () {
                socket.createInstance(server);
                console.log("HTTP Listening on " + PORT + "...");
            });
        };
        this.app = express_1.default();
        this.router = express_1.default.Router();
        this.http = http.createServer(this.app);
    }
    return Server;
}());
new Server().start();
