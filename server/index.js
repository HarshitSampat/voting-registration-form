const fs = require('fs');
const data = require('../src/assets/indianStateCityAreaCode.json');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    let stateAndCity = [];

    statesData = []

    var statesData = []
    for (let state in data) {
        if (statesData.length < 3) {
            console.log(statesData);
            statesData.push(state)
            var stateJson = {}
            let stateID = stateAndCity.length + 1
            stateJson['ID'] = stateID
            stateJson['name'] = state
            stateJson['parentId'] = null
            stateJson['controlId'] = "stateDropdown"

            stateAndCity.push(stateJson)

            for (city in data[state]) {
                let cityJson = {}
                let cityID = stateAndCity.length + 1
                let ParentOfCity = stateID
                cityJson['ID'] = cityID;
                cityJson['name'] = city;
                cityJson['parentId'] = ParentOfCity
                cityJson['controlId'] = "cityDropdown"
                stateAndCity.push(cityJson)


                for (area in data[state][city]) {
                    let parentAreaId = cityID
                    let areaJson = {}
                    areaJson['ID'] = stateAndCity.length + 1;
                    areaJson['name'] = area;
                    areaJson['parentId'] = parentAreaId
                    areaJson['controlId'] = "areaDropdown"
                    stateAndCity.push(areaJson)
                }
            }
        }


    }

    res.send(stateAndCity)


    // fs.writeFile('./newJson.json', JSON.stringify(newJson), (err) => {
    //     if (err) {
    //         console.error(err);
    //         res.status(500).send('Error writing JSON file');
    //     } else {
    //         console.log('New JSON file written successfully');
    //         res.send(JSON.stringify(newJson));
    //     }
    // });
});

const port = 5000;
app.listen(port, () => {
    console.log(`Example app running on port ${port}`);
});
