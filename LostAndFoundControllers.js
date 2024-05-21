const { Category, Find, Location } = require('./LostAndFoundModels');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

const lostAndFoundController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    createCategory: async (req, res) => {
        try {
            const newCategory = await Category.create(req.body);
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(updatedCategory);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            await Category.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    getAllFinds: async (req, res) => {
        try {
            const {name, id_location , id_category} = req.query;
            const params = {}
            if (name) {
                params.name = name;
            }
            if (id_location) {
                params.id_location = id_location;
            }
            if(id_category) {
                params.id_category = id_category;
            }
            const finds = await Find.find(params);
            const formattedFinds = finds.map(find => ({
                ...find._doc,
                dateOfFinding: moment(find.dateOfFinding).format('DD.MM.YYYY') // Форматуємо дату
            }));
            res.status(200).json(formattedFinds);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    createFind: async (req, res) => {
        try {
            const { name, description, whereWasFound, id_category, dateOfFinding, id_location } = req.body;
            const photo = req.file ? req.file.filename : '';

            // Перетворюємо дату з формату 'дд.мм.рррр' в формат Date для збереження в БД
            //const formattedDateOfFinding = moment(dateOfFinding, 'DD.MM.YYYY').toDate();

            const newFind = await Find.create({
                name,
                description,
                photo,
                whereWasFound,
                id_category,
                dateOfFinding, // Зберігаємо дату в форматі Date
                id_location
            });
            res.status(201).json(newFind);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    updateFind: async (req, res) => {
        try {
            const find = await Find.findById(req.params.id);
            if (!find) {
                return res.status(404).json({ message: 'Find not found' });
            }
            const updatedData = req.body;
            if (req.file) {
                // Delete the old photo
                const oldPhotoPath = path.join(__dirname, 'uploads', find.photo);
                fs.unlink(oldPhotoPath, (err) => {
                    if (err) {
                        console.error('Error deleting old photo:', err);
                    }
                });
                // Update with the new photo
                updatedData.photo = req.file.filename;
            }
            // Перетворюємо дату з формату 'дд.мм.рррр' в формат Date для збереження в БД
            if (updatedData.dateOfFinding) {
                const dateParts = updatedData.dateOfFinding.split('.');
                if (dateParts.length === 3) {
                    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                    updatedData.dateOfFinding = new Date(formattedDate);
                }
            }
            const updatedFind = await Find.findByIdAndUpdate(req.params.id, updatedData, { new: true });
            res.status(200).json(updatedFind);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    deleteFind: async (req, res) => {
        try {
            const find = await Find.findById(req.params.id);
            if (!find) {
                return res.status(404).json({ message: 'Find not found' });
            }
            const photoPath = path.join(__dirname, 'uploads', find.photo);
            await Find.findByIdAndDelete(req.params.id);
            fs.unlink(photoPath, (err) => {
                if (err) {
                    console.error('Error deleting photo file:', err);
                    return res.status(500).json({ message: 'Error deleting photo file' });
                }
                res.status(200).json({ message: 'Find and photo deleted successfully' });
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    getAllLocations: async (req, res) => {
        try {
            const locations = await Location.find();
            res.status(200).json(locations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    createLocation: async (req, res) => {
        try {
            const newLocation = await Location.create(req.body);
            res.status(201).json(newLocation);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    updateLocation: async (req, res) => {
        try {
            const updatedLocation = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(updatedLocation);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    deleteLocation: async (req, res) => {
        try {
            await Location.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Location deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};

module.exports = lostAndFoundController;
