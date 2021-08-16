

// $('#formCauta').submit(function (e) {
//   e.preventDefault();
//   // window.location.href='https://portal.just.ro/SitePages/acasa.aspx'

//   e.target.reset()
  
// });

let x; let q;

$('#formCauta').submit(function (e) {
  e.preventDefault();
  //primul e pt test
  $('#modalstart').click()
  var webserUrl = "https://damp-plateau-75038.herokuapp.com/http://portalquery.just.ro/Query.asmx?op=CautareDosare";
  //primul e pt test

  let soapRequest = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <CautareDosare xmlns="portalquery.just.ro">
        
          <numeParte>${$('#cautare').val()}</numeParte>
       
        </CautareDosare>
      </soap:Body>
    </soap:Envelope>`
  $.ajax({
    type: "post",
    url: webserUrl,
    contentType: "text/xml",
    dataType: "xml",
    data: soapRequest,
    success: function (response) {
      console.log(response);
      console.log('primit', typeof response);
      x = response
      // let data={obiectxml:response.toString()}
      //conversie (serializare) din xml in string
      var s = new XMLSerializer();
      var str = s.serializeToString(response);
      let data = { data: str }

      console.log('data string', data);

      $.ajax({
        type: "post",
        url: "/testXML",
        // contentType: "text/xml",
        // dataType: "xml",
        // processData: false,
        data: data,
        // dataType: "dataType",
        success: function (response) {
          console.log('resp 2', response);
          q = response;

          // salvare fisier - IMPORTANT

          var blob1 = b64toBlob(response, '');
          var blobUrl1 = URL.createObjectURL(blob1);

          saveFile1('salvare.xls', blobUrl1)

          $('#modalclose').click()

          document.querySelector('#formCauta').reset()
        }
      });
    }
  });

});


function saveFile1(fileName, urlFile) {
  let a = document.createElement("a");
  a.style = "display: none";
  document.body.appendChild(a);
  a.href = urlFile;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(urlFile);
  a.remove();
}

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);

  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
};