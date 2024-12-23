/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/hero-slideshow/edit.js":
/*!************************************!*\
  !*** ./src/hero-slideshow/edit.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor.scss */ "./src/hero-slideshow/editor.scss");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */


/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


//my imports




/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

function Edit({
  attributes,
  setAttributes,
  isSelected
}) {
  //get the block props
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)();

  //get all the non-style related block props for the wrapper
  const wrapperProps = {
    ...blockProps
  };
  wrapperProps.className += ' jg_blocks-hero_slideshow';
  wrapperProps.style.height = attributes?.height || '32rem';

  //extract button styles
  const buttonBg = attributes?.style?.elements?.button?.color.background || '#000000';
  const buttonText = attributes?.style?.elements?.button?.color.text || '#ffffff';
  const buttonProps = {
    className: '',
    style: {
      background: buttonBg,
      color: buttonText
    }
  };

  //handle preset text color
  const textMatches = buttonText.match(/var:preset\|color\|([\w-]+)/);
  if (textMatches && textMatches.length > 0) {
    buttonProps.style.color = '';
    buttonProps.className += ' has-color';
    buttonProps.className += ' has-' + textMatches[1] + "-color";
  }

  //handle preset background color
  const bgMatches = buttonBg.match(/var:preset\|color\|([\w-]+)/);
  if (bgMatches && bgMatches.length > 0) {
    buttonProps.style.background = '';
    buttonProps.className += ' has-background';
    buttonProps.className += ' has-' + bgMatches[1] + "-background-color";
  }

  //create action button props
  const actionBtnProps = {
    ...buttonProps
  };
  actionBtnProps.className += ' jg_blocks-hero_slideshow_action_button';

  //create arrow button props
  const arrowBtnProps = {
    ...buttonProps
  };
  arrowBtnProps.className += ' jg_blocks-hero_slideshow_control';

  //state var for which slide is selected
  const [selectedSlide, setSelectedSlide] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(0);

  // function to handle the media selection
  const onSelectMedia = newMedia => {
    //determine if new images were added, or if an order edit or delete occurred
    //if the latter, the media array will contain the new order of slides
    //if the former, the media array will contain the new slides

    //check if new images were added
    const oldMediaIDs = attributes?.slides?.map(slide => slide.id);
    const newMediaIDs = newMedia.map(slide => slide.id);

    //if there is anything in newMediaIDs that is not in oldMediaIDs, then a CREATION of new slides occurred
    const newSlides = newMediaIDs.filter(id => !oldMediaIDs.includes(id));
    let newSlidesAttrValue = [];
    if (newSlides.length > 0) {
      console.log("new slides added: ", newSlides);

      //add the new slides to the existing slides
      //preserve the existing slides
      const slides = [...attributes?.slides];
      newMedia.map(media => {
        media = {
          id: media.id,
          url: media.url,
          alt: media.alt
        };
        slides.push(media);
      });

      //save the new slides to the attribute
      newSlidesAttrValue = slides;
    }
    //otherwise, either an ORDER EDIT or a DELETION of existing slides occurred
    else {
      //remove any slides that were deleted (slides in oldMediaIDs that are not in newMediaIDs)
      const nonDeletedSlides = attributes?.slides?.filter(slide => newMediaIDs.includes(slide.id));

      //order nondeleted slides based on the order of newMediaIDs
      const orderedSlides = newMediaIDs.map(id => nonDeletedSlides.find(slide => slide.id == id));

      //apply the captions from the selector to the caption field of the slides
      orderedSlides.map((slide, index) => {
        if (newMedia[index].caption) {
          if (!slide?.content) {
            slide.content = {};
          }
          console.log(newMedia[index]);
          slide.content.caption = newMedia[index]?.caption;
        }
      });

      //save the ordered slides to the attribute
      newSlidesAttrValue = orderedSlides;
    }

    //update the slides attribute
    setAttributes({
      slides: newSlidesAttrValue
    });
  };

  //track the last slide change button clicked
  const [lastSlideChange, setLastSlideChange] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  function nextSlide() {
    setLastSlideChange('next');
    setSelectedSlide(selectedSlide + 1 < attributes?.slides.length ? selectedSlide + 1 : 0);
  }
  function prevSlide() {
    setLastSlideChange('prev');
    setSelectedSlide(selectedSlide - 1 >= 0 ? selectedSlide - 1 : attributes?.slides.length - 1);
  }

  //generate an id string for the instance of the block
  const blockID = blockProps.id;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "jg_blocks-inspector_inputs",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "jg_blocks-inspector_input_group",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("label", {
              htmlFor: "jg_blocks-hero_slideshow_images_" + blockID,
              children: "Select Slide Images"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
                id: "jg_blocks-hero_slideshow_images_" + blockID,
                onSelect: onSelectMedia,
                allowedTypes: ['image'],
                value: attributes?.slides ? attributes?.slides.map(slide => slide.id) : [],
                multiple: true,
                gallery: true,
                render: ({
                  open
                }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
                  onClick: open,
                  children: "Open Selector"
                })
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "jg_blocks-inspector_input_group",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("label", {
              htmlFor: "jg_blocks-hero_slideshow_height_" + blockID,
              children: "Height"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("small", {
              children: "Note: will not exceed view height."
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
              id: "jg_blocks-hero_slideshow_height_" + blockID,
              type: "range",
              min: 24,
              max: 256,
              value: attributes?.height.slice(0, -3) || 32,
              onChange: event => {
                setAttributes({
                  height: event.target.value.toString() + "rem"
                });
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
              style: {
                textAlign: "center"
              },
              children: attributes?.height.toString() || "32rem"
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "jg_blocks-inspector_input_group",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("label", {
              htmlFor: "jg_blocks-hero_slideshow_autoplay_interval_" + blockID,
              children: "Autoplay Interval"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
              style: {
                display: "flex",
                alignItems: "center"
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
                id: "jg_blocks-hero_slideshow_autoplay_interval_" + blockID,
                type: "number",
                min: 0,
                max: 60,
                value: attributes?.autoPlay / 1000 || 5,
                onChange: event => {
                  setAttributes({
                    autoPlay: event.target.value * 1000
                  });
                },
                style: {
                  marginRight: "0.5rem"
                }
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                children: "seconds"
              })]
            })]
          })]
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      ...wrapperProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "jg_blocks-hero_slideshow_controls",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          ...arrowBtnProps,
          onClick: () => {
            prevSlide();
          },
          children: "\u2190"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("span", {
          style: {
            display: "none"
          },
          children: [selectedSlide + 1, " / ", attributes?.slides?.length]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          ...arrowBtnProps,
          onClick: () => {
            nextSlide();
          },
          children: "\u2192"
        })]
      }), attributes?.slides && attributes?.slides?.length > 0 ? attributes?.slides.map((slide, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: `jg_blocks-hero_slideshow_slide ${selectedSlide == index ? 'jg_blocks-hero_slideshow_selected_slide ' + (lastSlideChange == 'prev' ? 'jg_blocks-hero_slideshow_slide_left' : 'jg_blocks-hero_slideshow_slide_right') : 'jg_blocks-hidden'}`,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("img", {
          className: "jg_blocks-hero_slideshow_image",
          src: slide.url,
          alt: slide.alt
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "jg_blocks-hero_slideshow_slide_content",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
            tagName: "p",
            className: "jg_blocks-hero_slideshow_text",
            value: slide?.content?.caption || "",
            onChange: value => {
              const newSlides = [...attributes.slides];
              if (!newSlides[selectedSlide].content) {
                newSlides[selectedSlide].content = {};
              }
              newSlides[selectedSlide].content.caption = value;
              setAttributes({
                slides: newSlides
              });
            },
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Put a descriptive slide caption here.", "hero-slideshow")
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%"
            },
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
              ...actionBtnProps,
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
                tagName: "p",
                className: "jg_blocks-hero_slideshow_button_text",
                value: slide?.content?.buttonText,
                onChange: value => {
                  const newSlides = [...attributes.slides];
                  if (!newSlides[selectedSlide].content) {
                    newSlides[selectedSlide].content = {};
                  }
                  newSlides[selectedSlide].content.buttonText = value;
                  setAttributes({
                    slides: newSlides
                  });
                },
                placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Put a button caption here.", "hero-slideshow-button")
              })
            })
          })]
        })]
      }, index)) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        style: {
          display: "flex",
          justifyContent: 'center',
          alignItems: 'center',
          height: "100%",
          width: "100%"
        },
        children: "Add Images to the Slide Show"
      })]
    })]
  });
}

/***/ }),

/***/ "./src/hero-slideshow/index.js":
/*!*************************************!*\
  !*** ./src/hero-slideshow/index.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/hero-slideshow/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/hero-slideshow/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/hero-slideshow/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/hero-slideshow/block.json");
/* harmony import */ var _jg_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../jg.png */ "./jg.png");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Internal dependencies
 */





/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
    src: _jg_png__WEBPACK_IMPORTED_MODULE_5__,
    alt: "JG Web Development",
    style: {
      width: '24px',
      height: '24px'
    }
  }),
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  /**
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ }),

/***/ "./src/hero-slideshow/save.js":
/*!************************************!*\
  !*** ./src/hero-slideshow/save.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */


/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */

function save({
  attributes
}) {
  //get the block props
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save();

  //get all the non-style related block props for the wrapper
  const wrapperProps = {
    ...blockProps
  };
  wrapperProps.className += ' jg_blocks-hero_slideshow';
  wrapperProps.style.height = attributes?.height || '32rem';

  //extract button styles
  const buttonBg = attributes?.style?.elements?.button?.color.background || '#000000';
  const buttonText = attributes?.style?.elements?.button?.color.text || '#ffffff';
  const buttonProps = {
    className: '',
    style: {
      background: buttonBg,
      color: buttonText
    }
  };

  //handle preset text color
  const textMatches = buttonText.match(/var:preset\|color\|([\w-]+)/);
  if (textMatches && textMatches.length > 0) {
    buttonProps.style.color = '';
    buttonProps.className += ' has-color';
    buttonProps.className += ' has-' + textMatches[1] + "-color";
  }

  //handle preset background color
  const bgMatches = buttonBg.match(/var:preset\|color\|([\w-]+)/);
  if (bgMatches && bgMatches.length > 0) {
    buttonProps.style.background = '';
    buttonProps.className += ' has-background';
    buttonProps.className += ' has-' + bgMatches[1] + "-background-color";
  }

  //create action button props
  const actionBtnProps = {
    ...buttonProps
  };
  actionBtnProps.className += ' jg_blocks-hero_slideshow_action_button';

  //create arrow button props
  const arrowBtnProps = {
    ...buttonProps
  };
  arrowBtnProps.className += ' jg_blocks-hero_slideshow_control';

  //generate an id string for the instance of the block
  const blockID = blockProps.id;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      ...wrapperProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "jg_blocks-hero_slideshow_controls",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          ...arrowBtnProps,
          onClick: () => {
            //go to previous slide
          },
          children: "\u2190"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          ...arrowBtnProps,
          onClick: () => {
            //go to next slide
          },
          children: "\u2192"
        })]
      }), attributes?.slides && attributes?.slides?.length > 0 ? attributes?.slides.map((slide, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: `jg_blocks-hero_slideshow_slide`,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
          className: "jg_blocks-hero_slideshow_image",
          src: slide.url,
          alt: slide.alt
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "jg_blocks-hero_slideshow_slide_content",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
            tagName: "p",
            className: "jg_blocks-hero_slideshow_text",
            children: slide?.content?.caption || "Put a descriptive slide caption here."
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%"
            },
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
              ...actionBtnProps,
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
                className: "jg_blocks-hero_slideshow_button_text",
                children: slide?.content?.buttonText || "Go!"
              })
            })
          })]
        })]
      }, index)) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
        children: "Add Images to the Slide Show"
      })]
    })
  });
}

/***/ }),

/***/ "./src/hero-slideshow/editor.scss":
/*!****************************************!*\
  !*** ./src/hero-slideshow/editor.scss ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/hero-slideshow/style.scss":
/*!***************************************!*\
  !*** ./src/hero-slideshow/style.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./jg.png":
/*!****************!*\
  !*** ./jg.png ***!
  \****************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/jg.e85efa25.png";

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./src/hero-slideshow/block.json":
/*!***************************************!*\
  !*** ./src/hero-slideshow/block.json ***!
  \***************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jg-blocks/hero-slideshow","version":"0.1.0","title":"Hero Slideshow","keywords":["hero","slideshow","banner","slide","carousel","image","gallery"],"category":"widgets","icon":{"src":"../../jg.png"},"description":"A slideshow to serve as the hero banner element for a site..","example":{},"attributes":{"slides":{"type":"array","default":[],"items":{"type":"object","properties":{"id":{"type":"number","default":""},"url":{"type":"string","default":""},"alt":{"type":"string","default":""},"content":{"type":"object","properties":{"caption":{"type":"string","default":""},"buttonText":{"type":"string","default":""}}}}}},"height":{"type":"string","default":"32rem"},"autoPlay":{"type":"number","default":5000},"textColor":{"type":"string","default":"#ffffff"},"fontSize":{"type":"string","default":"x-large"},"style":{"type":"object","default":{"elements":{"button":{"color":{"text":"#ffffff","background":"#000000"}}}}}},"supports":{"html":false,"color":{"text":true,"background":false,"button":true},"typography":{"fontSize":true},"interactivity":true},"textdomain":"jg-blocks","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScriptModule":"file:./view.js","render":"file:./render.php"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"hero-slideshow/index": 0,
/******/ 			"hero-slideshow/style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkjg_blocks"] = self["webpackChunkjg_blocks"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["hero-slideshow/style-index"], () => (__webpack_require__("./src/hero-slideshow/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map