var express = require('express');
const {getApiList, izbbUrlList} = require("../public/javascripts/izbb-api-handler.js");
const {getNearestLocations} = require("../public/javascripts/izbb-api-handler");

var router = express.Router();
const createError = require('http-errors');

const tumNobetciEczaneler = async (req, res, next) => {
    try {
        const nobetciEczaneler = await getApiList(izbbUrlList.nobetciEczane);

        if (nobetciEczaneler) {
            res.status(200).send(nobetciEczaneler);
        } else {
            return next(createError(404, "Pharmacies not found"));
        }
    } catch (error) {
        return next(createError(500, "Internal Server Error"));
    }
};

const enYakinNobetciEczaneler = async (req, res, next) => {
    const enlem = parseFloat(req.query.enlem); // Convert to float for calculations
    const boylam = parseFloat(req.query.boylam);
    const adet = parseInt(req.query.adet) || 3; // Default to 3 if not provided

    if (isNaN(enlem) || isNaN(boylam)) {
        return next(createError(400, 'Invalid latitude or longitude'));
    }

    try {
        const nobetciEczaneler = await getApiList(izbbUrlList.nobetciEczane);

        if (nobetciEczaneler) {
            const yakinNE = getNearestLocations(enlem, boylam, adet, nobetciEczaneler, 'LokasyonY', 'LokasyonX'); // Corrected order
            res.status(200).send(yakinNE);
        } else {
            return next(createError(404, 'No pharmacies found'));
        }
    } catch (error) {
        return next(createError(500, 'Internal Server Error'));
    }
};

router.get('/', tumNobetciEczaneler);
router.get('/yakin', enYakinNobetciEczaneler);

module.exports = router;

