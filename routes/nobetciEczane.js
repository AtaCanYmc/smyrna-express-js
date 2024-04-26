var express = require('express');
const {getApiList, izbbUrlList} = require("../public/javascripts/izbb-api-handler.js");
const {getNearestLocations} = require("../public/javascripts/izbb-api-handler");
var router = express.Router();

const tumNobetciEczaneler = async (req, res) => {
    let nobetciEczaneler = await getApiList(izbbUrlList.nobetciEczane);
    if (nobetciEczaneler){
        res.send(nobetciEczaneler);
    } else {
        let error = 'Error on \'openapi.izmir.bel.tr\'';
        res.send({error});
    }
};

const enYakinNobetciEczaneler = async (req, res) => {
    let enlem = req.query.enlem;
    let boylam = req.query.boylam;
    let adet = req.query.adet || 3;
    let nobetciEczaneler = await getApiList(izbbUrlList.nobetciEczane);
    let yakinNE = getNearestLocations(enlem, boylam, adet, nobetciEczaneler, 'LokasyonX', 'LokasyonY');
    res.send(yakinNE);
};

router.get('/', tumNobetciEczaneler);
router.get('/yakin', enYakinNobetciEczaneler);

module.exports = router;

