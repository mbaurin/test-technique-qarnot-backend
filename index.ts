import { Request, Response } from 'express';
import Joi from 'joi';

const express = require('express');
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

app.get("/device-types", (req: Request, res: Response) => {
    res.status(200).json(deviceTypes);
});

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

app.post("/device-types", validateDeviceType, (req: Request, res: Response) => {
    const deviceType: DeviceType = req.body;
    deviceTypes.push(deviceType);
    res.status(201).json(deviceType);
});

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

app.get('/device-models', (req: Request, res: Response) => {
    res.status(200).send(deviceModels);
});

app.get('/device-models/:name', (req: Request, res: Response) => {
    const name = req.params.name;
    const deviceModel = deviceModels.find((dm) => dm.name === name);
    if (!deviceModel) {
      res.status(404).send('Device model not found');
    } else {
      res.status(200).send(deviceModel);
    }
});

app.post('/device-models', validateDeviceModel, (req: Request, res: Response) => {
    const newDeviceModel = req.body as DeviceModel;
    const deviceType = deviceTypes.find((dt) => dt.name === newDeviceModel.deviceType.name);
    if (!deviceType) {
      return res.status(400).send('Invalid device type');
    }
    deviceModels.push(newDeviceModel);
    res.status(201).send(newDeviceModel);
});

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
