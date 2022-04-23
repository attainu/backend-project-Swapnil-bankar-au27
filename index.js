const dropZone = document.querySelector(".drop-zone");

const browseBtn = document.querySelector(".browse-Btn");
const fileInput = document.querySelector('#fileInput');

const host = "https:herokuapp.com";

const uploadURL = `${host}api/files`;
// const uploadURL = `${host}api/files`;

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault()

    if (!dropZone.classList.contains('dragged')) { //  whenver we drag this  functin will run 
        dropZone.classList.add("dragged")
    }
});
// for removeing the drage ones the mouse wil reach at draged zone and left the  position itself 
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove("dragged");
})
dropZone.addEventListener('drop', (e) => {

    e.preventDefault()
    dropZone.classList.remove("dragged");

    const files = e.dataTransfer.files

    console.log(files)

    if (files.length) {
        fileInput.files = files;
        uploadfile();
    }
    // console.log(e.dataTransfer.files.length)
    // console.log(e.dataTransfer.files)

});
browseBtn.addEventListener("click", () => {


    fileInput.click();
})

const uploadfile = () => {
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("myfile", file)
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            // console.log(xmr.readyState)

            if (xhr.readyState === XMLHttpRequest.DONE) {
                console.log(xhr.response);
            }

        };

        xhr.open('POST', uploadURL);

        xhr.send(formData);


    }
    // index.listen(3000, () => {
    //     console.log("server started in port 3000")
    // })