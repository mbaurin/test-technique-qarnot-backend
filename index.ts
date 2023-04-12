import express, { Request, Response } from 'express';
import Joi from 'joi';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Qarnot Technical Test API!');
});

// Manipuler un type d'appareil

interface DeviceType {
    name: string;
}

let deviceTypes: DeviceType[] = [
    {"name": "deviceType1"},
    {"name": "deviceType2"},
];

const deviceTypeSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
});

const validateDeviceType = (req: Request, res: Response, next: () => void) => {
    const { error } = deviceTypeSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
};

/**
 * @api {get} /device-types Obtenir la liste des types d'appareil
 * @apiName ObtenirListeTypesDappareil
 * @apiGroup TypesDappareil
 *
 * @apiSuccess {Object[]} types Liste des types d'appareil
 * 
 * @apiSuccessExample {json} Succès-Exemple:
 *     HTTP/1.1 200 OK
 *     [
 *         {
 *             "name": "deviceType1"
 *         },
 *         {
 *             "name": "deviceType2"
 *         }
 *     ]
 */

app.get("/device-types", (req: Request, res: Response) => {
    res.status(200).json(deviceTypes);
});

/**
 * @api {get} /device-types/:name Obtenir un type d'appareil par son nom
 * @apiName ObtenirListeTypesDappareilParNom
 * @apiGroup TypesDappareil
 *
 * @apiParam {String} name Nom du type d'appareil
 * 
 * @apiSuccess {String} name Nom du type d'appareil
 * @apiSuccessExample {json} Succès-Exemple:
 *     HTTP/1.1 200 OK
 *     {
 *         "name": "deviceType1"
 *     }
 * 
 * @apiError 404 TypesDappareilNonTrouve Le type d'appareil demandé n'existe pas
 * @apiErrorExample {json} Erreur-Exemple:
 *     HTTP/1.1 404 Not Found
 *     "Device type not found"
 */

app.get("/device-types/:name", (req: Request, res: Response) => {
    const name = req.params.name;
    const deviceType = deviceTypes.find(
      (deviceType) => deviceType.name === name
    );
    if (!deviceType) {
      res.status(404).send("Device type not found");
    } else {
      res.status(200).json(deviceType);
    }
});

/**
 * @api {post} /device-types Ajouter un type d'appareil
 * @apiName AjouterTypeDappareil
 * @apiGroup TypesDappareil
 *
 * @apiParam {String} name Nom du type d'appareil
 * 
 * @apiSuccess {String} name Nom du type d'appareil ajouté
 * @apiSuccessExample {json} Succès-Exemple:
 *     HTTP/1.1 201 Created
 *     {
 *         "name": "deviceType3"
 *     }
 */

app.post("/device-types", validateDeviceType, (req: Request, res: Response) => {
    const deviceType: DeviceType = req.body;
    deviceTypes.push(deviceType);
    res.status(201).json(deviceType);
});

/**
 * @api {put} /device-types/:name Modifier un type d'appareil
 * @apiName ModifierTypeDappareil
 * @apiGroup TypesDappareil
 *
 * @apiParam {String} name Nom du type d'appareil à modifier.
 *
 * @apiSuccess (200) {Object} deviceType Objet représentant le type d'appareil modifié.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "name": "deviceType3"
 *     }
 *
 * @apiError (404) {String} message Message d'erreur indiquant que le type d'appareil n'a pas été trouvé.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     "Device type not found"
 */

app.put("/device-types/:name", validateDeviceType, (req: Request, res: Response) => {
    const name = req.params.name;
    const deviceTypeIndex = deviceTypes.findIndex(
      (deviceType) => deviceType.name === name
    );
    if (deviceTypeIndex === -1) {
      res.status(404).send("Device type not found");
    } else {
      deviceTypes[deviceTypeIndex] = { name: req.body.name };
      res.status(200).json(deviceTypes[deviceTypeIndex]);
    }
});

/**
 * @api {delete} /device-types/:name Supprimer un type d'appareil
 * @apiName SupprimerTypeDappareil
 * @apiGroup TypesDappareil
 *
 * @apiParam {String} name Nom du type d'appareil à supprimer.
 *
 * @apiSuccess (200) {String} message Message indiquant que le type d'appareil a été supprimé avec succès.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "Device type deleted"
 *
 * @apiError (404) {String} message Message d'erreur indiquant que le type d'appareil n'a pas été trouvé.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     "Device type not found"
 */

app.delete("/device-types/:name", (req: Request, res: Response) => {
    const name = req.params.name;
    const deviceTypeIndex = deviceTypes.findIndex(
      (deviceType) => deviceType.name === name
    );
    if (deviceTypeIndex === -1) {
      res.status(404).send("Device type not found");
    } else {
      deviceTypes.splice(deviceTypeIndex, 1);
      res.status(200).send("Device type deleted");
    }
});

// Manipuler un Model d'appareil

interface DeviceModel {
    name: string;
    deviceType: DeviceType;
}

const deviceModels: DeviceModel[] = [
    {"name": "deviceModel1", "deviceType": {"name": "deviceType1"}},
    {"name": "deviceModel2", "deviceType": {"name": "deviceType1"}},
];

const deviceModelSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    deviceType: Joi.object({
        name: Joi.string().min(3).max(30).required(),
    }).required(),
});

const validateDeviceModel = (req: Request, res: Response, next: () => void) => {
    const { error } = deviceModelSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
};

/**
 * @api {get} /device-models Récupérer tous les modèles d'appareil
 * @apiName ObtenirListeModelesDappareil
 * @apiGroup ModelsDappareil
 *
 * @apiSuccess {Object[]} deviceModels Liste de tous les modèles de périphériques.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "name": "deviceModel1",
 *         "deviceType": {
            "name": "deviceType1"
 *         }
 *       }
 *     ]
 */

app.get('/device-models', (req: Request, res: Response) => {
    res.status(200).send(deviceModels);
});

/**
 * @api {get} /device-models Récupérer tous les modèles d'appareil par son nom
 * @apiName ObtenirModelesDappareilParNom
 * @apiGroup ModelsDappareil
 *
 * @apiSuccess {Object[]} Nom du type de Modele d'appareil.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
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
 *     HTTP/1.1 404 Not Found
 *     "Device model not found"
 */

app.get('/device-models/:name', (req: Request, res: Response) => {
    const name = req.params.name;
    const deviceModel = deviceModels.find((dm) => dm.name === name);
    if (!deviceModel) {
      res.status(404).send('Device model not found');
    } else {
      res.status(200).send(deviceModel);
    }
});

/**
 * @api {post} /device-models Ajouter un type de modele d'appareil
 * @apiName AjouterModeleDappareil
 * @apiGroup ModelsDappareil
 *
 * @apiParam {String} name Nom du modele d'appareil
 * 
 * @apiSuccess {String} name Nom du type d'appareil ajouté
 * @apiSuccessExample {json} Succès-Exemple:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "name": "deviceModel2",
 *         "deviceType": {
            "name": "deviceType2"
 *         }
 *       }
 *     ]
 * 
 * @apiError (404) {String} message Message d'erreur indiquant que le modele d'appareil n'a pas été trouvé.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     "Invalid device type"
 */

app.post('/device-models', validateDeviceModel, (req: Request, res: Response) => {
    const newDeviceModel = req.body as DeviceModel;
    const deviceType = deviceTypes.find((dt) => dt.name === newDeviceModel.deviceType.name);
    if (!deviceType) {
      return res.status(400).send('Invalid device type');
    }
    deviceModels.push(newDeviceModel);
    res.status(201).send(newDeviceModel);
});

/**
 * @api {put} /device-model/:name Modifier un modele d'appareil
 * @apiName ModifierModelDappareil
 * @apiGroup ModelsDappareil
 *
 * @apiParam {String} name Nom du model d'appareil à modifier.
 *
 * @apiSuccess (200) {Object} deviceModel Objet représentant le model d'appareil modifié.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "name": "deviceModel2",
 *         "deviceType": {
            "name": "deviceType2"
 *         }
 *     }
 *
 * @apiError (404) {String} message Message d'erreur indiquant que le model d'appareil n'a pas été trouvé.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     "Device model not found"
 */

app.put('/device-models/:name', validateDeviceModel, (req: Request, res: Response) => {
    const name = req.params.name;
    const deviceModelIndex = deviceModels.findIndex((dm) => dm.name === name);
    if (deviceModelIndex === -1) {
      return res.status(404).send('Device model not found');
    }
    const newDeviceModel = req.body as DeviceModel;
    const deviceType = deviceTypes.find((dt) => dt.name === newDeviceModel.deviceType.name);
    if (!deviceType) {
      return res.status(400).send('Invalid device type');
    }
    deviceModels[deviceModelIndex] = newDeviceModel;
    res.status(200).send(newDeviceModel);
});

/**
 * @api {delete} /device-models/:name Supprimer un modele d'appareil
 * @apiName SupprimerModeleDappareil
 * @apiGroup ModelsDappareil
 *
 * @apiParam {String} name Nom du modele d'appareil à supprimer.
 *
 * @apiSuccess (200) {String} message Message indiquant que le modele d'appareil a été supprimé avec succès.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "Device model deleted"
 *
 * @apiError (404) {String} message Message d'erreur indiquant que le modele d'appareil n'a pas été trouvé.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     "Device model not found"
 */

app.delete('/device-models/:name', (req: Request, res: Response) => {
    const name = req.params.name;
    const deviceModelIndex = deviceModels.findIndex((dm) => dm.name === name);
    if (deviceModelIndex === -1) {
      return res.status(404).send('Device model not found');
    }
    deviceModels.splice(deviceModelIndex, 1);
    res.status(200).send('Device model deleted');
});

// Manipuler un Appareil

interface Device {
    macAddress: string;
    state?: 'installé' | 'maintenance' | 'stock';
    deviceModel: DeviceModel;
}

const devices: Device[] = [
    {"macAddress": "macAddress1", "state": "installé", "deviceModel": {"name": "deviceModel1", "deviceType": {"name": "deviceType1"}}},
    {"macAddress": "macAddress2", "state": "stock", "deviceModel": {"name": "deviceModel2", "deviceType": {"name": "deviceType1"}}},
];

const deviceSchema = Joi.object({
    macAddress: Joi.string().min(3).max(30).required(),
    state: Joi.string().valid('installé', 'maintenance', 'stock').default('stock'),
    deviceModel: Joi.object({
        name: Joi.string().min(3).max(30).required(),
        deviceType: Joi.object({
            name: Joi.string().min(3).max(30).required(),
        }).required(),
    }).required(),
});

const validateDevice = (req: Request, res: Response, next: () => void) => {
    const { error } = deviceSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
}

app.get('/devices', (req: Request, res: Response) => {
    res.status(200).send(devices);
});

app.get('/devices/:macAddress', (req: Request, res: Response) => {
    const macAddress = req.params.macAddress;
    const device = devices.find((d) => d.macAddress === macAddress);
    if (!device) {
      res.status(404).send('Device not found');
    } else {
      res.status(200).send(device);
    }
});

app.post('/devices', validateDevice, (req: Request, res: Response) => {
    const newDevice = req.body as Device;
    const deviceModel = deviceModels.find((dm) => dm.name === newDevice.deviceModel.name);
    if (!deviceModel) {
      return res.status(400).send('Invalid device model');
    }
    devices.push(newDevice);
    res.status(201).send(newDevice);
});

app.put('/devices/:macAddress', validateDevice, (req: Request, res: Response) => {
    const macAddress = req.params.macAddress;
    const deviceIndex = devices.findIndex((d) => d.macAddress === macAddress);
    if (deviceIndex === -1) {
      return res.status(404).send('Device not found');
    }
    const newDevice = req.body as Device;
    const deviceModel = deviceModels.find((dm) => dm.name === newDevice.deviceModel.name);
    if (!deviceModel) {
      return res.status(400).send('Invalid device model');
    }
    devices[deviceIndex] = newDevice;
    res.status(200).send(newDevice);
});

app.delete('/devices/:macAddress', (req: Request, res: Response) => {
    const macAddress = req.params.macAddress;
    const deviceIndex = devices.findIndex((d) => d.macAddress === macAddress);
    if (deviceIndex === -1) {
      return res.status(404).send('Device not found');
    }
    devices.splice(deviceIndex, 1);
    res.status(200).send('Device deleted');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
