let selectMenu = document.querySelector(".selectProgress");
let noteTitle = document.querySelector("#title");
let noteText = document.querySelector(".text");
let addBtn = document.querySelector("#createBtn");
let updateBtn = document.querySelector("#updateBtn");


let localGet = JSON.parse(localStorage.getItem("note")) || [];


const saveLocal = (saveValue) => {
    localStorage.setItem("note", JSON.stringify(saveValue));
};

window.onload = () => {
    RendarCard(localGet);
};


addBtn.addEventListener("click", () => {


    if (noteTitle.value.length < 1 || !noteTitle.value.length > 12) {
        showToast("Please Write a Title between 1 to 12 letters")
        return;
    }

    if (noteText.value.length <= 30) {
        showToast("Please Write Text that is greater than 20 letters")
        return;
    }

    let now = moment()

    let metaData = {
        noteTitle: noteTitle.value,
        noteText: noteText.value,
        noteProgress: selectMenu.value,
        createdAt: now.format('YYYY-MM-DD HH:mm')
    };

    localGet.push(metaData);
    saveLocal(localGet);
    RendarCard(localGet);

    showToast("Note Created !")


    noteTitle.value = ""
    noteText.value = ""
    selectMenu.value = ""


    const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
    if (modal) {
        modal.hide();
    } else {
        console.error("Modal instance not found");
    }
});

let bottomDiv = document.querySelector(".bottomDiv");
const RendarCard = (cardData) => {
    bottomDiv.innerHTML = "";
    cardData.forEach((note, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.width = '18rem';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitleContainer = document.createElement('div');
        cardTitleContainer.className = 'd-flex align-items-center justify-content-between';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = note.noteTitle;

        const statusBox = document.createElement('span');
        statusBox.className = 'status-box';
        statusBox.style.width = '75px';
        statusBox.style.fontSize = '13px';
        statusBox.style.color = 'white';
        statusBox.style.height = '25px';
        statusBox.style.borderRadius = '5px';
        statusBox.style.textAlign = 'center';
        statusBox.style.display = 'inline-block';

        const status = note.noteProgress;

        switch (status) {
            case 'todo':
                statusBox.innerHTML = status;
                statusBox.style.backgroundColor = 'gray';
                break;
            case 'inProgress':
                statusBox.style.backgroundColor = 'blue';
                statusBox.innerHTML = status;
                break;
            case 'incomplete':
                statusBox.innerHTML = status;
                statusBox.style.backgroundColor = 'red';
                break;
            case 'complete':
                statusBox.innerHTML = status;
                statusBox.style.backgroundColor = 'green';
                break;
            default:
                statusBox.innerHTML = status;
                statusBox.style.backgroundColor = 'gray';
                break;
        }

        cardTitleContainer.appendChild(cardTitle);
        cardTitleContainer.appendChild(statusBox);

        cardBody.appendChild(cardTitleContainer);

        const cardText = document.createElement('p');
        cardText.className = 'card-text';
        if (note.noteText.length > 50) {
            cardText.style.display = '-webkit-box';
            cardText.style.webkitBoxOrient = 'vertical';
            cardText.style.overflow = 'hidden';
            cardText.style.textOverflow = 'ellipsis';
            cardText.style.webkitLineClamp = '4';
        }
        cardText.textContent = note.noteText;
        cardBody.appendChild(cardText);

        const cardBodyContainer = document.createElement('div');
        cardBodyContainer.className = 'cardBody';

        const rightSide = document.createElement('div');
        rightSide.className = 'rightSide';

        const dateContainer = document.createElement('div');
        dateContainer.className = 'leftSide';
        dateContainer.style.flex = '1';

        const dateP = document.createElement("p");
        dateP.style.margin = '0';
        dateP.style.fontSize = '12px';
        dateP.innerHTML = note.createdAt;
        dateContainer.appendChild(dateP);

        const iconsContainer = document.createElement('div');
        iconsContainer.className = 'icons-container';

        const EyeIcon = document.createElement('i');
        EyeIcon.className = 'bi bi-eye-fill';
        EyeIcon.onclick = () => showDetail(i);
        iconsContainer.appendChild(EyeIcon);

        const pencilIcon = document.createElement('i');
        pencilIcon.className = 'bi bi-pencil-fill';
        pencilIcon.onclick = () => editNote(i);
        iconsContainer.appendChild(pencilIcon);

        const trashIcon = document.createElement('i');
        trashIcon.className = 'bi bi-trash-fill';
        trashIcon.onclick = () => noteDelete(i);
        iconsContainer.appendChild(trashIcon);

        rightSide.appendChild(dateContainer);
        rightSide.appendChild(iconsContainer);

        cardBodyContainer.appendChild(rightSide);
        cardBody.appendChild(cardBodyContainer);

        card.appendChild(cardBody);

        bottomDiv.appendChild(card);
    });
};

const noteDelete = (index) => {
    localGet.splice(index, 1);
    saveLocal(localGet);
    showToast("Note Deleted!")

    RendarCard(localGet);

};


const editNote = (index) => {
    console.log(index);
    let getDetails = localGet.slice(index, index + 1)
    console.log(getDetails);
    localStorage.setItem("index", index)

    document.querySelector('#edit-Title').value = getDetails.map((data) => data.noteTitle);
    document.querySelector('.edit-text').value = getDetails.map((data) => data.noteText);
    document.querySelector('.edit-selectProgress').value = getDetails.map((data) => data.noteProgress);

    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
};



updateBtn.addEventListener("click", () => {

    let editTitle = document.querySelector('#edit-Title').value
    let editText = document.querySelector('.edit-text').value
    let editProgress = document.querySelector('.edit-selectProgress').value

    let indexGet = localStorage.getItem("index")

    let updateNote = localGet[indexGet]
    let metaData = {
        noteTitle: editTitle,
        noteText: editText,
        noteProgress: editProgress,
        createdAt: updateNote.createdAt
    };

    localGet[indexGet] = metaData

    saveLocal(localGet)
    RendarCard(localGet)

    showToast("Updated Sucessfully!")


    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    if (modal) {
        modal.hide();
    } else {
        console.error("Modal instance not found");
    }
})



const showDetail = (index) => {

    let getDetails = localGet[index]
    console.log(getDetails);

    document.querySelector('#noteTitle').innerHTML = getDetails.noteTitle;
    document.querySelector('#noteText').innerHTML = getDetails.noteText;
    document.querySelector('#progress').innerHTML = getDetails.noteProgress;



    const modal = new bootstrap.Modal(document.getElementById('showDetailModal'));
    modal.show();
};





const showToast = (param) => {
    Toastify({
        text: `${param}`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "green",
        stopOnFocus: true,
        style: {
            maxWidth: "95%",
            wordBreak: "break-word",
        }
    }).showToast();
}






document.querySelector("#searchNote").addEventListener("input", (e) => {
    let searchValue = e.target.value.trim().toLowerCase();
    let search = localGet.filter(note => note.noteTitle.toLowerCase().includes(searchValue));
    bottomDiv.innerHTML = ""
    if (search.length > 0) {
        RendarCard(search)
    } else {
        const emptyDiv = document.createElement('div');
        emptyDiv.style.width = '100%'
        emptyDiv.style.display = "flex"
        emptyDiv.style.justifyContent = "center"
        emptyDiv.style.alignItems = "center"
        emptyDiv.style.fontSize = "25px"
        emptyDiv.style.fontWeight = "800"
        emptyDiv.style.height = '80vh'

        emptyDiv.innerHTML = "NO DATA"
        bottomDiv.appendChild(emptyDiv)
    }

})