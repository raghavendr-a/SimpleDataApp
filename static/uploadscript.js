var dataset = []
var table = `<table class="rwd-table"> <tbody>`
function loadDataSet() {
   const xhttp = new XMLHttpRequest();
   xhttp.onload = function() {
    let res = JSON.parse(this.responseText)
    if(!res.length){
      document.getElementById("data").innerHTML = "<h1 style='font-family: Montserrat, sans-serif;color:#dd5;' >No Datasets Available Please Upload a Dataset</h1>"
    }else{
        dataset = res
      document.getElementById('h3-tag').setAttribute('style','font-family: Montserrat, sans-serif;color:#dd5;')
      for( i in  res){
        index = parseInt(i)  + 1
         table += `<tr><th style="text-align: center;">`+ `${index}.  ${res[i]}` + `</th></tr>`
      }

      table += `</tbody></table>`
      console.log(res)
     document.getElementById("data").innerHTML = table;
     }
    }
   xhttp.open("GET", "/dataset", true);
   xhttp.send();
 }
 loadDataSet()





var body = document.querySelector('body');
const upload = document.querySelector('.upload');
const uploadButtonText = document.querySelector('.upload-button-text');
const uploadFilename = document.querySelector('.upload-filename');
const fileInput = document.getElementById('file');
fileInput.onchange = () => uploadFile(fileInput.files[0]);
function uploadFile(file) {
    
    if (file) {
        // Add the file name to the input and change the button to an upload button
        uploadFilename.classList.remove('inactive');
        
        uploadFilename.innerText = file.name;
        uploadButtonText.innerText = 'Upload';
        fileInput.remove();
        uploadButtonText.addEventListener("click", async () => {
            
            var datasetName = document.getElementById('dataName').value
            if(dataset.includes(datasetName) || !datasetName.trim()){
                
                if(!datasetName.trim()){
                    alert("Enter Dataset Name to upload")
                }else{
                let existedDsName = dataset[dataset.indexOf(datasetName)]
                alert(`DataSet Name: "${existedDsName}" already exists use different Name`)
                }
            }

            if(datasetName.trim() && !dataset.includes(datasetName)){
            upload.classList.add("uploading");

            const xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/dataset", true);
            var formData = new FormData();
            formData.append("file", file)
            formData.append('dataName',datasetName)
            // Here you can upload the file to a database, server, or wherever you need it.
            // You can access the uploaded file by the `file` parameter.

            xhttp.send(formData);
            // Reset the input after a delay. For actual use, only remove the uploading class when the file is done uploading!
            setTimeout(() => {
                upload.classList.remove("uploading");
                location.reload()
            }, 3000);
        }
        
        });
    }
}
// Drop stuff
const dropArea = document.querySelector('.drop-area');
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}
// Add dropArea bordering when dragging a file over the body
;
['dragenter', 'dragover'].forEach(eventName => {
    body.addEventListener(eventName, displayDropArea, false);
});
['dragleave', 'drop'].forEach(eventName => {
    body.addEventListener(eventName, hideDropArea, false);
});
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});
function highlight(e) {
    if (!dropArea.classList.contains('highlight'))
        dropArea.classList.add('highlight');
}
function unhighlight(e) {
    dropArea.classList.remove('highlight');
}
function displayDropArea() {
    if (!dropArea.classList.contains('highlight'))
        dropArea.classList.add('droppable');
}
function hideDropArea() {
    dropArea.classList.remove('droppable');
}
// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);
function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    let file = files[0];
    uploadFile(file);
}

