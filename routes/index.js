var express = require('express');
var router = express.Router();
let fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
//pt xml to json
var parseString = require('xml2js').parseString;
//pt json to excel
var json2xls = require('json2xls');//cam slabut
//incercam mai degraba xlsx
// import * as XLSX from 'xlsx';
let XLSX = require('xlsx')
// conversia / identificarea string-ului din req.body
const excel = require('node-excel-export');
//pt simplificare path-uri json
var flatten = require('flat') 
//pt simplificare array-uri 

//pt obj to array - nefolosit momentan
const objToArray = require("obj-to-array");


const styles = {
  headerDark: {
    fill: {
      fgColor: {
        rgb: 'FF000000'
      }
    },
    font: {
      color: {
        rgb: 'FFFFFFFF'
      },
      sz: 14,
      bold: true,
      underline: true
    }
  },
};

router.post('/testXML', function (req, res) {
  let y = req.body

  parseString(req.body.data, function (err, result) {
    // console.log(result);
    console.log(typeof result);
    // console.log(result["soap:Envelope"]["soap:Body"][0].CautareDosareResponse[0].CautareDosareResult[0].Dosar);
    let dosare = result["soap:Envelope"]["soap:Body"][0].CautareDosareResponse[0].CautareDosareResult[0].Dosar
    // console.log('dosare', dosare);
let dosare1=flatten(dosare[0])
let dosare2=objToArray(dosare[0])

console.log('dosare 0 non flat',dosare[0]);

 


dosare.forEach(element => {
  //mai degraba de facut forin pe chei, preventiv - TODO
  // element.parti=JSON.stringify(flatten(element.parti))
  //if-uri pt ca unele dosare pot sa nu aiba unul din elementele de mai jos
  if (element.parti) {
    element.parti=JSON.stringify(flatten(element.parti))
  }
  if (element.sedinte) {
    element.sedinte=JSON.stringify(flatten(element.sedinte))
  }
  if (element.caiAtac) {
    element.caiAtac=JSON.stringify(flatten(element.caiAtac))
  }
  // element.sedinte=JSON.stringify(flatten(element.sedinte))
  // element.caiAtac=JSON.stringify(flatten(element.caiAtac))
});

console.log('dosare0 flat',dosare);

// res.json(dosare[0].parti)
    //poate nu e chiar util, de vazut
    // let dosareFlat=[]
    // dosare.forEach(element => {
    //   dosareFlat.push(flatten(element))
    // });
    // console.log('dosare flat',dosareFlat);

    //mai degraba flatten array (la cam tot din fiecare element din dosare; vezi ultimul tab din opera ; TODO AICI)


    //  fs.writeFileSync('data.csv', result1, 'binary');
    //  res.sendFile(path.join(__dirname,'../data.csv'))

    const specification = {
      parti: {
        displayName: 'Parti', width: 120,headerStyle: styles.headerDark
      },
      sedinte: {
        displayName: 'sedinte', width: 120,headerStyle: styles.headerDark
      },
      caiAtac: {
        displayName: 'Cai Atac', width: 120,headerStyle: styles.headerDark
      },
      numar: {
        displayName: 'Numar', width: 120,headerStyle: styles.headerDark
      },
      numarVechi: {
        displayName: 'Numar Vechi', width: 120,headerStyle: styles.headerDark
      },
      data: {
        displayName: 'Data', width: 120,headerStyle: styles.headerDark
      },
      institutie: {
        displayName: 'Institutie', width: 120,headerStyle: styles.headerDark
      },
      departament: {
        displayName: 'Departament', width: 120,
        headerStyle: styles.headerDark
      },
      categorieCaz: {
        displayName: 'Categorie Caz', width: 120,headerStyle: styles.headerDark
      },
      stadiuProcesual: {
        displayName: 'Stadiu Procesual', width: 120,headerStyle: styles.headerDark
      },
      obiect: {
        displayName: 'Obiect', width: 120,headerStyle: styles.headerDark
      },
      dataModificare: {
        displayName: 'Data modificare', width: 120,headerStyle: styles.headerDark
      },
      categorieCazNume: {
        displayName: 'Categorie Caz', width: 120,headerStyle: styles.headerDark
      },
      stadiuProcesualNume: {
        displayName: 'Stadiu Procesual', width: 120,headerStyle: styles.headerDark
      },
    }

    const report = excel.buildExport(
      [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
        {
          name: 'Report', // <- Specify sheet name (optional)
          // heading: heading, // <- Raw heading array (optional)
          // merges: merges, // <- Merge cell ranges
          specification: specification, // <- Report specification
          data: dosare // <-- Report data
        }
      ]
    );

    //IMPORTANT
    //trimite fisierul in base64 catre client (mai simplu decat sa-l trimita in format xls)
    fs.writeFileSync('data.xls', report);
 let documentul = fs.readFileSync(path.join(__dirname,'../data.xls')).toString('base64')
 res.json(documentul)
 

// res.sendFile(path.join(__dirname,'../data.xlsx'))
    // res.json('ok')

  });

  // console.log(req.body);

})

module.exports = router;

