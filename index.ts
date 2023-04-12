import express, { Request, Response } from 'express';
import Joi from 'joi';

const app = express();
const port = 3000;

app.use(express.json());

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

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Qarnot Technical Test API!');
});

// Manipuler un type d'appareil

app.get("/device-types", (req, res) => {
    const filteredDeviceTypes = deviceTypes.filter((deviceType) =>
      Object.keys(req.query).every(
        (key) => String(deviceType[key]) === String(req.query[key])
      )
    );
    res.status(200).json(filteredDeviceTypes);
});

app.get("/device-types/:name", (req, res) => {
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

app.post("/device-types", validateDeviceType, (req, res) => {
    const deviceType: DeviceType = req.body;
    deviceTypes.push(deviceType);
    res.status(201).json(deviceTypes);
});

app.put("/device-types/:name", validateDeviceType, (req, res) => {
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

app.delete("/device-types/:name", (req, res) => {
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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
