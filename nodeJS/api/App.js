const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('config')
const mongoose = require('mongoose');
const app = express();
const server = require('http').createServer(app);
const WebSocket = require("ws");
var HashMap = require('hashmap');
var json2xls = require('json2xls');

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 5051;
const path = require('path')
//const publicDirPath = path.join(__dirname, './client/build')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();
const fileUpload = require('express-fileupload');

var compression = require('compression')


app.use(compression({}));
app.use(json2xls.middleware);



app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(express.json());
//app.use(express.static(publicDirPath, {extensions: ['html'], maxAge: '2629800000'}));
//app.use(express.static(path.join(__dirname), {extensions: ['html','jpg', 'jpeg','png', 'svg', 'webp', 'js','css'], maxAge: '2629800000'}));

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//  // res.setHeader('Access-Control-Allow-Credentials', 'true');
//   //res.setHeader('Access-Control-Allow-Headers', 'Origin,Content-Type,Accept,authorization,Expires,Pragma,x-custom-header');
//   //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH');
//   next();
// });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//app.get('/admin', (req, res) => {res.sendFile(publicDirPath + '/index.html');})
//app.get('/admin*/*', (req, res) => {res.sendFile(publicDirPath + '/index.html');})


const modulesController = require('./routes/api/modules/controllers/ModulesController');
app.use('/v1/modules', modulesController);


/********* Dynamic Modules Loading 
const Modules = require('./routes/api/modules/data-access/Modules');
Modules.getEnabledModules().then(modules => {
  //console.log(modules);
  modules.items.forEach(module => {
    let controller = require(module.controllerPath);
    app.use(module.route, controller);
    console.log('activating route: ' + module.route );
  })

});

*/


const invoicesController = require('./routes/api/invoices/controllers/InvoicesController');
app.use('/v1/invoices', invoicesController);


const FullCalendarController = require('./routes/api/FullCalendar/controllers/FullCalendarController');
app.use('/v1/FullCalendars', FullCalendarController);


const contactController = require('./routes/api/contacts/controllers/ContactsController');
app.use('/v1/contacts', contactController);




const PackagesController = require('./routes/api/packages/controllers/PackagesController');
app.use('/v1/packages', PackagesController);


const receiptController = require('./routes/api/receipt/controllers/receiptController');
app.use('/v1/receipt', receiptController);



const articlesController = require('./routes/api/articles/controllers/ArticlesController');
app.use('/v1/articles', articlesController);

const cartsController = require('./routes/api/carts/controllers/CartsController');
app.use('/v1/carts', cartsController);



const translationsController = require('./routes/api/translations/controllers/TranslationsController');
app.use('/v1/translations', translationsController);

const countriesController = require('./routes/api/countries/controllers/CountriesController');
app.use('/v1/countries', countriesController);

const categoriesController = require('./routes/api/articles/controllers/CategoriesController');
app.use('/v1/categories', categoriesController);

const siteMapController = require('./routes/api/sitemap/controllers/SiteMapController');
app.use('/v1/sitemap', siteMapController);



const searchController = require('./routes/api/search/controllers/SearchController');
app.use('/v1/search', searchController);


const unitsController = require('./routes/api/units/controllers/UnitsController');
app.use('/v1/units', unitsController);


const colorsController = require('./routes/api/colors/controllers/ColorsController');
app.use('/v1/colors', colorsController);

const menusController = require('./routes/api/menus/controllers/MenusController');
app.use('/v1/menus', menusController);

const productCategoriesController = require('./routes/api/products/controllers/ProductCategoriesController');
app.use('/v1/productCategories', productCategoriesController);

const productsController = require('./routes/api/products/controllers/ProductsController');
app.use('/v1/products', productsController);

const usersController = require('./routes/api/users/controllers/UsersController');
app.use('/v1/users', usersController);

const companiesController = require('./routes/api/companies/controllers/CompaniesController');
app.use('/v1/companies', companiesController);


const uploadController = require('./routes/api/uploads/controllers/UploadController');
app.use('/v1/file-upload', uploadController);

const authController = require('./routes/api/auth/controllers/AuthController');
app.use('/v1/auth', authController);

const slidesController = require('./routes/api/slides/controllers/SlidesController');
app.use('/v1/slides', slidesController);

const settingsController = require('./routes/api/settings/controllers/SettingsController');
app.use('/v1/settings', settingsController);

const shippingCompaniesController = require('./routes/api/shipping/controllers/ShippingCompaniesController');
app.use('/v1/shippingCompanies', shippingCompaniesController);

const shippingController = require('./routes/api/shipping/controllers/ShippingController');
app.use('/v1/shipments', shippingController);

const shippingAddressesController = require('./routes/api/shipping/controllers/ShippingAddressesController');
app.use('/v1/shipments/addresses', shippingAddressesController);

const shippingPricingController = require('./routes/api/shipping/controllers/ShippingPricingController');
app.use('/v1/shipping/pricing', shippingPricingController);


const ordersController = require('./routes/api/orders/controllers/OrdersController');
app.use('/v1/orders', ordersController);

const quotationsController = require('./routes/api/quotations/controllers/QuotationsController');
app.use('/v1/quotations', quotationsController);

const navigationMenusController = require('./routes/api/menus/controllers/NavigationMenusController');
app.use('/v1/navigation-menus', navigationMenusController);



const dashboardController = require('./routes/api/dashboard/controllers/DashboardController');
app.use('/v1/dashboard', dashboardController);

const knetController = require('./routes/api/payments/controllers/KnetController');
app.use('/v1/payment/knet', knetController);

const paymentsController = require('./routes/api/payments/controllers/PaymentsController');
app.use('/v1/payments', paymentsController);

const mailerController = require('./routes/api/communication/controllers/MailSender');
app.use('/v1/mailer', mailerController);

const messageQueueController = require('./routes/api/communication/controllers/MessageQueueController');
app.use('/v1/message-queue', messageQueueController);



const toDosController = require('./routes/api/todos/controllers/ToDosController');
app.use('/v1/todos', toDosController);


const mailTemplatesController = require('./routes/api/communication/controllers/MailTemplatesController');
app.use('/v1/mail-templates', mailTemplatesController);




//app.get('/uploads*', (req, res) => {res.sendFile(publicDirPath + '/index.html');})


// This displays message that the server running and listening to specified port




//DB Config
const db = config.get("mongoURI");// require('./config/keys').mongoURI;

var ip = require("ip");
const { json } = require('body-parser');
console.log("Host IP Address : " + ip.address());



//Connect to MongoDb
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log("Connected to database..." ) })
  .catch(e => { console.log("Error Connecting to db. - " + e.message); });
//mongoose.set('useFindAndModify', false);


//firebase.initializeApp({
//  credential: firebase.credential.cert(serviceAccount)
//});


//const firebaseDeviceToken = 'abcdeabcdeabcde';
const payload = {
  notification: {
    title: 'Notification Title',
    body: 'This is an example notification',
  }
};

const options = {
  priority: 'high',
  timeToLive: 60 * 60 * 24, // 1 day
};

/*=========== Web socket Serrver configuration ===============*/


const notificationCheck = (req, res, next) => {
  next();
  if (res.notify) {
    //console.log('got res.notify...');
    console.log(res.notify);
    try {
      if (res.notify.userEmail) {
        let userSockets = sockets.get(res.notify.userEmail);
        //console.log(`found ${userSockets.length} messages for user `);
        userSockets.forEach(s => {
          // console.log('sending message via websocket...');
          s.send(JSON.stringify(res.notify));
        });
      } else {
        notifyAllUsers(res.notify);
      }

    }
    catch (e) {
      console.error(e);
    }

  }
}

const removeSocket = (dws) => {
  sockets.forEach(function (userSockets, key) {
    userSockets = userSockets.filter(ws => ws != dws);
    sockets.set(key, userSockets);
  });
}

const notifyAllUsers = (notification) => {
  try {
    sockets.forEach(function (userSockets, key) {
      userSockets.forEach(userSocket => {
        console.log('sending message via websocket  ' + JSON.stringify(notification));
        userSocket.send(JSON.stringify(notification));
      });
      // console.log(key + " : " + value);
    });
  } catch (e) {
    console.error(e);
  }
}
app.use(notificationCheck);

const wss = new WebSocket.Server({ server: server });


let sockets = new HashMap();


wss.on('connection', function (ws) {
  console.log('web-socket: new client connected.');
  //sockets.push(ws);

  // When you receive a message, send that message to every socket.
  ws.on('message', function (msg) {
    console.log('web-socket: new message received: ' + msg);
    let messageObject = JSON.parse(msg);
    if (messageObject.command === "bind-user") {
      console.log("Binding User [" + messageObject.email + "]");
      let userSockets = sockets.get(messageObject.email);
      if (!userSockets) {
        userSockets = [];
      }
      if (userSockets.filter(s => s == ws).length == 0) {
        userSockets.push(ws);
        sockets.set(messageObject.email, userSockets);
      }

      console.log(`userSockets.length: ${userSockets.length}`);


      console.log(`socket.size: ${sockets.size}`);

    }
    //console.log(sockets);
    //console.log(JSON.stringify(ws));
    //sockets.forEach(s => s.send(msg));
  });

  // When a socket closes, or disconnects, remove it from the array.
  ws.on('close', function () {
    console.log('web-socket: client connection closed.');
    //delete ws
    removeSocket(ws);
  });
});
server.listen(port, () => console.log(`Listening on port ${port}`));



//firebase.messaging().sendToDevice(firebaseDeviceToken, payload, options);

