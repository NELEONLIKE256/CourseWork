const express = require('express');
const router = express.Router();
const lostAndFoundController = require('./LostAndFoundControllers');
const multer = require('multer');
const path = require('path');
const { Item } = require('./LostAndFoundModels'); // Підключення моделі Item

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Categories routes
router.get('/categories', lostAndFoundController.getAllCategories);
router.post('/categories', lostAndFoundController.createCategory);
router.put('/categories/:id', lostAndFoundController.updateCategory);
router.delete('/categories/:id', lostAndFoundController.deleteCategory);

// Finds routes
router.get('/', lostAndFoundController.getAllFinds);
router.post('/finds', upload.single('photo'), lostAndFoundController.createFind);
router.put('/finds/:id', upload.single('photo'), lostAndFoundController.updateFind);
router.delete('/finds/:id', lostAndFoundController.deleteFind);

// Locations routes
router.get('/locations', lostAndFoundController.getAllLocations);
router.post('/locations', lostAndFoundController.createLocation);
router.put('/locations/:id', lostAndFoundController.updateLocation);
router.delete('/locations/:id', lostAndFoundController.deleteLocation);



module.exports = router;
