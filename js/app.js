// Anime
import anime from '../node_modules/animejs/lib/anime.es.js';
import icons from 'url:../img/sprite.svg';

const btnAddNote = document.querySelector('.btn-action');
const selectColorContainer = document.querySelector('.color-box');
const notesContainer = document.querySelector('.notes-container');
const searchInput = document.querySelector('.search__input');
const bookmarkList = document.querySelector('.modal-list');

let isActiveBtnAddNote = false;


let noteArr = [];
const filterNote = {
  search: ''
};

// when click btn add show animate in button
const animateBtnAdd = function (state) {
  const tl = anime.timeline();
  if (state) {
    tl.add({
      targets: btnAddNote,
      translateY: [0, -12, 0],
      scale: [1, 0.85, 1],
      rotate: 316,
      duration: 600,
      easing: "easeInOutSine",
    })
      .add(
        {
          targets: ".color-box .color-first",
          translateY: [0, 100],
          duration: 3200,
          scaleY: [1.8, 1],

        },
        "-=400"
      )
      .add(
        {
          targets: ".color-box .other",
          translateY: function (el) {
            return [el.getAttribute("data-from"), el.getAttribute("data-to")];
          },
          scaleY: [0, 1],
          duration: 1600,
          opacity: {
            value: 1,
            duration: 10,
          },
          delay: anime.stagger(240),

        },
        "-=2600"
      );
  }
  else {
    tl.add({
      targets: btnAddNote,
      rotate: 0,
      duration: 600,
      easing: "easeInOutSine",
    })

      .add(
        {
          targets: ".color-box .color",
          translateY: function (el) {
            return [el.getAttribute("data-to"), 0];
          },
          duration: 400,
          delay: anime.stagger(60),
          easing: "easeInOutSine",

        },
        "-=400"
      );
  }
};
// when click btn edit show animate in button
const animateBtnEdit = function (state, btnId) {
  const tl = anime.timeline();
  if (state) {
    tl.add({
      targets: `.btn-edit-${btnId}`,
      translateX: [0, -12, 0],
      scale: [1, 0.85, 1],

      duration: 600,
      easing: "easeInOutSine",
    })
      .add(
        {
          targets: `.box-${btnId} .color-first`,
          translateX: [0, -80],
          duration: 3200,
          scaleX: [1.8, 1],

        },
        "-=400"
      )
      .add(
        {
          targets: `.box-${btnId} .other`,
          translateX: function (el) {
            return [-el.getAttribute("data-from"), -el.getAttribute("data-to")];
          },
          scaleX: [0, 1],
          duration: 1600,
          opacity: {
            value: 1,
            duration: 10,
          },
          delay: anime.stagger(240),

        },
        "-=2600"
      );
  }
  else {
    tl.add({
      targets: `.btn-edit-${btnId}`,
      rotate: 0,
      duration: 600,
      easing: "easeInOutSine",
    })

      .add(
        {
          targets: `.box-${btnId} .color`,
          translateX: function (el) {
            return [-el.getAttribute("data-to"), 0];
          },
          duration: 400,
          delay: anime.stagger(60),
          easing: "easeInOutSine",

        },
        "-=400"
      );
  }
};
// add new note
const addNote = function (array, color) {
  let id=crypto.randomUUID()
  array.push(
    {
      id: id,
      note: 'this is Docket note',
      date: new moment().format('LLL'),
      favorite: false,
      noteColor: color,

    }
  );
};
//find note from noteArr
const findNote = function (arr, id) {
  return arr.find((note) => note.id === id);
};
// filter note where fav==true
const filterFavoriteNote = function (arr) {
  return arr.filter(note =>
    note.favorite == true
  );


};
// search note
const searchNote = function (arr = noteArr, search) {
  const filterd = noteArr.filter(item => item.note.includes(search));

  renderNote(filterd);
};

// renderNote
const renderNote = function (notes, render = true) {




  let markup = notes.map((note) => generateMarkupNote(note)).join('');

  if (!render) return markup;

  notesContainer.innerHTML = '';
  notesContainer.insertAdjacentHTML('afterbegin', markup);

  if (notes.length == 0) displayMessage(notesContainer, 'error', 'No note found for your query! Please try again ;)');
};

// renderBookmark
const renderBookmark = function (bookmarks) {

  // 1) filter favorite notes
  const favoritArr = filterFavoriteNote(bookmarks);

  // 2) render bookamark 
  let markup = favoritArr.map((note) => generateMarkupBookMark(note)).join('');
  bookmarkList.innerHTML = '';
  bookmarkList.insertAdjacentHTML('afterbegin', markup);

  // 3) check exist favorite note

  if (favoritArr.length == 0) displayMessage(bookmarkList, 'message', ' No bookmarks yet. Find a note and bookmark it :)');

};

// generate Markup
const generateMarkupNote = function (note) {
  return `

  <div class="note  note--${note.noteColor}" name='color'  data-id='${note.id}' id="${note.id}">
 
      <textarea class="note__text" name='note' data-id='${note.id}'>${note.note}</textarea>
      <button class=" btn btn-fav note__fav " data-id='${note.id}' data-fav='${note.favorite}'>
          
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-fav__icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>

      </button>
 
      <div class="note__bottom">
          <p class="note__date" name='date' >${note.date}</p>

         <div class='row'>
          <button class=" btn btn-edit btn-edit-${note.id}" data-id='${note.id}' data-active=${false}>
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-edit__icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>

          </button>

          <!-- select color -->
          <div class="color-box-row  box-${note.id}">
                
                <div class="color color-first  color-row ${note.noteColor === 'orange' ? '--active' : ''}" data-from="0" data-to="80" data-color="orange"  data-id='${note.id}'></div>
                <div class="color color-second other color-row ${note.noteColor === 'red' ? '--active' : ''}" data-from="100" data-to="120" data-color="red" data-id='${note.id}'></div>
                <div class="color color-third other color-row ${note.noteColor === 'purple' ? '--active' : ''}" data-from="140" data-to="160" data-color="purple" data-id='${note.id}'></div>
                <div class="color color-fourth other color-row ${note.noteColor === 'blue' ? '--active' : ''}" data-from="180" data-to="200" data-color="blue" data-id='${note.id}'></div>
                <div class="color color-fifth  other color-row ${note.noteColor === 'green' ? '--active' : ''}" data-from="220" data-to="240" data-color="green" data-id='${note.id}'></div>
                <div class="remove-btn color color-row other" data-from="260" data-to="280" data-id='${note.id}' data-action="remove">
                  
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-edit__icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                
                </div>
          </div>
         </div>
      </div>

  </div>

  `;
};

//  generate bookmark
const generateMarkupBookMark = function (bookmark) {
  return `

    <li  class="modal-item  modal-item--${bookmark.noteColor}" data-id=${bookmark.id} data-active='no-active' >
     
          <p class="modal-item__date modal-item__date--${bookmark.noteColor}">${bookmark.date}</p>
          <button class="modal-item__fav " data-id='${bookmark.id}'
              data-fav='${bookmark.favorite}'>
              <svg class="btn-fav__icon">
                  <use xlink:href="./img/sprite.svg#icon-star"></use>
              </svg>
          </button>
    
      <p class="modal-item__info">
          
        ${bookmark.note}
      </p>

    </li>
`;
};

// display animated edit button
const displayAnimatedEditButton = function (ev, id) {
  let ActiveBtnEditNote = ev.target.dataset?.active;
  let isActiveBtnEditNote = ActiveBtnEditNote == 'false';

  animateBtnEdit(isActiveBtnEditNote, id);
  ev.target.setAttribute('data-active', isActiveBtnEditNote);

};

// update note

const updateNote = function (notesFinded, txt, renderStatus) {

  notesFinded.note = txt ?? notesFinded.note;
  notesFinded.date = moment().format('LLL');



  renderNote(noteArr, renderStatus);
};


// save note in storage
const saveNote = function (notes) {
  localStorage.setItem('note', JSON.stringify(notes));
};

// get note from storage
const getNotes = function () {
  const note = localStorage.getItem('note');
  noteArr = note !== null ? JSON.parse(note) : [];
  renderNote(noteArr);
  renderBookmark(noteArr);
};


const removeNote = function (notes, id) {
  const index = notes.findIndex((item) => {
    return item.id === id;
  });
  if (index > -1) {
    notes.splice(index, 1);
  }
};

const displayMessage = function (parent, style, message) {
  const markup = `
      <div class="${style}">
      <div>
          <svg>
              <use xlink:href="../img/sprite.svg#icon-warning"></use>
          </svg>
      </div>
      <p>
          ${message}
      </p>
    </div>
  
  `;

  parent.innerHTML = '';
  parent.insertAdjacentHTML('afterbegin', markup);

};

// set favotie or remove from favorite list
const setFavoriteNote = function (ev, notesFinded) {
  notesFinded.favorite = !notesFinded.favorite;
  ev.target.setAttribute('data-fav', notesFinded.favorite);
  renderNote(noteArr);
  renderBookmark(noteArr);
  saveNote(noteArr);
};

const selectedBookmark = function (e, arrayNote) {
  const note = document.getElementById(`${arrayNote.id}`);
  const attr = e.target.getAttribute('data-active');
  if (attr == "active") note.classList.add('note--active');
  else note.classList.remove('note--active');
};

//////////////////////////////////
//////Event Listner

btnAddNote.addEventListener('click', function () {
  isActiveBtnAddNote = !isActiveBtnAddNote;
  animateBtnAdd(isActiveBtnAddNote);
});


selectColorContainer.addEventListener('click', function (e) {
  const selectColorBtn = e.target.closest('.color');

  if (!selectColorBtn) return;

  let color = e.target.dataset.color;
  //  push in array
  addNote(noteArr, color);

  // renderNote
  renderNote(noteArr);




  console.log(noteArr);
});

// change input update note
notesContainer.addEventListener('input', function (e) {

  const input = e.target.closest('.note__text');

  if (!input) return;
  const id = e.target.dataset.id;
  const noteEdit = findNote(noteArr, id);

  const noteData = e.target.value;

  //  update note

  updateNote(noteEdit, noteData, false);
  saveNote(noteArr);


});
// change input update note
notesContainer.addEventListener('click', function (e) {


  const btnEdit = e.target.closest('.btn-edit');
  const btnFavorite = e.target.closest('.btn-fav');
  const colorBox = e.target.closest('.color-box-row');
  const inputEdit = e.target.closest('.note__text');


  if (!btnEdit && !colorBox && !inputEdit && !btnFavorite) return;

  // get target id
  const id = e.target.dataset.id;
  // find current item by id
  const notesFinded = findNote(noteArr, id);

  // animated edit button
  if (e.target.classList.contains('btn-edit')) {
    displayAnimatedEditButton(e, id);
  }





  //update note color
  if (e.target.classList.contains('color-row')) {



    ///////////change color
    const color = e.target.dataset.color;
    notesFinded.noteColor = color == null ? notesFinded.noteColor : color;
    // change color
    e.target.closest('.note').className = `note note--${color}`;
    // remove class active from color btn
    document.querySelectorAll('.--active').forEach(activeBtn => activeBtn.classList.remove('--active'));

    e.target.closest('.color').classList.add('--active');
    renderNote(noteArr, false);
    renderBookmark(noteArr);
  }

  // remove note
  if (e.target.classList.contains('remove-btn') || e.target.dataset.action == 'remove') {
    e.target.closest('.note').remove();
    removeNote(noteArr, id);
    renderNote(noteArr);
  }



  // change btn favorite status 
  if (e.target.classList.contains('btn-fav')) {
    setFavoriteNote(e, notesFinded);
  }
  saveNote(noteArr);
});

searchInput.addEventListener('input', function (e) {
  filterNote.search = e.target.value;
  searchNote(noteArr, filterNote.search);
});

bookmarkList.addEventListener('click', function (e) {
  const bookmarkItem = e.target.closest('.modal-item');
  const bookmarkItemBtnFav = e.target.closest('.modal-item__fav');

  if (!bookmarkItem && !bookmarkItemBtnFav) return;

  // 1) get id element
  const id = e.target.dataset.id;

  // 2) find note 
  const findedItem = findNote(noteArr, id);

  //3) check favorite btn
  if (e.target.classList.contains('modal-item__fav')) {
    setFavoriteNote(e, findedItem);
  }
  //4) check bookmark item
  if (e.target.classList.contains('modal-item')) {
    // check is active bookmark item 
    const attributeBtn = e.target.getAttribute('data-active');
    let active = attributeBtn == 'active' ? 'no-active' : 'active';
    e.target.setAttribute('data-active', active);


  }




  //5) check active bookmark item if active search selected bookmark 


  selectedBookmark(e, findedItem);





});

document.addEventListener('DOMContentLoaded', function () {
  getNotes();
});

