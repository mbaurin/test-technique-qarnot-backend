"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var joi_1 = __importDefault(require("joi"));
var app = (0, express_1.default)();
var port = 3000;
app.use(express_1.default.json());
app.get('/', function (req, res) {
    res.send('Welcome to Qarnot Technical Test API!');
});
var deviceTypes = [
    { "name": "deviceType1" },
    { "name": "deviceType2" },
];
var deviceTypeSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(30).required(),
});
var validateDeviceType = function (req, res, next) {
    var error = deviceTypeSchema.validate(req.body).error;
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
/**
 * @api {get} /device-types Récupérer la liste des types d'appareil
 * @apiName ObtenirListeTypesDappareil
 * @apiGroup Types D'appareil
 *
 * @apiSuccess {json[]} Listes Appareils Liste des types d'appareil
 * @apiSuccessExample {json} Succès-Exemple:
 *     [
 *         {
 *             "name": "deviceType1"
 *         },
 *         {
 *             "name": "deviceType2"
 *         }
 *     ]
 */
app.get("/device-types", function (req, res) {
    res.status(200).json(deviceTypes);
});
/**
 * @api {get} /device-types/:name Récupérer un type d'appareil par son nom
 * @apiName ObtenirListeTypesDappareilParNom
 * @apiGroup Types D'appareil
 *
 * @apiParam {json} name Nom du type d'appareil
 *
 * @apiSuccess {json} TypeAppareil Nom du type d'appareil
 * @apiSuccessExample {json} Succès-Exemple:
 *     {
 *         "name": "deviceType1"
 *     }
 *
 * @apiError 404 Le type d'appareil demandé n'existe pas
 * @apiErrorExample {json} Erreur-Exemple:
 *     "Device type not found"
 */
app.get("/device-types/:name", function (req, res) {
    var name = req.params.name;
    var deviceType = deviceTypes.find(function (deviceType) { return deviceType.name === name; });
    if (!deviceType) {
        res.status(404).send("Device type not found");
    }
    else {
        res.status(200).json(deviceType);
    }
});
/**
 * @api {post} /device-types Ajouter un type d'appareil
 * @apiName AjouterTypeDappareil
 * @apiGroup Types D'appareil
 *
 * @apiParam {json} name Nom du type d'appareil
 *
 * @apiSuccess {json} NomAppareil Nom du type d'appareil ajouté
 * @apiSuccessExample {json} Succès-Exemple:
 *     {
 *         "name": "deviceType3"
 *     }
 */
app.post("/device-types", validateDeviceType, function (req, res) {
    var deviceType = req.body;
    deviceTypes.push(deviceType);
    res.status(201).json(deviceType);
});
/**
 * @api {put} /device-types/:name Modifier un type d'appareil
 * @apiName ModifierTypeDappareil
 * @apiGroup Types D'appareil
 *
 * @apiParam {json} name Nom du type d'appareil à modifier.
 *
 * @apiSuccess (200) {json} deviceType Objet représentant le type d'appareil modifié.
 * @apiSuccessExample Success-Response:
 *     {
 *       "name": "deviceType3"
 *     }
 *
 * @apiError (404) {String} message Message d'erreur indiquant que le type d'appareil n'a pas été trouvé.
 * @apiErrorExample Error-Response:
 *     "Device type not found"
 */
app.put("/device-types/:name", validateDeviceType, function (req, res) {
    var name = req.params.name;
    var deviceTypeIndex = deviceTypes.findIndex(function (deviceType) { return deviceType.name === name; });
    if (deviceTypeIndex === -1) {
        res.status(404).send("Device type not found");
    }
    else {
        deviceTypes[deviceTypeIndex] = { name: req.body.name };
        res.status(200).json(deviceTypes[deviceTypeIndex]);
    }
});
/**
 * @api {delete} /device-types/:name Supprimer un type d'appareil
 * @apiName SupprimerTypeDappareil
 * @apiGroup Types D'appareil
 *
 * @apiParam {json} name Nom du type d'appareil à supprimer.
 *
 * @apiSuccess (200) {String} message Message indiquant que le type d'appareil a été supprimé avec succès.
 * @apiSuccessExample Success-Response:
 *     "Device type deleted"
 *
 * @apiError (404) {String} message Message d'erreur indiquant que le type d'appareil n'a pas été trouvé.
 * @apiErrorExample Error-Response:
 *     "Device type not found"
 */
app.delete("/device-types/:name", function (req, res) {
    var name = req.params.name;
    var deviceTypeIndex = deviceTypes.findIndex(function (deviceType) { return deviceType.name === name; });
    if (deviceTypeIndex === -1) {
        res.status(404).send("Device type not found");
    }
    else {
        deviceTypes.splice(deviceTypeIndex, 1);
        res.status(200).send("Device type deleted");
    }
});
var deviceModels = [
    { "name": "deviceModel1", "deviceType": { "name": "deviceType1" } },
    { "name": "deviceModel2", "deviceType": { "name": "deviceType1" } },
];
var deviceModelSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(30).required(),
    deviceType: joi_1.default.object({
        name: joi_1.default.string().min(3).max(30).required(),
    }).required(),
});
var validateDeviceModel = function (req, res, next) {
    var error = deviceModelSchema.validate(req.body).error;
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
/**
 * @api {get} /device-models Récupérer tous les modèles d'appareil
 * @apiName ObtenirListeModelesDappareil
 * @apiGroup Modeles D'appareil
 *
 * @apiSuccess {json[]} deviceModels Liste de tous les modèles de périphériques.
 * @apiSuccessExample Success-Response:
 *     [
 *       {
 *         "name": "deviceModel1",
 *         "deviceType": {
            "name": "deviceType1"
 *         }
 *       }
 *     ]
 */
app.get('/device-models', function (req, res) {
    res.status(200).send(deviceModels);
});
/**
 * @api {get} /device-models Récupérer tous les modèles d'appareil par son nom
 * @apiName ObtenirModelesDappareilParNom
 * @apiGroup Modeles D'appareil
 *
 * @apiParam {json} name Nom du modele d'appareil
 *
 * @apiSuccess {json[]} Nom du type de Modele d'appareil.
 * @apiSuccessExample Success-Response:
 *     [
 *       {
 *         "name": "deviceModel1",
 *         "deviceType": {
            "name": "deviceType1"
 *         }
 *       }
 *     ]
 *
 * @apiError (404) {String} message Message d'erreur indiquant que le modele d'appareil n'a pas été trouvé.
 * @apiErrorExample Error-Response:
 *     "Device model not found"
 */
app.get('/device-models/:name', function (req, res) {
    var name = req.params.name;
    var deviceModel = deviceModels.find(function (dm) { return dm.name === name; });
    if (!deviceModel) {
        res.status(404).send('Device model not found');
    }
    else {
        res.status(200).send(deviceModel);
    }
});
/**
 * @api {post} /device-models Ajouter un type de modele d'appareil
 * @apiName AjouterModeleDappareil
 * @apiGroup Modeles D'appareil
 *
 * @apiParam {json} name Nom du modele d'appareil
 *
 * @apiSuccess {json} name Nom du type d'appareil ajouté
 * @apiSuccessExample {json} Succès-Exemple:
 *     [
 *       {
 *         "name": "deviceModel2",
 *         "deviceType": {
            "name": "deviceType2"
 *         }
 *       }
 *     ]
 *
 * @apiError (404) {String} InvalidDeviceType Message d'erreur indiquant que le modele d'appareil n'a pas été trouvé.
 * @apiErrorExample Error-Response:
 *     "Invalid device type"
 */
app.post('/device-models', validateDeviceModel, function (req, res) {
    var newDeviceModel = req.body;
    var deviceType = deviceTypes.find(function (dt) { return dt.name === newDeviceModel.deviceType.name; });
    if (!deviceType) {
        return res.status(400).send('Invalid device type');
    }
    deviceModels.push(newDeviceModel);
    res.status(201).send(newDeviceModel);
});
/**
 * @api {put} /device-model/:name Modifier un modele d'appareil
 * @apiName ModifierModeleDappareil
 * @apiGroup Modeles D'appareil
 *
 * @apiParam {json} name Nom du modele d'appareil à modifier.
 *
 * @apiSuccess (200) {json} deviceModel Json représentant le modele d'appareil modifié.
 * @apiSuccessExample Success-Response:
 *     {
 *         "name": "deviceModel2",
 *         "deviceType": {
            "name": "deviceType2"
 *         }
 *     }
 *
 * @apiError (404) {String} message Message d'erreur indiquant que le modele d'appareil n'a pas été trouvé.
 * @apiErrorExample Error-Response:
 *     "Device model not found"
 */
app.put('/device-models/:name', validateDeviceModel, function (req, res) {
    var name = req.params.name;
    var deviceModelIndex = deviceModels.findIndex(function (dm) { return dm.name === name; });
    if (deviceModelIndex === -1) {
        return res.status(404).send('Device model not found');
    }
    var newDeviceModel = req.body;
    var deviceType = deviceTypes.find(function (dt) { return dt.name === newDeviceModel.deviceType.name; });
    if (!deviceType) {
        return res.status(400).send('Invalid device type');
    }
    deviceModels[deviceModelIndex] = newDeviceModel;
    res.status(200).send(newDeviceModel);
});
/**
 * @api {delete} /device-models/:name Supprimer un modele d'appareil
 * @apiName SupprimerModeleDappareil
 * @apiGroup Modeles D'appareil
 *
 * @apiParam {json} name Nom du modele d'appareil à supprimer.
 *
 * @apiSuccess (200) {String} message Message indiquant que le modele d'appareil a été supprimé avec succès.
 * @apiSuccessExample Success-Response:
 *     "Device model deleted"
 *
 * @apiError (404) {String} message Message d'erreur indiquant que le modele d'appareil n'a pas été trouvé.
 * @apiErrorExample Error-Response:
 *     "Device model not found"
 */
app.delete('/device-models/:name', function (req, res) {
    var name = req.params.name;
    var deviceModelIndex = deviceModels.findIndex(function (dm) { return dm.name === name; });
    if (deviceModelIndex === -1) {
        return res.status(404).send('Device model not found');
    }
    deviceModels.splice(deviceModelIndex, 1);
    res.status(200).send('Device model deleted');
});
var devices = [
    { "macAddress": "macAddress1", "state": "installé", "deviceModel": { "name": "deviceModel1", "deviceType": { "name": "deviceType1" } } },
    { "macAddress": "macAddress2", "state": "stock", "deviceModel": { "name": "deviceModel2", "deviceType": { "name": "deviceType1" } } },
];
var deviceSchema = joi_1.default.object({
    macAddress: joi_1.default.string().min(3).max(30).required(),
    state: joi_1.default.string().valid('installé', 'maintenance', 'stock').default('stock'),
    deviceModel: joi_1.default.object({
        name: joi_1.default.string().min(3).max(30).required(),
        deviceType: joi_1.default.object({
            name: joi_1.default.string().min(3).max(30).required(),
        }).required(),
    }).required(),
});
var validateDevice = function (req, res, next) {
    var error = deviceSchema.validate(req.body).error;
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
/**
 * @api {get} /devices Récupérer tous les appareils
 * @apiName GetAppareil
 * @apiGroup Appareil
 *
 * @apiSuccess {json[]} devices Liste de tous les appareils.
 * @apiSuccessExample Success-Response:
 *     [
 *       {
 *         "name": "Device 1",
 *         "macAddress": "00:11:22:33:44:55",
 *         "deviceModel": {
 *           "name": "Device Model 1",
 *           "deviceType": {
 *             "name": "deviceType2"
 *           }
 *         }
 *       },
 *       {
 *         "name": "Device 2",
 *         "macAddress": "AA:BB:CC:DD:EE:FF",
 *         "deviceModel": {
 *           "name": "Device Model 2",
 *           "deviceType": {
 *             "name": "deviceType2"
 *           }
 *         }
 *       }
 *     ]
 */
app.get('/devices', function (req, res) {
    res.status(200).send(devices);
});
/**
 * @api {get} /devices/:macAddress Récupérer un appareil par son adresse MAC
 * @apiName GetAppareilByMacAdress
 * @apiGroup Appareil
 *
 * @apiParam {json} macAddress Adresse MAC de l'appareil recherché.
 *
 * @apiSuccess {json} device Informations sur l'appareil recherché.
 * @apiSuccessExample Success-Response:
 *     {
 *       "name": "Device 1",
 *       "macAddress": "00:11:22:33:44:55",
 *       "deviceModel": {
 *         "name": "Device Model 1",
 *         "deviceType": {
 *           "name": "deviceType2"
 *         }
 *       }
 *     }
 *
 * @apiError DeviceNotFound L'adresse MAC de l'appareil recherché n'existe pas.
 * @apiErrorExample Error-Response:
 *     "Device not found"
 */
app.get('/devices/:macAddress', function (req, res) {
    var macAddress = req.params.macAddress;
    var device = devices.find(function (d) { return d.macAddress === macAddress; });
    if (!device) {
        res.status(404).send('Device not found');
    }
    else {
        res.status(200).send(device);
    }
});
/**
 * @api {post} /devices Ajouter un nouvel appareil
 * @apiName AjouterAppareil
 * @apiGroup Appareil
 *
 * @apiParam {json} device Informations sur le nouvel appareil.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "name": "Device 3",
 *       "macAddress": "11:22:33:44:55:66",
 *       "deviceModel": {
 *         "name": "Device Model 1",
 *         "deviceType": {
 *           "name": "deviceType2"
 *         }
 *       }
 *     }
 *
 * @apiSuccess {json} device Informations sur le nouvel appareil ajouté.
 * @apiSuccessExample Success-Response:
 *     {
 *       "name": "Device 3",
 *       "macAddress": "11:22:33:44:55:66",
 *       "deviceModel": {
 *         "name": "Device Model 1",
 *         "deviceType": {
 *           "name": "deviceType2"
 *         }
 *       }
 *     }
 *
 * @apiError InvalidDeviceModel Le modèle d'appareil spécifié est invalide.
 * @apiErrorExample Error-Response:
 *     "Invalid device model"
 */
app.post('/devices', validateDevice, function (req, res) {
    var newDevice = req.body;
    var deviceModel = deviceModels.find(function (dm) { return dm.name === newDevice.deviceModel.name; });
    if (!deviceModel) {
        return res.status(400).send('Invalid device model');
    }
    devices.push(newDevice);
    res.status(201).send(newDevice);
});
/**
 * @api {put} /devices/:macAddress Modifier un appareil
 * @apiName ModifieAppareil
 * @apiGroup Appareil
 *
 * @apiParam {json} device Informations sur l'appareil a modifié
 * @apiParamExample {json} Request-Example:
 *     {
 *       "name": "Device 3",
 *       "macAddress": "11:22:33:44:55:66",
 *       "deviceModel": {
 *         "name": "Device Model 1",
 *         "deviceType": {
 *           "name": "deviceType2"
 *         }
 *       }
 *     }
 *
 * @apiSuccess {json} device Informations sur l'appareil modifié.
 * @apiSuccessExample Success-Response:
 *     {
 *       "name": "Device 3",
 *       "macAddress": "11:22:33:44:55:66",
 *       "deviceModel": {
 *         "name": "Device Model 1",
 *         "deviceType": {
 *           "name": "deviceType2"
 *         }
 *       }
 *     }
 *
 * @apiError InvalidDeviceModel Le modèle d'appareil spécifié est invalide.
 * @apiErrorExample Error-Response:
 *     "Invalid device model"
 */
app.put('/devices/:macAddress', validateDevice, function (req, res) {
    var macAddress = req.params.macAddress;
    var deviceIndex = devices.findIndex(function (d) { return d.macAddress === macAddress; });
    if (deviceIndex === -1) {
        return res.status(404).send('Device not found');
    }
    var newDevice = req.body;
    var deviceModel = deviceModels.find(function (dm) { return dm.name === newDevice.deviceModel.name; });
    if (!deviceModel) {
        return res.status(400).send('Invalid device model');
    }
    devices[deviceIndex] = newDevice;
    res.status(200).send(newDevice);
});
/**
 * @api {delete} /devices/:macAddress Supprimer un appareil
 * @apiName SupprimeAppareil
 * @apiGroup Appareil
 *
 * @apiParam {String} name Adresse Mac de l'appareil à supprimer.
 *
 * @apiSuccess (200) {String} message Message indiquant que l'appareil a été supprimé avec succès.
 * @apiSuccessExample Success-Response:
 *     "Device deleted"
 *
 * @apiError (404) {String} message Message d'erreur indiquant que l'appareil n'a pas été trouvé.
 * @apiErrorExample Error-Response:
 *     "Device not found"
 */
app.delete('/devices/:macAddress', function (req, res) {
    var macAddress = req.params.macAddress;
    var deviceIndex = devices.findIndex(function (d) { return d.macAddress === macAddress; });
    if (deviceIndex === -1) {
        return res.status(404).send('Device not found');
    }
    devices.splice(deviceIndex, 1);
    res.status(200).send('Device deleted');
});
app.use('/api-docs', express_1.default.static('docs'));
app.listen(port, function () {
    console.log("Server listening at http://localhost:".concat(port));
});
