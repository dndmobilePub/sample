var COMPONENT_UI = (function (cp, $) {

    /* 브라우저 & 디바이스버전 체크 */
    cp.uaCheck = {
        init: function() {
            this.addChkClass();
        },
        browserCheck: function() {
            var user = window.navigator.userAgent.toLowerCase();
            var isIE = user.indexOf("trident") > -1 || user.indexOf("msie") > -1;
            
            if (isIE) {
                var ieVersion = this.getIEVersion();
                var browser = "ie";
                
                if (ieVersion > 0 && ieVersion <= 8) {
                    browser += " ie" + ieVersion;
                }
            } else {
                var browser = user.indexOf("edge") > -1 ? "edge"
                              : user.indexOf("edg/") > -1 ? "edge(chromium based)"
                              : user.indexOf("opr") > -1 ? "opera"
                              : user.indexOf("chrome") > -1 ? "chrome"
                              : user.indexOf("firefox") > -1 ? "firefox"
                              : user.indexOf("safari") > -1 ? "safari"
                              : user.indexOf("whale") > -1 ? "whale"
                              : "other_browser";
            }
  
            return browser;
        },
        getIEVersion: function() {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");
            if (msie > 0) {
                // IE 10 or older
                return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
            }
  
            var trident = ua.indexOf("Trident/");
            if (trident > 0) {
                // IE 11
                var rv = ua.indexOf("rv:");
                return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
            }
  
            var edge = ua.indexOf("Edge/");
            if (edge > 0) {
                // Edge (Chromium-based)
                return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
            }
  
            // Not IE or IE version >= 11
            return -1;
        },
        mobileCheck: function() {
            var user = navigator.userAgent;
            var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (mobile) {
                mobile = user.match(/lg/i) != null ? "lg"
                        : user.match(/iphone|ipad|ipod/i) != null ? "ios"
                        : user.match(/android/i) != null ? "aos"
                        : "other_mobile";
  
                // aos인 경우 버전 체크
                if (mobile === "aos") {
                    var version = this.getAOSVersion();
                    if (version > 0 && version <= 7) {
                        mobile += "_old"; // aos_old 클래스 추가
                    }
                }
            } else {
                mobile = this.browserCheck();
            }
  
            return mobile;
        },
        getAOSVersion: function() {
            var ua = navigator.userAgent;
            var match = ua.match(/Android\s([0-9]+)/);
            return match ? parseInt(match[1], 10) : -1;
        },
        addChkClass: function() {
            var browser = this.browserCheck();
            var device = this.mobileCheck();
            
            $('html').addClass(browser).addClass(device);
        },
    },
    /* table caption */
    cp.tblCaption = {
        constEl: {},
          
          init: function() {
              this.tblSetting();
              this.tblCellsUpdate();
          },
          tblSetting:function() {
              $('table').each(function() {
                  $(this).removeAttr('summary');
  
                  var hasHeader = $(this).find('th').length > 0;
                  if (!hasHeader) {
                      $(this).find('caption').remove();
                  } else {
                      cp.tblCaption.tblCaption.call(this);
                  }
              });
          },
          tblCellsUpdate: function () {
              var theadCells = $('thead th');
              var tbodyCells = $('tbody th, tfoot th');
              var tdCells = $('tbody td, tfoot td');
      
              function updateCells(cells, scopeType) {
                  cells.each(function () {
      
                      $(this).removeAttr('scope');
      
                      if ($(this).is('th:not([scope])')) {
                          $(this).attr('scope', scopeType);
                      }
                      var colSpanGroup = $(this).attr('colspan');
                      if (colSpanGroup !== undefined && colSpanGroup > 1) {
                          $(this).attr('scope', 'colgroup');
                      }
                      var rowSpanGroup = $(this).attr('rowspan');
                      if (rowSpanGroup !== undefined && rowSpanGroup > 1) {
                          $(this).attr('scope', 'rowgroup');
                      }
                  });
              }
              // 셀에 대해 스코프 갱신
              updateCells(theadCells, 'col');
              updateCells(tbodyCells, 'row');
              updateCells(tdCells, '');
          },
      
          tblCaption: function() {
              var captionType = $(this).data('caption');
              var tblCaption = $(this).find('caption');
  
              if (tblCaption.hasClass("caption") && captionType !== "innerTbl") {
                  return;
              }
      
              if (captionType === 'basic') {
                  // basic 타입인 경우
                  tblCaption.remove();
      
                  $(this).find('th').each(function() {
                      var thHTML = $(this).html();
                      $(this).replaceWith('<td>' + thHTML + '</td>');
                  });
              } else if (captionType === 'keep') {
                  // keep 타입인 경우 기존 caption 정보를 유지함
              } else {
                  cp.tblCaption.tblReset.call(this);
              }
          },
      
          tblReset: function() {
              var tblCaption = $(this).find('caption');
              var currentCaptionTit = $(this).data('tbl') || tblCaption.text().trim();
              var tblColgroup = $(this).find('colgroup');
              var captionText = $(this).find('> thead > tr > th, > tbody > tr > th').map(function() {
                  return $(this).text();
              }).get().join(', ');
  
              tblCaption.remove();
      
              if (tblColgroup.length > 0) {
                  var captionHtml = cp.tblCaption.getCaptionHtml(currentCaptionTit, captionText);
                  tblColgroup.before(captionHtml);
              } else {
                  cp.tblCaption.insertCaption.call(this, tblCaption, cp.tblCaption.getCaptionHtml(currentCaptionTit, captionText));
              }
          },
      
          insertCaption: function(tblCaption, captionHtml) {
              var tableThead = $(this).find('thead');
              var tableTbody = $(this).find('tbody');
      
              if (tableThead.length > 0) {
                  tableThead.before(captionHtml);
              } else {
                  tableTbody.before(captionHtml);
              }
          },
      
          getCaptionHtml: function(title, text) {
              return '<caption class="caption"><strong>' + title + '</strong><p>' + text + ' 로 구성된 표' + '</p></caption>';
          },
    },
    /* form UI */
    cp.form = {
        constEl: {
            inputDiv: $("._input"),
            inputSelector: "._input > input:not([type='radio']):not([type='checkbox']):not(.exp input)",
            clearSelector: "._input-clear",
            clearBtnEl: $('<button type="button" class="field-btn _input-clear _active"><span class="hide">입력값삭제</span></button>'),
            labelDiv: $("._label")
        },
        
        init: function() {
            this.input();
            // this.inputSetting();
            this.inpClearBtn();
            this.secureTxt();
            this.inpReadonly();
            this.lbPlaceHolder();
        },

        inputSetting:function(){
            const inputSelector = this.constEl.inputSelector
            $(inputSelector).each(function() {
                const inputId = $(this).attr('id'),
                    parentInput = $(this).closest('._input'),
                    labelElOut = parentInput.parent().siblings("label"),
                    labelElIn = parentInput.siblings("label");
                // var labelElement = $('label[for="' + inputId + '"]');
                var placeholderValue = $(this).attr('placeholder');

                parentInput.attr('data-target', inputId);                
                
                labelElOut.attr({'for': inputId, 'data-name': inputId});
            
                // Set the title attribute to the placeholder value
                $(this).attr('title', placeholderValue);
            });
        },

        // _label 붙은 input타입 스크립트
        lbPlaceHolder: function() {
            const labelDiv = this.constEl.labelDiv.find(".field-label");
        
            $(labelDiv).each(function() {
                const $fieldLabel = $(this),
                    $fieldBox = $fieldLabel.parent().find(".field-outline"),
                    $labelTxt = $fieldLabel.text(),
                    $fieldInputs = $fieldBox.find("input"),
                    inputCount = $fieldInputs.length,
                    inputId = $fieldBox.find("._input:first-child > input").attr('id'),
                    $newFieldLabel = $('<label class="field-label" for="' + inputId +'" data-name="' + inputId +'">' + $labelTxt + '</label>'); 
        
                $fieldLabel.remove();
                $fieldBox.prepend($newFieldLabel);
                

                //input 오류 사항 체크
                function applyInputConditions() {
                    const hasInvalidInput = $fieldInputs.toArray().some(input => $(input).val() === ""); //한개 이상 비었음
                    if (hasInvalidInput) {//비었으면 실행
                    }else { //비어있지 않으면 실행
                        $fieldBox.removeClass('_inputLen');
                    }
                    if (!$fieldInputs.toArray().some(input => $(input).val() !== "")) {//모두 비어있으면 실행
                        $newFieldLabel.removeClass('_is-active'); 
                        
                    }
                }
                
                // label 클릭 이벤트
                $newFieldLabel.on("click", function () {
                    $(this).addClass('_is-active');
                    if (inputCount > 1) {
                        $fieldInputs.not(":first").prop("readonly", true);
                        $fieldBox.addClass('_inputLen');
            
                        $fieldInputs.first().on('input', function() {
                            $fieldInputs.not(":first").prop("readonly", false);
                        });
            
                        $fieldInputs.not(":first").on('input', function() {
                            const currentIndex = $fieldInputs.index(this);
                            if (currentIndex < inputCount - 1) {
                                $fieldInputs.eq(currentIndex + 1).prop("readonly", false);
                            }
                        });
            
                        if ($fieldBox.hasClass('_inputLen')) {
                            $fieldInputs.on('blur', applyInputConditions);
                        }
                    }
                });
        
                // input blur 이벤트
                $fieldInputs.on('blur', function () {
                    applyInputConditions();
                });
            });
        },

        /* lbPlaceHolder: function() {
            const labelDiv = this.constEl.labelDiv.find(".field-label");
        
            $(labelDiv).each(function() {
                const $fieldLabel = $(this),
                    $fieldBox = $fieldLabel.parent().find(".field-outline"),
                    $labelTxt = $fieldLabel.text(),
                    $fieldInput = $fieldBox.find("input"),
                    inputId = $fieldBox.find("._input:first-child > input").attr('id'),
                    $newFieldLabel = $('<label class="field-label" for="' + inputId +'" data-name="' + inputId +'">' + $labelTxt + '</label>'); 

                $fieldLabel.remove();
                $fieldBox.prepend($newFieldLabel);
        
                // .field-label 클릭 이벤트 처리
                $newFieldLabel.on('click', function () {
                    $(this).addClass('_is-active');
                });
                $fieldInput.on('blur', function () {
                    const inputVal = $fieldInput.val(),
                        inputValLength = inputVal.length,
                        inputLength = $fieldInput.parent("._input").length;
                    
                    // if(inputLength === 1) {

                    // }
                    // if(!inputVal) {
                    //     $(this).parent().siblings("label").removeClass('_is-active');
                    // }
                    
                });
            
            });
        }, */
        
        
        
        /* lbPlaceHolder: function () {
            const labelDiv = this.constEl.labelDiv;
            $(labelDiv).each(function () {
                const $placeHolder = $(this),
                $fieldLabel = $placeHolder.find(".field-label"),
                $fieldBox = $placeHolder.find(".field-outline"),
                $labelTxt = $fieldLabel.text();

                $fieldLabel.remove();
                $fieldBox.prepend('<label class="field-label">' + $labelTxt + '</label>');

                // $fieldBox
                // .on("keyup focus click", function () {
                //     $(this).find(".field-label").addClass("_is-active");
                // })
                // .on("blur focusout", function () {
                //     let inputField = $placeHolder.find("input"),
                //         value = inputField.val();
                        
                //     if(value > 0) {
                //     } else {
                //         $(this).find(".field-label").removeClass("_is-active");
                //     }
                // });

                // .field-label 클릭 이벤트 처리
                $fieldLabel.on('click', function () {
                    $(this).addClass('_is-active');
                });

                // .field-outline input 초점 이벤트 처리
                $fieldBox.find('input')
                .on('focus', function () {
                    $fieldLabel.addClass('_is-active');
                })

                // .field-outline input 값 변화 이벤트 처리
                .on('input', function () {
                    if ($(this).val().trim() === '') {
                        $fieldLabel.removeClass('_is-active');
                    } else {
                        $fieldLabel.addClass('_is-active');
                    }
                });
            });
        }, */
    

        // input Btn Clear
        input: function () {
            const inputSelector = this.constEl.inputSelector,
                clearSelector = this.constEl.clearSelector,
                clearBtnEl = this.constEl.clearBtnEl;

            $(inputSelector).each(function () {
                const $inputTxt = $(this);

                if ($inputTxt.prop("readonly") || $inputTxt.prop("disabled")) {
                    return;
                }

                function activateClearBtn() {
                    const $clearBtn = $inputTxt.parent().find(clearSelector);
                
                    if ($inputTxt.val()) {
                        $clearBtn.addClass("_active");
                        if (!$inputTxt.parent().find(clearSelector + "._active").length) {
                            $inputTxt.css({width:"calc(100% - 2.5rem)"}).parent().append(clearBtnEl);
                        }
                    } else {
                        $clearBtn.removeClass("_active");
                        $inputTxt.css({width:""}).parent().find(clearSelector).remove();
                    }
                }
                

                $inputTxt
                .on("keyup focus input", function () {
                    activateClearBtn();
                })
                .on("blur", function () {
                    setTimeout(function() {
                        $inputTxt.css({width:""}).parent().find(clearSelector).remove();
                    }, 1000);
                });

                activateClearBtn();
            });
        },
        inpClearBtn: function () {
            const inputSelector = this.constEl.inputSelector,
                clearSelector = this.constEl.clearSelector;

            $(document).on("mousedown touchstart keydown", clearSelector + "._active", function (e) {
                if (e.type === "keydown" && e.which !== 13) return;
                e.preventDefault();
                var clearBtn = $(this),
                    inputTxt = clearBtn.siblings(inputSelector);
                inputTxt.css({width:"calc(100% - 2.4rem)"}).val('').focus();
                setTimeout(function() {
                    clearBtn.remove();
                    inputTxt.css({width:""});
                }, 1000);
            });

        },
        
        // 비밀번호 특수문자 모양
        secureTxt: function() {
            $('._secureTxt').each(function() {
                function handleInputFocus(event) {
                    var secureField = $(event.target).closest("._secureTxt");
                    var inputField = secureField.find("input");
                    secureField.find("i._line").css({ opacity: ".5" }).removeClass("_is-active");
                    var value = inputField.val();
                    var activeLines = secureField
                                    .find("i._line")
                                    .removeClass("_is-active")
                                    .css({ opacity: ".5" });

                    for (var i = 0; i < value.length && i < secureLine; i++) {
                        activeLines.eq(i).addClass("_is-active").css({ opacity: "" });
                    }
                }

                function handleInputChange(event) {
                    var secureField = $(event.target).closest("._secureTxt");
                    var inputField = secureField.find("input");
                    var value = inputField.val();
                    var activeLines = secureField.find("i._line").removeClass("_is-active").css({ opacity: ".5" });

                    for (var i = 0; i < value.length && i < secureLine; i++) {
                        activeLines.eq(i).addClass("_is-active").css({ opacity: "" });
                    }
                
                    if (secureField.hasClass("_num")) {
                        secureField.find("i._is-active, i._line")[value ? "hide" : "show"]();
                    }
                }
                
                function handleInputKeyUp(event) {
                    if (event.keyCode === 8) {
                        var secureField = $(event.target).closest("._secureTxt");
                        secureField.find("i._line").eq(event.target.value.length).removeClass("_is-active");
                    }
                }
                
                var secureLine = parseInt($(this).attr("data-secureLine"));
                var length = parseInt($(this).attr("data-length"));
                var secureField = $(this);
                var iTag = "";
                
                for (var i = 0; i < length; i++) {
                    iTag += '<i aria-hidden="true"></i>';
                }
                secureField.append(iTag);
                
                var left = 0;
                var space = 13;
                var inputField = secureField.find("input");
                
                secureField.find("i").each(function (index) {
                var $this = $(this);
                $this.width($this.height());
                $this.css("left", left + "px");
                
                if (index < secureLine) {
                    $this.addClass("_line");
                }
                
                left += space;
                space = 16;
                });
                
                if (secureField.hasClass("_num")) {
                    inputField.attr("type", "tel");
                }
                
                inputField.on("focus", handleInputFocus)
                    .on("input", handleInputChange)
                    .on("keyup", handleInputKeyUp)
                    .on("blur", function () {
                    if (!inputField.val()) {
                            secureField.find("i._line").css({ opacity: "" }).removeClass("_is-active");
                    }
                });
            });
        },
        
        // input:radio, input:checkbox readonly
        inpReadonly:function() {
            // radio, checkbox input 요소에 대한 이벤트 리스너를 등록합니다.
            $('input[type=radio], input[type=checkbox]').each(function() {
                // input 요소가 readonly 상태인지 확인합니다.
                if ($(this).prop('readonly')) {
                // input 요소의 기존 checked 상태를 저장합니다.
                var checked = $(this).prop('checked');
            
                // input 요소에 대한 click 이벤트를 등록합니다.
                $(this).on('click', function(event) {
                    // input 요소가 readonly 상태이면, 이벤트를 취소하고 기존 checked 상태를 유지합니다.
                    if ($(this).prop('readonly')) {
                    event.preventDefault();
                    $(this).prop('checked', checked);
                    }
                });
                }
            });

        }
    };
    /* modalPop UI */
    cp.modalPop = {
        constEl: {
            btnModal: "._modalBtn",
            dimmedEl: $('<div class="dimmed" aria-hidden="true"></div>')
        },
        init: function() {       

            this.openPop();
            this.closePop();
            this.toastPop();
        },
        
        openPop: function () {
            const self = this,
                btnModal = this.constEl.btnModal;
            $('body, html').on('click', btnModal, function() {
                $(this).addClass('_rtFocus');
                self.showModal($(this));
                self.layerFocusControl($(this));
            });
        },
        
        showModal: function ($btn) {
            const self = this,
                dimmedEl = this.constEl.dimmedEl;
            const target = $btn.attr('data-modal');
            const $modal = $('.modalPop[modal-target="' + target + '"]');
            var $modalWrap = $modal.find("> .modalWrap");
            var modalWrapClass = $modal.attr('class');
            var modalWidth = '';
            var modalHeight = '';

            modalWidth = $modal.outerWidth();              
            winHeight = $(window).height();
        
            if (modalWrapClass.indexOf('_top') !== -1) {

                $modal.addClass('_is-active');
                modalHeight = $modalWrap.outerHeight();

                $modalWrap.css({
                    'height': modalHeight + 'px',
                    'transition': 'opacity 250ms cubic-bezier(.86, 0, .07, 1)'
                });
                $modal.animate({
                    top: '0'
                }, 300).show();
            } else if (modalWrapClass.indexOf('_left') !== -1) {
                $modal.addClass('_is-active');

                modalTitHeight = $modalWrap.find(" > .modal-header").outerHeight();
                modalConHeight = $modalWrap.find(" > .modal-container").outerHeight();
                modalBtnHeight = $modalWrap.find(" > .modal-footer").outerHeight();

                modalConMaxHeight = winHeight - modalTitHeight - modalBtnHeight - 40                

                if (modalConHeight > winHeight) {
                    $modalWrap.css({
                        'height': 100 + 'vh',
                        'transition': 'opacity 250ms cubic-bezier(.86, 0, .07, 1)'
                    }).find('> .modal-container').css({
                        'height': modalConMaxHeight + 'px',
                    }).attr("tabindex","0");
                    $modal.addClass("_scroll").animate({
                        left: '0',
                    }, 300).show();
                } else {
                    $modal.animate({
                        left: '0',
                        height:'100%',
                    }, 300).show();
                }

                
            } else if (modalWrapClass.indexOf('_center') !== -1) {
                $modal.addClass('_is-active');

                modalHeight = $modalWrap.outerHeight();

                modalTitHeight = $modalWrap.find(" > .modal-header").outerHeight();
                modalConHeight = $modalWrap.find(" > .modal-container").outerHeight();
                modalBtnHeight = $modalWrap.find(" > .modal-footer").outerHeight();
                
                if (modalHeight > winHeight) {
                    $modal.addClass('_scroll').css({
                        'margin-left': -modalWidth/2 + 'px',
                        'margin-top': -(winHeight - 100)/2 + 'px',
                        'max-height':winHeight - 100 + 'px',
                        'height':''
                    }, 100).show();
                    $modalWrap
                    .css({
                        'max-height':winHeight - 100 + 'px',
                    })
                    .find(" > .modal-container").css({
                        'max-height':winHeight - (modalTitHeight + modalBtnHeight) - 160 + 'px'
                    }).attr("tabindex","0");
                } else {
                    $modal.css({
                        'margin-left': -modalWidth/2 + 'px',
                        'margin-top': -modalHeight/2 + 'px',
                        'height': modalHeight + 'px',
                    }, 100).show();
                }
                
            } else if (modalWrapClass.indexOf('_bottom') !== -1) {
                $modal.addClass('_is-active');
                modalHeight = $modalWrap.outerHeight();

                modalTitHeight = $modalWrap.find(" > .modal-header").outerHeight();
                modalConHeight = $modalWrap.find(" > .modal-container").outerHeight();
                modalBtnHeight = $modalWrap.find(" > .modal-footer").outerHeight();

                console.log(modalTitHeight, modalConHeight, modalBtnHeight);
                if (modalHeight > winHeight) {
                    $modal.addClass('_scroll').css({
                        'max-height':winHeight - 100 + 'px',
                        'height':''
                    })
                    .animate({
                        'bottom': '0',
                        'transition': 'opacity 250ms cubic-bezier(.86, 0, .07, 1)'
                    }, 300).show();
                    $modalWrap
                    .css({
                        'max-height':winHeight - 100 + 'px',
                    })
                    .find(" > .modal-container").css({
                        'max-height':winHeight - (modalTitHeight + modalBtnHeight) - 160 + 'px'
                    }).attr("tabindex","0");
                } else {
                    $modal.css({
                        'height': modalHeight + 'px',
                    })
                    .animate({
                        'bottom': '0',
                        'transition': 'opacity 250ms cubic-bezier(.86, 0, .07, 1)'
                    }, 300).show();
                }

            } 

            $modal.attr({'aria-hidden': 'false', 'tabindex':'0'}).focus();
            $modalWrap.attr({'role': 'dialog', 'aria-modal': 'true'})
                    .find('h1, h2, h3, h4, h5, h6').first().attr('tabindex', '0');
            $modalWrap.find('.goodsAddBtn[item-single="true"]').attr('data-modal', target);
            dimmedEl.remove(); 
            $('body').addClass('no-scroll').append(dimmedEl);            
        },
        
        closePop: function() {
            const self = this;
            $('.modalPop').on('click', '.btn-close-pop', function() {
                var $modal = $(this).closest('.modalPop');
                var $modalWrap = $modal.find("> .modalWrap");
                var modalWrapClass = $modal.attr('class');
                if (modalWrapClass.indexOf('_top') !== -1) {
                    $modal.animate({
                        top: '-100%'
                    }, 300, function() {
                        $modal.removeClass('_is-active').hide();
                    });
                } else if (modalWrapClass.indexOf('_left') !== -1) {
                    $modal.animate({
                        left: '-100%'
                    }, 300, function() {
                        $modal.removeClass('_is-active').hide();
                    });
                    $modalWrap
                    .css({
                        'max-height':'','height':'','transition':''
                    })
                    .find(" > .modal-container").css({
                        'height':''
                    }).removeAttr("tabindex");
                } else if (modalWrapClass.indexOf('_center') !== -1) {
                    $modal
                    .removeClass('is-active')
                    .css({
                        'height':'',
                        'max-height':''
                    })
                    .hide();
                    $modalWrap
                    .css({
                        'max-height':'',
                    })
                    .find(" > .modal-container").css({
                        'max-height':''
                    }).removeAttr("tabindex");
                } else if (modalWrapClass.indexOf('_bottom') !== -1) {
                    $modal.animate({
                        bottom: '-100%'
                    }, 300, function() {
                        $modal
                        .removeClass('_is-active')
                        .css({
                            'height':'',
                            'max-height':''
                        })
                        .hide();
                        $modalWrap
                        .css({
                            'max-height':'',
                        })
                        .find(" > .modal-container").css({
                            'max-height':''
                        }).removeAttr("tabindex");
                    });
                }
                
                self.rtFocus($(this));

                $modal.attr({'aria-hidden': 'true'}).removeAttr('tabindex').focus();
                $modalWrap.attr({'aria-modal': 'false'})
                    .find('h1, h2, h3, h4, h5, h6').first().removeAttr('tabindex');

                $('body').removeClass('no-scroll');
                $(this).closest('.modalPop').prev().focus();
                $('.dimmed').remove();
            });
        },
        
        // 접근성 포커스 반영
        layerFocusControl: function ($btn) {
            const target = $btn.attr('data-modal') || $btn.attr('data-select');
            const $modal = $('.modalPop[modal-target="' + target + '"], .modalPop[select-target="' + target + '"]');
            var $modalWrap = $modal.find("> .modalWrap");
            
            var $firstEl = $modalWrap.find('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])').first();
            var $lastEl = $modalWrap.find('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])').last();
            
            $modalWrap.on("keydown", function (e) {
                if (e.keyCode == 9) {
                if (e.shiftKey) { // shift + tab
                    if ($(e.target).is($firstEl)) {
                        $lastEl.focus();
                        e.preventDefault();
                        }
                    } else { // tab
                        if ($(e.target).is($lastEl)) {
                        $firstEl.focus();
                        e.preventDefault();
                        }
                    }
                }
            });
        },

        rtFocus: function(){
            $('._rtFocus').focus();
            setTimeout(function() {
                $('._rtFocus').removeClass('_rtFocus');
            }, 1000);
        },

        // toast pop
        toastPop: function() {
            const self = this;
            
            // 토스트 팝업 생성 함수
            function createToast(toastMsg) {
                const toastWrapTemplate = $('<div>', {
                'class': 'toastWrap',
                'role': 'alert',
                'aria-live': 'assertive',
                'tabindex': '0'
                }).append(
                    $('<div>', {'class': 'toast-msg'}).html(toastMsg),
                    $('<a>', {
                        'class': 'btn ico-close',
                        'href': '#',
                        'aria-label': 'Close'
                    }).attr("tabindex", "-1").append(
                        $('<span>', {'class': 'hide'}).text('토스트팝업닫기')
                    )
                );
            
                $('body').append(toastWrapTemplate);
            
                const toast = $('.toastWrap');
                const $icoClose = $('.ico-close');
                
                toast.on('keydown', function(event) {
                    toast.addClass('_is-keyEvent');                
                    $icoClose.addClass('_is-active').attr("tabindex", "0");
                    if (event.key === 'Escape') {
                        $icoClose.click();
                    } else if (event.key === 'Tab') {
                        event.preventDefault();
                        const focusableElements = toast.find('.ico-close._is-active, [tabindex]');
                        const $firstElement = focusableElements.first();
                        const $lastElement = focusableElements.last();
                        if (event.shiftKey) {
                            $lastElement.focus();
                        } else {
                            $firstElement.focus();
                        }
                    }
                });
                
                const closeClickHandler = function() {
                    toast.removeClass('_is-keyEvent');
                    
                    toast.fadeOut(function() {
                    if (toast.hasClass('toastWrap')) {
                        toast.remove();
                    }
                    $('._toastBtn._rtFocus').focus().removeClass('_rtFocus');
                    });
                };
                
                $icoClose.on('click', closeClickHandler);
                
                const focusableElements = toast.find('.ico-close._is-active, [tabindex]');
                focusableElements.first().focus();
                
                const timer = setTimeout(function() {
                    if (toast.hasClass('_is-keyEvent')) {
                        return;
                    }
                    closeClickHandler();
                }, 3000);
            }
            
            $('._toastBtn').on('click', function() {
                $('._toastBtn._rtFocus').removeClass('_rtFocus');
                $(this).addClass('_rtFocus');
            
                const toastMsg = $(this).attr('data-toast');
                createToast(toastMsg);
            });
        }
        
    };
    /* ToolTip */
    cp.toolTip = {
        constEl: {
            tooltip: '.tooltip',
            content: '.tooltip-content',
            message: '.tooltip-message',
            close: '.tooltip-close',
            icoTip: '.ico-tooltip',
            top: '_top',
            default: '_default',
            bottom: '_bottom',
            left: '_left',
            active: '_is-active',
            duration: '250ms',
            easing: 'cubic-bezier(.86, 0, .07, 1)',
            space: 10,
            padding: 32
        },
        init() {
            this.openTip();
            this.closeTip();
            this.toolIndex();
            $('[data-tooltip]').hover(this.showTip.bind(this), this.openTip.bind(this), this.closeTip.bind(this));
        },
        toolIndex() {
            $('[data-toggle="tooltip"]').each(function(index) {
                const num = index + 1;
                const tooltipId = "toolTip_" + num;
            
                // aria-describedby 속성 설정
                $(this).attr("aria-describedby", tooltipId);
            });
        },
        openTip: function() {
            const self = this;
            const $tooltipToggle = $('[data-toggle="tooltip"]');
            $tooltipToggle.click(function() {
                const $this = $(this);
                if (!$this.hasClass('_is-active')) {
                    $(".ico-tooltip._is-active").removeClass(cp.toolTip.constEl.active).focus();
                    self.showTip(event);
                    $this.addClass('_is-active');
                }
            });
        },
        closeTip() {
            const $tooltip = $(this.constEl.tooltip);
            if ($tooltip.length) {
                $(".ico-tooltip._is-active").removeClass(cp.toolTip.constEl.active).focus();
                $tooltip.removeClass('_is-active').remove();
            }
            return this;
        },
        
        focusControl: function () {
            const $tooltip = $(this.constEl.tooltip);
            
            const $firstEl = $tooltip.find('a, button, [tabindex]:not([tabindex="-1"])').first();
            const $lastEl = $tooltip.find('a, button, [tabindex]:not([tabindex="-1"])').last();
            
            $tooltip.on("keydown", function (e) {
                if (e.keyCode == 9) {
                if (e.shiftKey) { // shift + tab
                    if ($(e.target).is($firstEl)) {
                        $lastEl.focus();
                        e.preventDefault();
                        }
                    } else { // tab
                        if ($(e.target).is($lastEl)) {
                        $firstEl.focus();
                        e.preventDefault();
                        }
                    }
                }
            });
            
        },
        toolTipHtml(options) {
            const directionClass = this.constEl[options.direction];
            const messageHtml = options.message;
        
            //const tooltipId = $(this.constEl.tooltip).attr('aria-describedby');
            const tooltipId = options.ariaDescribedBy;
        
            return `
                <div id="${tooltipId}" class="tooltip ${directionClass}" tabindex="0" role="tooltip">
                    <div class="tooltip-content">
                        <p class="tooltip-message">${messageHtml}</p>
                        <a href="javascript:void(0);" onclick="COMPONENT_UI.toolTip.closeTip()" class="ico-tooltip-close"><span class="hide">툴팁닫기</span></a>
                    </div>
                </div>
            `;
        },
        
        showTip(event) {
            const self = this;
            const $this = $(event.currentTarget);
            const options = {
                body:"body, html",
                selector: $this,
                container: $this.parent(),
                direction: $this.data('direction'),
                message: $this.data('message'),
                ariaDescribedBy: $this.attr('aria-describedby')
            };
            
            const directionClass = this.constEl[options.direction];
            const tooltipWrap = this.constEl[options.container];
            $this.addClass(`${cp.toolTip.constEl.active} ${directionClass}`);            
            
            const $newTooltip = $(this.toolTipHtml(options));
            if ($(options.body).find('.tooltip').length) {
                this.closeTip();
            }
            $('body, html').append($newTooltip);
            self.focusControl($(this));
            setTimeout(function() {
                const winW = $(window).width();
                const winH = $(window).outerHeight();
                const tooltipWidth = $(options.body).find('.tooltip').outerWidth();
                const tooltipHeight = $(options.body).find('.tooltip').outerHeight();
                const elWidth = $this.outerWidth();
                const elHeight = $this.outerHeight();
                const elOffsetT = $this.offset().top;
                const elOffsetL = $this.offset().left;
                let thisTooltip = $(options.body).find('.tooltip');
  
                
                /* 230523 edit [s] */
                $this.parent().removeClass('reverse');
                if (options.direction === 'default') {//오른쪽에 노출
                    if( (elOffsetL + 20) >= (winW/3) ){
                        cp.toolTip.calcRight(tooltipWidth,tooltipHeight,winW,elOffsetT,elOffsetL,thisTooltip);
                    }else{
                        $newTooltip.css({
                            top: elOffsetT - ((tooltipHeight/2) - 10),
                            left: elOffsetL + 30
                        }); 
                    }
                } else if (options.direction === 'left') {//왼쪽에 노출,
                    if( (elOffsetL + 20) >= (winW/3)*2 ){
                        $newTooltip.css({
                            top: elOffsetT - ((tooltipHeight/2) - 10),
                            left: elOffsetL - (tooltipWidth + 10)
                        }); 
                    }else{
                        cp.toolTip.calcLeft(tooltipWidth,tooltipHeight,elOffsetL,elOffsetT,thisTooltip);
                    }
                } else if (options.direction === 'top') {//위에 노출
                    let thisH = thisTooltip.outerHeight();
                    let bottomPosT = elOffsetT - (thisH + 10);
                    let thisW = thisTooltip.outerWidth();
                    cp.toolTip.calcHorizontal(thisW,elWidth,winW,elOffsetL,thisTooltip,bottomPosT);
                    
                } else if (options.direction === 'bottom') {//아래 노출
                    let bottomPosT = elOffsetT + 30;
                    cp.toolTip.calcHorizontal(tooltipWidth,elWidth,winW,elOffsetL,thisTooltip,bottomPosT);
                    
                }
                // $newTooltip.css({
                //     top,left,right
                // });                
                $newTooltip.addClass(cp.toolTip.constEl.active).focus();
        
                //console.log(winW, elOffsetL, (winW - elOffsetL));
            }, 0);
            
        },
        calcRight(tooltipWidth,tooltipHeight,winW,elOffsetT,elOffsetL,newTooltip) {
            let $thisTooltip = newTooltip;
            if( (tooltipWidth+15) >= (winW-(elOffsetL+20)) ){
                $thisTooltip.css({
                    top: elOffsetT - ((tooltipHeight/2) - 10),
                    left: elOffsetL - (tooltipWidth + 10)
                }); 
                $(".ico-tooltip._is-active").addClass('reverse')
            }else{
                $thisTooltip.css({
                    top: elOffsetT - ((tooltipHeight/2) - 10),
                    left: elOffsetL + 30
                }); 
            }
        },
        calcLeft(tooltipWidth,tooltipHeight,elOffsetL,elOffsetT,thisTooltip) {
            let $thisTooltip = thisTooltip;
            if( (tooltipWidth+15) >= elOffsetL ){
                $thisTooltip.css({
                    top: elOffsetT - ((tooltipHeight/2) - 10),
                    left: elOffsetL + 30
                }); 
                $(".ico-tooltip._is-active").addClass('reverse')
            }else{
                $thisTooltip.css({
                    top: elOffsetT - ((tooltipHeight/2) - 10),
                    left: elOffsetL - (tooltipWidth + 10)
                }); 
            }
        },
        calcHorizontal(tooltipWidth,elWidth,winW,elOffsetL,thisTooltip,bottomPosT) {
            let $thisTooltip = thisTooltip,
                $tops = bottomPosT;
            if( (elOffsetL + 20) >= (winW/3)*2 ){
                console.log('right',winW,tooltipWidth)
                $thisTooltip.css({
                    top: $tops,
                    left: winW - tooltipWidth - 10
                });
            }else if( (elOffsetL + 20) <= (winW/3) ){
                console.log('left')
                $thisTooltip.css({
                    top: $tops,
                left: 10
                });
            }else{
                $thisTooltip.css({
                    top: $tops,
                    left: elOffsetL - (tooltipWidth / 2) + (elWidth/2)
                });
            }
        }
    };
    /* bottom select pop */
    cp.selectPop = {
        constEl: {
            btnSelect: "._selectBtn",
            dimmedEl: $('<div class="dimmed" aria-hidden="true"></div>')
        },
        init: function() {       
            this.openSelect();
            this.optSelect();
        },
    
        openSelect: function () {
            const self = this,
                btnSelect = this.constEl.btnSelect;                
            $('body, html').on('click', btnSelect, function() {
                const $btn = $(this);
                const target = $btn.attr('data-select');
                const $select = $('.modalPop[select-target="' + target + '"]');
                const $selectWrap = $select.find("> .modalWrap");
                
                const $activeOption = $select.find('.select-lst > li._is-active');
                if ($activeOption.length === 0) {
                    const btnText = $btn.text();
                    $select.find('.select-lst > li:eq(0)').before('<li class="_is-active"><a href="javascript:;" class="sel-opt _defaultTxt">' + btnText + '</a></li>');
                } else {
                    const btnText = $btn.text();
                    if ($activeOption.find('a').text() !== btnText) {
                        $activeOption.removeClass('_is-active');
                        const $newActiveOption = $select.find('.select-lst > li > a').filter(function() {
                            return $(this).text() === btnText;
                        }).parent();
                        $newActiveOption.addClass('_is-active');
                    } else {
                        $activeOption.addClass('_is-active');
                    }
                }
                
                
                $btn.addClass('_selectTxt _rtFocus');
                cp.modalPop.layerFocusControl($(this));
                self.showSelect($(this));
            });
        },
    
        showSelect: function ($btn) {
            const self = this,
                dimmedEl = this.constEl.dimmedEl;
            var target = $btn.attr('data-select');
            var $select = $('.modalPop[select-target="' + target + '"]');
            var $selectWrap = $select.find("> .modalWrap");
            var selectWidth = '';
            var selectHeight = '';
    
            $select.addClass('_is-active').show();
    
            selectWidth = $select.outerWidth();
            selectHeight = $selectWrap.outerHeight();                
            winHeight = $(window).height();
    
            selectTitHeight = $selectWrap.find(" > .modal-header").outerHeight();
            selectConHeight = $selectWrap.find(" > .modal-container").outerHeight();
            selectBtnHeight = $selectWrap.find(" > .modal-footer").outerHeight();
  
            if (selectHeight > winHeight) {
                $select
                .addClass('_scroll').css({
                    'max-height':winHeight - 100 + 'px',
                    'height':''
                })
                .animate({bottom: '0'}, 300).show();
                $selectWrap
                .css({'max-height':winHeight - 100 + 'px'})
                .find(" > .modal-container").css({'max-height':winHeight - (selectTitHeight + selectBtnHeight) - 160 + 'px'}).attr("tabindex","0");
            } else {
                $select
                .css({'height': selectHeight + 'px'})
                .animate({bottom: '0'}, 300).show();
            }
  
            $select.attr({'aria-hidden': 'false', 'tabindex':'0'}).focus();
            $selectWrap.attr({'role': 'dialog', 'aria-modal': 'true'})
                    .find('h1, h2, h3, h4, h5, h6').first().attr('tabindex', '0');
  
            dimmedEl.remove(); 
            $('body').addClass('no-scroll').append(dimmedEl);
  
            $btn.addClass('_selectTxt');
        },
    
        optSelect: function () {
            const self = this;
            $('.modalPop').on('click', '.select-lst > li > a.sel-opt', function () {
                $(this).parent('li').addClass('_is-active').siblings().removeClass('_is-active');
            });
            
            $('.modalPop').on('click', '.btn-selChoice', function () {
                $('.modalPop .btn-close-pop').trigger('click');
                const selectedOption = $('.select-lst > li._is-active > a.sel-opt');
                const selectedText = selectedOption.text();
                const selectTxtElement = $('._selectTxt');
                selectTxtElement.text(selectedText).removeClass('_selectTxt');
                selectedOption.addClass('sel-opt');
            });
        }
    },
    /* select box */
    cp.selectBox = {
        init: function() {       
            this.selectBoxshow();
        },

        selectBoxshow: function(){
            $('.field-select > .btn-select').click(function(event) {
                event.stopPropagation();
                var selectWidth = $(this).outerWidth();
                $('.field-select-list').removeClass('_is-active');
                $(this).next('.field-select-list').toggleClass('_is-active');
                $(this).next('.field-select-list').css('width', selectWidth + 'px');
            });
            $('.field-select-list li').each(function() {
                $(this).click(function(event) {
                    event.stopPropagation();
                    var selectedText = $(this).text();
                    $(this).closest('.field-select').find('button').text(selectedText);
                    $(this).parent('.field-select-list').removeClass('_is-active');
                });
            });
            $('body, html').click(function() {
                $('.field-select-list').removeClass('_is-active');
            });
        },
    },
    /* tab UI */
    cp.tab = {
        constEl: {
            tab: '.tab > a'
        },
        init() {
            this.tabSetting();
            this.tabClick();
            this.scrollEventHandler();
            this.addTab();
            this.delTab();
            this.tabUpdate();
        },
        tabSetting: function() {
            /**
             * 탭 초기 설정
             * @contentsIdx 클릭한 탭의 index와 같은 index의 content
             */
            const self = this;
            
            $('.tab-moving .tab-list-wrap').append($('<span class="highlight"></span>'));
            $('.tab-scroll .tab-contents').scrollTop();
    
            // 접근성
            $('.tab').children('a').attr('aria-selected', 'false');
            $('.tab._is-active').children('a').attr('aria-selected', 'true');
            $('.tab').attr('roll', 'tab');
            $('.tab-list').attr('roll', 'tablist');
            $('.tab-contents').attr('roll', 'tabpanel');
    
            $('body, html').ready(function() {
                $('.tab-wrap').each(function () {
                    var $tabWrap = $(this);
    
                    // id 부여
                    $tabWrap.find('.tab').each(function (index) {
                        var tabId = $tabWrap.attr('id') + '_' + 'tab' + (index + 1);
                        $(this).attr('aria-controls', tabId);
                    });
    
                    $tabWrap.find('.tab-contents').each(function (index) {
                        var panelId = $tabWrap.attr('id') + '_' + 'tab' + (index + 1);
                        $(this).attr('id', panelId);
                    });
    
                    // highlight 너비(높이) 부여
                    $tabWrap.find('.highlight').each(function () {
                        self.moveHighLight($tabWrap);
                    });
                })
            })
    
            // resize 체크
            let resizeTimeout;
            $(window).on('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function() {
                    $('.tab-wrap').each(function () {
                        var $tabWrap = $(this);
                        
                        // highlight 너비(높이) 부여
                        $tabWrap.find('.highlight').each(function () {
                            self.moveHighLight($tabWrap);
                        });
                    });
                }, 200);
            });
    
            let isTabClick; // 중복 호출 방지를 위한 플래그 변수
    
            // tabpanel 스크롤 이벤트 처리
            $('.tab-scroll .tab-contents-wrap').on('scroll', self.scrollEventHandler);
    
            self.tabSticky(isTabClick);
        },
        tabSel: function($this, $tabWrap) {
            /**
             * 가로/세로 탭 선택 함수
             * @this 클릭한 탭 버튼
             * @tabWrap 클릭한 탭의 wrapper
             * @next 가로/세로 형식으로 바뀌는 컨텐츠 wrapper
             * sel-h-v 클래스 있는 tab 메뉴에서 data-type에 따라 $next highlight 초기화
             */
    
            if ($tabWrap.hasClass('sel-h-v')) {
                const $next = $tabWrap.next('.tab-wrap'); //실제 tabWrap
                const $activeTab = $next.find('._is-active');
                const newHeight = $next.find('.tab').outerHeight();
                const newWidth = $next.find('.tab').outerWidth();
                const nextHighlight = $next.find('.highlight');
                const newTop = $activeTab.position().top;
    
                if ($this.attr('data-type') === 'vertical') { 
                    //탭메뉴 세로 버전일때
                    $next.addClass('tab-vertical').find('.tab-list').attr('aria-orientation', 'vertical');
                    
                    nextHighlight.css({ 
                        left: '', 
                        width: '', 
                        top: newTop + 'px', 
                        height: newHeight + 'px' 
                    });
                } else { 
                    //탭메뉴 가로 버전일때
                    $next.removeClass('tab-vertical').find('.tab-list').removeAttr('aria-orientation');
    
                    nextHighlight.css({ 
                        top: '', 
                        height: '', 
                        width: newWidth + 'px' 
                    });
                }
                
                /* 탭활성화 초기화 */
                $next.find('.tab, .tab-contents').removeClass('_is-active').eq(0).addClass('_is-active');
            } 
        },
        moveHighLight: function($tabWrap, $this, callback) {
            /**
             * 선택된 탭 highlight action 함수
             * @this 클릭한 탭 버튼
             * @tabWrap 클릭한 탭의 wrapper
             * tab-moving 클래스 있는 tab 메뉴에서 tab-vertical 클래스에 따라 highlight 스타일 변화
             */
    
            if ($tabWrap.hasClass('tab-moving') && $tabWrap.hasClass('tab-vertical')) { 
                // 세로 버전일때
                $this = $tabWrap.find('._is-active, .active');
                const $tabLstWrap = $tabWrap.find('.tab-list-wrap');
                const num = $tabLstWrap.offset().top; 
                const elemTop = Math.ceil($this.offset().top);
                const scrollTop = $tabLstWrap.scrollTop();
                const thisElem = Math.ceil($this.outerHeight());
                const centerScroll = elemTop + scrollTop - num - $tabLstWrap.height() / 2 + thisElem / 2;
    
                const $highLight = $tabWrap.find('.highlight');
                const newHeight = $this.outerHeight();
                
                $highLight.css('left', '');
                $highLight.css('width', '');
    
                $highLight.stop().animate({ // 활성화 된 탭의 높이와 위치로 변경
                    height: newHeight,
                    top: elemTop - num + scrollTop
                });
                $tabLstWrap.stop().animate({ // 활성화 된 탭 가운데 스크롤 이동
                    scrollTop: centerScroll
                }, 500);
            } else if ($tabWrap.hasClass('tab-moving') && !$tabWrap.hasClass('tab-vertical')) { 
                // 가로 버전일때
                const $tabLstWrap = $tabWrap.find('.tab-list-wrap');
                const $this = $tabLstWrap.find('._is-active, .active');
                const num = $tabLstWrap.offset().left; 
                const elemLeft = Math.ceil($this.offset().left);
                const scrollLeft = $tabLstWrap.scrollLeft();
                const thisElem = Math.ceil($this.outerWidth());
                const centerScroll = elemLeft + scrollLeft - num - $tabLstWrap.width() / 2 + thisElem / 2;
    
                const $highLight = $tabWrap.find('.highlight');
                const newWidth = Math.floor($this.outerWidth());
                
                // 활성화 된 탭의 너비와 위치로 변경
                $highLight.css({ 
                    top: '', 
                    height: '' 
                }).stop().animate({ 
                    width: newWidth, 
                    left: elemLeft - num + scrollLeft 
                });
    
                $tabLstWrap.stop().animate({ // 활성화 된 탭 가운데로 스크롤 이동
                    scrollLeft: centerScroll
                }, 500);
            }
            if (callback && typeof callback === 'function') {
                callback($tabWrap, $this); // 콜백 호출
            }
        },
        tabSticky: function(isTabClick) {
            /**
             * tab sticky 이벤트
             * @this 클릭한 탭 버튼
             * @tabWrap 클릭한 탭의 wrapper
             * window 스크롤시 해당 content와 tab 활성화
             */
            const self = this;
            const $tabWrap = $('.tab-sticky');
            
            $(window).on('scroll', function(){
                if (!isTabClick) {
                    isTabClick = true;
    
                    $(".tab-contents").each(function () {
                        const contentTop = $(this).offset().top;
                        const contentBottom = contentTop + $(this).outerHeight();
                        const tabHeight = $('.tab').outerHeight() + 2;
    
                        if (!$('html, body').is(':animated')) {
                            if (window.scrollY >= contentTop - tabHeight && window.scrollY <= contentBottom) {
                                const targetId = $(this).attr("id");
                                const targetTab = $('.tab[aria-controls="' + targetId + '"]');
    
                                targetTab.closest('li').addClass("_is-active").siblings().removeClass("_is-active");
                                targetTab.siblings().find('.tab').children('a').attr('aria-selected', 'false');
                                targetTab.children('a').attr('aria-selected', 'true');
                                $(this).addClass("_is-active").siblings().removeClass("_is-active");
    
                                self.moveHighLight($tabWrap, targetTab);
                            }
                        }
    
                        setTimeout(function () {
                            isTabClick = false;
                        }, 10);
                    });
                }
            });
        },
        scrollEventHandler: function() {
            /**
             * tab scroll 이벤트
             * @thisWrap 스크롤 중인 컨텐츠 상위 wrapper
             * 스크롤시 해당 content와 tab 활성화
             */
            const $thisWrap = $(this);
    
            $thisWrap.children('.tab-contents').each(function() {
                const panelTop = $(this).position().top;
                const $tabWrap = $(this).closest('.tab-scroll');
    
                if (panelTop <= -20 && panelTop > -$thisWrap.height() / 2) {
                    const tabId = $(this).attr('id');
    
                    $tabWrap.find('.tab').removeClass('_is-active');
                    $tabWrap.find('.tab').children('a').attr('aria-selected', 'false');
                    $tabWrap.find('.tab[aria-controls="' + tabId + '"]').addClass('_is-active');
                    $tabWrap.find('.tab[aria-controls="' + tabId + '"]').children('a').attr('aria-selected', 'true');
                    $(this).siblings().removeClass('_is-active');
                    $(this).addClass('_is-active');
    
                    const $this = $tabWrap.find('.tab[aria-controls="' + tabId + '"]');
                    cp.tab.moveHighLight($tabWrap, $this);
                }
            });
        },
        tabClick: function() {
            /**
             * 선택된 탭 _is-active 함수
             * @this 클릭한 탭 버튼
             * @tabWrap 클릭한 탭의 wrapper
             * @contentsIdx 클릭한 탭의 index와 같은 index의 content
             */
            const self = this;
    
            $('.tab-wrap').on('click', this.constEl.tab, function(e) {
                e.preventDefault();
    
                const $this = $(this).parent('.tab');
                const $index = $this.index();
                const $tabWrap = $this.closest('.tab-wrap');
                const $contentsWrap = $tabWrap.children('.tab-contents-wrap');
                const $contents = $contentsWrap.children('.tab-contents');
                const $contentsIdx = $contentsWrap.children('.tab-contents').eq($index);
    
                const tabAttr = function () { 
                    // 탭 클릭시 활성화
                    $this.siblings('.tab').removeClass('_is-active');
                    $this.siblings('.tab').children('a').attr('aria-selected', 'false');
                    $this.addClass('_is-active');
                    $this.children('a').attr('aria-selected', 'true');
                    $contents.removeClass('_is-active');
                    $contentsIdx.addClass('_is-active');
                    $contents.removeAttr('tabindex');
                    $contentsIdx.attr('tabindex','0');
                }
    
                if ($tabWrap.attr('data-roll') === 'tab' && $tabWrap.hasClass('tab-scroll')){ 
                    // tab-scroll 일 경우
                    tabAttr();
                    self.moveHighLight($tabWrap);
    
                    // tabpanel 영역 안 스크롤 이동
                    $('.tab-scroll .tab-contents-wrap').off('scroll', self.scrollEventHandler); // 스크롤 이벤트 핸들러 제거
    
                    const $targetHref = $('#' + $this.attr('aria-controls'));
                    const $targetWrap = $targetHref.parent('.tab-contents-wrap');
                    const location = $targetHref.position().top;
    
                    $targetWrap.stop().animate({
                        scrollTop: $targetWrap.scrollTop() + location
                    }, 300);
    
                    setTimeout(function() {
                        $('.tab-scroll .tab-contents-wrap').on('scroll', self.scrollEventHandler);
                    }, 400);
                } else if ($tabWrap.attr('data-roll') === 'tab' && $tabWrap.hasClass('tab-sticky')) { 
                    // tab-sticky 일 경우
                    isTabClick = false;
                    if (!isTabClick) {
                        isTabClick = true;          
                        
                        tabAttr();       
                        self.moveHighLight($tabWrap, $this, function() {
                            const target = $this.attr('aria-controls');
                            const $target = $('#' + target);
                            const tabHeight = $this.outerHeight();
                            const targetTop = $target.offset().top - tabHeight;
    
                            $('html,body').stop().animate({
                                'scrollTop': targetTop
                            }, 600, 'swing', function() {
                                isTabClick = false; // 스크롤이동 끝난 후 false 부여
                            });   
                        });
                    }
                } else if ($tabWrap.attr('data-roll') === 'tab' && !$tabWrap.hasClass('tab-sticky')) {
                    tabAttr();
                    $contentsIdx.removeAttr('hidden');
                    self.moveHighLight($tabWrap);
                }
                
                let newTop = 0;
                self.tabSel($this, $tabWrap);
            });
        },
        
        addTab: function() {
            const _addTab = '.tab-list-wrap > .tab-list > li._addTab > a';
            const _tabLi = $('<li class="tab"><a href="javascript:void(0);" contenteditable="true">추가탭</a></li>'),
            _tabCont = $('<div class="tab-contents">' +
                            '<div class="goods-tit">' +
                            '<span class="goods-category" contenteditable="true">iPad</span>' +
                            '<button class="btn btn-size xs shadow _delTab">탭삭제</button>' +
                          '</div>' +
                            '<ul class="lst lst-goods">' +
                            '<li>' +
                                '<dl class="goodsWrap">' +
                                '<dt class="goods-info">' +
                                    '<div class="no-img"></div>' +
                                '</dt>' +
                                '<dd class="item brand">애플</dd>' +
                                '<dd class="item name">Me iPad Pro 11형 Wi-Fi 128GB</dd>' +
                                '<dd class="item price">1,249,000 원</dd>' +
                                '<dd class="item benefit">' +
                                    '<span class="label point">최대 50% M 포인트</span>' +
                                '</dd>' +
                                '</dl>' +
                            '</li>' +
                            '<li>' +
                                '<dl class="goodsWrap">' +
                                '<dt class="goods-info">' +
                                    '<div class="no-img"></div>' +
                                '</dt>' +
                                '<dd class="item brand">애플</dd>' +
                                '<dd class="item name">Me iPad Pro 11형 Wi-Fi 128GB</dd>' +
                                '<dd class="item price">1,249,000 원</dd>' +
                                '<dd class="item benefit">' +
                                    '<span class="label point">최대 50% M 포인트</span>' +
                                '</dd>' +
                                '</dl>' +
                            '</li>' +
                            '</ul>' +
                            '<div class="btnWrap">' +
                            '<button class="btn btn-size xs shadow goodsAddBtn bg" data-modal="swiper_uniqueData">상품추가</button>' +
                            '</div>' +
                        '</div>');

                        $('body').off('click').one('click', _addTab, function() {
                            $(this).closest('li').before(_tabLi);
                            $(this).parent().parent().parent().next('.tab-contents-wrap').append(_tabCont);
                            cp.tab.init();
                        })
        },
        delTab: function() {
            $('.tab-wrap').on('click', '.tab-contents-wrap ._delTab', function() {
                const $tabWrap = $(this).closest('.tab-wrap');
                const $tabs = $tabWrap.find('li.tab');
                const index = $(this).closest('.tab-contents').index();
        
                if ($tabs.length <= 1) {
                    return;
                } else {
                    $tabs.eq(index).remove();
                    $tabWrap.find('.tab-contents').eq(index).remove();
                }
                console.log(index);
        
                cp.tab.moveHighLight($tabWrap);
            });
        },
        tabUpdate: function() {
            $('.tab-wrap').on('input', '.goods-category', function() {
                const $tabWrap = $(this).closest('.tab-wrap');
                const tabIndex = $(this).closest('.tab-contents').index();
                const newCategory = $(this).text();
                const $tabText = $tabWrap.find('.tab').eq(tabIndex).children('a');
        
                $tabText.text(newCategory);
            });
        
            $('.tab-wrap').on('input', '.tab > a', function() {
                const $tabWrap = $(this).closest('.tab-wrap');
                const tabIndex = $(this).parent('.tab').index();
                const newCategory = $(this).text();
                const $tabContents = $tabWrap.find('.tab-contents').eq(tabIndex).find('.goods-category');
        
                $tabContents.text(newCategory);
            });
        }
    };
    /* accordion */
    cp.accordion = {
        constEl: {
            btnToggle: '.btn-toggle',
            btnChk: '.field-checkbox'
        },
        init() {
            this.toggleAccordion();
            this.toggleChk();
            this.allChk('chkAll', 'exChk');
        },
        toggleDown: function($this, $thisContents, $thisWrap) {
            /**
             * 아코디언 slideDown 함수
             * @this 클릭한 토글 버튼
             * @thisContents 클릭한 버튼에 해당하는 content 박스
             * @thisWrap 해당 아코디언의 wrapper
             */
            if ($thisWrap.attr('data-scroll') === 'top') { // data-scroll="top" 여부
                var offsetTop = $this.parent().offset().top;
    
                if (!$thisWrap.attr('data-type')) {
                    $thisContents.slideDown();
                    $this.addClass('_is-active').attr('aria-expanded', true).attr('aria-label', '닫기');
                    
                    setTimeout(function() {
                        $('html, body').animate({ 
                            scrollTop: offsetTop
                        }, 300);
                    }, 200);
                } else {
                    $('html, body').animate({ 
                        scrollTop: offsetTop
                    }, 300, function (){
                        $thisContents.slideDown(300);
                        $this.addClass('_is-active').attr('aria-expanded', true).attr('aria-label', '닫기');
                    });
                }
            } else {
                $thisContents.slideDown();
                $this.addClass('_is-active').attr('aria-expanded', true).attr('aria-label', '닫기');
            }
        },
        handleAccordion: function($this, $thisContents, $thisWrap) {
            /**
             * data-type 조건에 따라 아코디언 동작 함수
             * @dataType 해당 아코디언의 data-type
             * @this 클릭한 토글 버튼
             * @thisContents 클릭한 버튼에 해당하는 content 박스
             * @thisWrap 해당 아코디언의 wrapper
             * @btnAll 아코디언 전체 토글 버튼
             */
            const self = this;
            const dataType = $thisWrap.closest('.accordion-wrap').attr('data-type')
    
            if ($thisContents.is(':hidden')) {
                if (dataType && dataType.indexOf('oneToggle') !== -1) { //토글 하나씩만 오픈
                    const $btnAll = $thisWrap.find('.btn-toggle');
    
                    $btnAll.removeClass('_is-active').attr('aria-expanded', false).attr('aria-label', '열기');
                    $btnAll.parent('.accordion-header').next('.accordion-contents').slideUp();
                    setTimeout(function() {
                        self.toggleDown($this, $thisContents, $thisWrap);
                    }, 300);
                } else {
                    self.toggleDown($this, $thisContents, $thisWrap);
                }
            } else {
                if (dataType && dataType.indexOf('double') !== -1) { //토글 안에 토글
                    $thisContents.find('.accordion-contents').slideUp();
                    $thisContents.find('._is-active').removeClass('_is-active').attr('aria-expanded', false).attr('aria-label', '열기');
                }
                $this.removeClass('_is-active').attr('aria-expanded', false).attr('aria-label', '열기');
                $thisContents.slideUp();
            }
        },
        toggleAccordion: function() {
            /**
             * 아코디언 함수 실행
             * @this 클릭한 토글 버튼
             * @thisContents 클릭한 버튼에 해당하는 content 박스
             * @thisWrap 해당 아코디언의 wrapper
             */
            const self = this;
    
            $('.accordion-wrap').on('click', this.constEl.btnToggle, function(e) {
                e.preventDefault();
    
                const $this = $(this);
                const $thisContents = $this.parent('.accordion-header').next('.accordion-contents');
                const $thisWrap = $this.closest('.accordion-wrap');
    
                self.handleAccordion($this, $thisContents, $thisWrap);
            });
        },
        toggleChk: function() {
            /**
             * 체크박스 상태에 따라 아코디언 동작하는 함수
             * @thisLabel 클릭한 label
             * @thisContents 클릭한 레이블에 해당하는 content 박스
             * @thisWrap 해당 아코디언의 wrapper
             * @thisBtn 클릭한 레이블의 형제 토글 버튼
             * @nextAccordion 클릭한 레이블의 다음 contents
             * @dataType 해당 아코디언의 data-type
             */
            const self = this;
    
            $('.accordion-wrap').on('click', this.constEl.btnChk, function(e) {
                e.stopPropagation();
    
                const $thisLabel = $(this);
                const $thisContents = $thisLabel.closest('.accordion-header').next('.accordion-contents');
                const $thisWrap = $thisLabel.closest('.accordion-wrap');
                const $thisBtn = $thisLabel.siblings('.btn-toggle');
                const $nextAccordion = $thisContents.parent('.accordion').next('.accordion');
                const dataType = $thisWrap.attr('data-type');
    
                if (dataType && dataType.indexOf('toggleChk') !== -1) {
                    setTimeout(function() {
                        if ($thisContents.is(':visible')) {
                            if ($thisLabel.find('input').prop('checked')) { // 체크하면 해당 contents 닫힘
                                $thisBtn.removeClass('_is-active').attr('aria-expanded', false).attr('aria-label', '열기');
                                $thisContents.slideUp();
    
                                if (!$nextAccordion.children('.accordion-header').find('input').prop('checked')) { // 다음 input이 미체크시 다음 contents 열림
                                    $nextAccordion.children('.accordion-contents').slideDown();
                                    $nextAccordion.children('.accordion-header').find('.btn-toggle').addClass('_is-active').attr('aria-expanded', true).attr('aria-label', '닫기');
                                }
                            }
                        } else {
                            if (!$thisLabel.find('input').prop('checked')) { //체크 풀면 해당 contents 열림
                                self.toggleDown($thisLabel, $thisContents, $thisWrap);
                            }
                        }
                    });
                }
            });
        },
        allChk: function(chkAllId, chkName) { // (전체 체크할 input ID, 해당하는 input name명)
            /**
             * @total 개별 input의 전체 갯수
             * @checked 개별 input의 check된 상태
             * @thisContents 클릭한 레이블의 아코디언 contents
             * @thisWrap 해당 아코디언의 wrapper
             * @thisBtn 클릭한 레이블의 형제 토글 버튼
             * @dataType 해당 아코디언의 data-type
             */
            
            // 전체 체크하는 input 클릭시
            $('.accordion-wrap').on('click', '#' + chkAllId, function() {
                if ($(this).is(':checked')){
                    $('input[name^="' + chkName + '"]').prop('checked', true);
                } else {
                    $('input[name^="' + chkName + '"]').prop('checked', false);
                }
            });
    
            // 개별 input 클릭시
            $('.accordion-wrap').on('click', 'input[name^="' + chkName + '"]', function() {
                const total = $('input[name^="' + chkName + '"]').length;
                const checked = $('input[name^="' + chkName + '"]:checked').length;
                const $thisContents = $(this).closest('.accordion-contents');
                const $thisWrap = $(this).closest('.accordion-wrap');
                const $thisBtn =  $(this).closest('.accordion').find('.btn-toggle');
                const dataType = $thisWrap.attr('data-type');
        
                if (total !== checked) {
                    $('#' + chkAllId).prop('checked', false);
                } else {
                    $('#' + chkAllId).prop('checked', true); 
                    if (dataType && dataType.indexOf('toggleChk') !== -1) {
                        $thisContents.slideUp();
                        $thisBtn.removeClass('_is-active').attr('aria-expanded', false).attr('aria-label', '열기');
                    }
                }
            });
        }
    };
    /* swiper *//* BHY - 240314 추가된 것(삭제예정) */
    cp.swiper = {
        init() {
            this.popSwiper();
        },
        popSwiper: function () {
            setTimeout(()=>{
                const swiper = new Swiper('.swip-content', {
                    loop: false,
                    navigation: {
                      nextEl: '.swip-swiper .swiper-button-next',
                      prevEl: '.swip-swiper .swiper-button-prev',
                    },
                });
                swiper.on('slideChange', function () {
                    $('.terms-num').text(swiper.activeIndex + 1)
                  });
            },250)
        },
    };

    cp.init = function () {
        cp.uaCheck.init(); // ver check
        cp.tblCaption.init(); // table caption
        cp.form.init(); // form
        cp.modalPop.init();
        cp.toolTip.init();
        cp.selectPop.init(); // 바텀시트 select
        cp.selectBox.init();
        cp.tab.init();
        cp.accordion.init();
        cp.swiper.init();
    };

    cp.init();
    return cp;
}(window.COMPONENT_UI || {}, jQuery));
