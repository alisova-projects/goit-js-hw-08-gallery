import galleryItems from "./data/gallery-items.js";

const refs = {
  galleryContainer: document.querySelector("ul.js-gallery"),
  backdrop: document.querySelector(".lightbox"),
  backdropOverlay: document.querySelector(".lightbox__overlay"),
  backdropContent: document.querySelector(".lightbox__content"),
  closeModalBtn: document.querySelector(
    ".lightbox button[data-action='close-lightbox']"
  ),
  imgInModal: document.querySelector("img.lightbox__image"),
  galleryItem: document.querySelector(".gallery__item"),
  galleryImage: document.querySelector(".gallery__image"),
};

// создаём разметку галлереи
function createGalleryItemsMarkup(images) {
  return images
    .map(({ preview, original, description }) => {
      return `
        <li class="gallery__item">
            <a
                class="gallery__link"
                href="${original}"
            >
                <img
                class="gallery__image"
                src="${preview}"
                data-source="${original}"
                alt="${description}"
                />
            </a>
        </li>
`;
    })
    .join("");
}

const galleryItemMarkup = createGalleryItemsMarkup(galleryItems);

refs.galleryContainer.insertAdjacentHTML("beforeend", galleryItemMarkup);

//вешаем слушателя событий
refs.galleryContainer.addEventListener("click", onImageClick);

function onImageClick(evt) {
  evt.preventDefault();

  const target = evt.target;
  const parentItem = target.closest(".gallery__item");

  // проверяем, чтобы клик был точно по изображению
  const isImage = target.classList.contains("gallery__image");
  if (!isImage) {
    return;
  }
  // добавляем класс открытия модалки
  refs.backdrop.classList.add("is-open");

  // устанавливаем новый src элемента img.lightbox__image
  changeModalImgSourse(target);

  // вешаем слушатели клавиатуры
  addKeyListeners();

  // вешаем активный класс на картинку, кот. открывается в модалке
  parentItem.classList.add("lightbox__image");
}

function changeModalImgSourse(elem) {
  refs.imgInModal.src = elem.dataset.source;
}

function addKeyListeners() {
  window.addEventListener("keydown", onEscKeyPress);
  window.addEventListener("keydown", onRightArrowPress);
  window.addEventListener("keydown", onLeftArrowPress);
}

// зыкрытие модалки
refs.closeModalBtn.addEventListener("click", onCloseModal);

function onCloseModal(event) {
  refs.backdrop.classList.remove("is-open");
  refs.imgInModal.src = "";

  refs.galleryContainer
    .querySelectorAll("gallery__item")
    .forEach((el) => el.classList.remove("lightbox__image"));

  removeKeyListeners();
}

function removeKeyListeners() {
  window.removeEventListener("keydown", onEscKeyPress);
  window.removeEventListener("keydown", onRightArrowPress);
  window.removeEventListener("keydown", onLeftArrowPress);
}

// закрытие модалки по клику на оверлей
refs.backdropOverlay.addEventListener("click", onBackdropClick);

function onBackdropClick(event) {
  if (event.target !== refs.imgInModal) {
    onCloseModal();
  }
}

// закрытие модалки по нажатию клавиши ESC
function onEscKeyPress(event) {
  const ESC_KEY_CODE = "Escape";
  const isEsc = ESC_KEY_CODE === event.code;

  if (isEsc) {
    onCloseModal();
  }
}

// ------------------------------------------------------
function onRightArrowPress(event) {
  const RIGHT_ARROW_KEY_CODE = "ArrowRight";

  if (event.code === RIGHT_ARROW_KEY_CODE) {
    const currentItem = document.querySelector(".lightbox__image");

    if (currentItem === refs.galleryContainer.lastElementChild) {
      return;
    }

    const nextItem = currentItem.nextElementSibling;

    changeImage(currentItem, nextItem);
  }
}

function onLeftArrowPress(event) {
  const LEFT_ARROW_KEY_CODE = "ArrowLeft";

  if (event.code === LEFT_ARROW_KEY_CODE) {
    const currentItem = document.querySelector(".lightbox__image");

    if (currentItem === refs.galleryContainer.firstElementChild) {
      return;
    }

    const nextItem = currentItem.previousElementSibling;

    changeImage(currentItem, nextItem);
  }
}

function changeImage(currentActiveItem, nextActiveItem) {
  const nextImg = nextActiveItem.querySelector(".gallery__image");

  changeModalImgSourse(nextImg);

  currentActiveItem.classList.remove("lightbox__image");
  nextActiveItem.classList.add("lightbox__image");
}
