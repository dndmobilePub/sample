var COMPONENT_UI = (function (cp, $) {
    
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
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    cp.generateUniqueId = generateUniqueId;

    cp.imgCrop = {
        init: function () {
            this.openCropImg();
        },
        openCropImg: function () {
            $('.imgWrap').on('click', function(){
                var $imgWrap = $(this);

                $('.cropModalWrap').load('modal.html', function () {
                    var cropModalWrap = $(this);
                    var uniqueId = generateUniqueId();
    
                    var avatarId = 'avatar_' + uniqueId;
                    var inputId = 'input_' + uniqueId;
                    var modalId = 'modal_' + uniqueId;
                    var imgId = 'img_' + uniqueId;
                    var cropId = 'crop_' + uniqueId;
                    
                    $imgWrap.children('img').attr('id', avatarId);
                    cropModalWrap.find('.cropInput').attr('id', inputId);
                    cropModalWrap.children('.modalPop').attr('id', modalId);
                    cropModalWrap.find('.img-container img').attr('id', imgId);
                    cropModalWrap.find('.btnCrop').attr('id', cropId);
    
                    cp.imgCrop.iterateMdImg(avatarId, inputId, modalId, imgId, cropId, $imgWrap, cropModalWrap);
                });
            })
        },
        iterateMdImg: function (avatarId, inputId, modalId, imgId, cropId, $imgWrap, cropModalWrap) {
            var avatar = $('#' + avatarId)[0];
            var $image = $('#' + imgId)[0];
            var $input = $('#' + inputId)[0];
            var $modal = $('#' + modalId);
            var cropper;

            $modal.show();

            if ($(avatar).attr('src') != '') {
                $image.src = $(avatar).attr('src');
                $image.onload = function () {
                    initializeCropper();
                };
            } else {
                cropModalWrap.find('.img-container').addClass("no-img");
            }
            
            function initializeCropper() {
                if (cropper) {
                    cropper.destroy();
                    cropper = null;
                }
                cropper = new Cropper($image);
            }
            
            $(document).off('change', $input).on('change', $input, function (e) {
                var files = e.target.files;
                var done = function (url) {
                    $image.src = url;
                    initializeCropper();
                };
                var reader;
                var file;
                var url;

                cropModalWrap.find('.img-container').removeClass("no-img");

                if (files && files.length > 0) {
                    file = files[0];

                    if (URL) {
                        done(URL.createObjectURL(file));
                    } else if (FileReader) {
                        reader = new FileReader();
                        reader.onload = function (e) {
                            done(reader.result);
                        };
                        reader.readAsDataURL(file);
                    }
                }
            });
            
            $modal.on('show', function () {
                cropper = new Cropper($image);
            }).on('hide', function () {
                cropRemove();
            });

            // cropper 실행 후(crop 버튼 클릭 후)
            $('#' + cropId).on('click', function () {
                var initialAvatarURL;
                var canvas;
                
                $imgWrap.removeClass("no-img");

                if (cropper) {
                    var cropWidth = $('#cropWidth').val();
                    var cropHeight = $('#cropHeight').val();
                    canvas = cropper.getCroppedCanvas({
                        width: cropWidth,
                        height: cropHeight
                    });
                    initialAvatarURL = avatar.src;
                    avatar.src = canvas.toDataURL();
                    /*
                    $alert.removeClass('alert-success alert-warning');
                    
                    서버전송관련
                    canvas.toBlob(function (blob) {
                        var formData = new FormData();
                        formData.append('avatar', blob, 'avatar.jpg');
                        
                        $.ajax('https://jsonplaceholder.typicode.com/posts', {
                            method: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,

                            success: function () {
                                $alert.show().addClass('alert-success').text('업데이트 성공');
                                setTimeout(function () {
                                    $('.alert').hide();
                                }, 2000);
                                $imgWrap.removeClass('no-img');
                            },

                            error: function () {
                                avatar.src = initialAvatarURL;
                                $alert.show().addClass('alert-warning').text('업데이트 실패');
                                setTimeout(function () {
                                    $('.alert').hide();
                                }, 2000);
                            },
                        });
                        cropper = new Cropper($image);
                    });
                    */
                }

                $modal.hide();
                cropRemove();
            });
            
            $('.btn-close-pop').on('click', function () {
                $modal.hide();
                cropRemove();
            });
            
            function cropRemove() {
                if (cropper) {
                    cropper.destroy();
                    cropper = null;
                }
                $('#' + imgId).attr('src', '');
                $('.cropModalWrap').children('.modalPop').remove();
            }
        }
    };

    cp.videoModule = {
        constEl: {
            btnVideoFile: ".addVideo-file",
            btnYoutube: ".addVideo-utube"
        },
        init: function () {
            this.addVideo();
            this.addYoutube();
        },
        addVideo: function () {
            const btnVideo = $(this.constEl.btnVideoFile);

            btnVideo.off('click').on('click', function () {
                var $videoWrap = $(this).closest('.md-video').find('.videoWrap');

                var input = document.createElement('input');
                input.type = 'file';
                input.accept = 'video/*';
                input.style.display = 'none';
                input.onchange = function(event) {
                    var file = event.target.files[0];
                    var videoURL = URL.createObjectURL(file);
                    var videoElement = $('<video controls></video>');
                    videoElement.attr('src', videoURL);
                    $videoWrap.html(videoElement);
                    $videoWrap.removeClass('no-video');
                };
                
                $('input[type="file"]').remove(); 
    
                document.body.appendChild(input);
                input.click();
            });
        },
        addYoutube: function () {
            const btnYoutube = $(this.constEl.btnYoutube);

            btnYoutube.off('click').on('click', function () {
                var $videoWrap = $(this).closest('.md-video').find('.videoWrap');

                var inputURL = prompt("Please enter YouTube video URL:");
                if (inputURL && (inputURL.includes("youtube.com") || inputURL.includes("youtu.be"))) {
                    var videoId;
                    if (inputURL.includes("youtube.com")) {
                        videoId = inputURL.split('v=')[1];
                    } else if (inputURL.includes("youtu.be")) {
                        videoId = inputURL.split('/').pop();
                    }
                    var iframe = $('<iframe width="100" frameborder="0" allowfullscreen></iframe>');
                    iframe.attr('src', 'https://www.youtube.com/embed/' + videoId);
                    $videoWrap.html(iframe);
                    $videoWrap.removeClass('no-video');
                } else {
                    alert("Invalid YouTube video URL.");
                }
            });
        }
    };
        
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
            $('html').on('click', btnModal, function() {
               
                self.mdGoodsPop($(this));
                    self.showModal($(this));
                $(this).addClass('_rtFocus');                
                self.layerFocusControl($(this));
            });
        },

        mdGoodsPop:function() {
            $('.modalPop[module-type="goods"]').each(function() {
                var targetModal = $(this).data('modal');
                $(this).attr('modal-target', targetModal);
            });
            // cp.modalPop.showModal($(this));
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
            
            $('._toastBtn').one('click', function() {
                $('._toastBtn._rtFocus').removeClass('_rtFocus');
                $(this).addClass('_rtFocus');
            
                const toastMsg = $(this).attr('data-toast');
                createToast(toastMsg);
            });
        }
        
    };
    
    cp.moduleBox = {
        init: function() {
            this.dragFn();
            this.mdBoxDel();
            this.mdBoxAddClk();
            this.initializeSwiper();
            this.resetSwipers();
            this.mdGoodsPopClose();
            this.mdGoodPopSel();
        },
        
        dragFn: function () {
            $(".section").sortable({
                tolerance: 'pointer', 
                distance: 20,
            });
        },

        mdBoxDel: function() {
            $(".section").on('click', '.deleteBtn', function(e) {
                e.stopPropagation(); // 이벤트 버블링 중단
        
                $(this).closest('.md').remove();
            });
        },

        mdBoxAddCont: function(callback) {
            Promise.all([
                fetch('module_txt.html').then(response => response.text()),
                fetch('module_img.html').then(response => response.text()),
                fetch('module_video.html').then(response => response.text()),
                fetch('module_goods.html').then(response => response.text())
            ]).then(([txtArea, imgArea, videoArea, goodsArea]) => {
                var uniqueData = generateUniqueId();
                var swiperDataModal = 'swiper_' + uniqueData;
                goodsArea = goodsArea.replace('data-modal="swiper_uniqueData"', 'data-modal="' + swiperDataModal + '"');

                function TxtAreaByCase(caseValue) {
                    var pattern = new RegExp('<!-- 텍스트 컨텐츠 ' + caseValue + ' -->([\\s\\S]*?)<!--// 텍스트 컨텐츠 ' + caseValue + ' -->', 'g');
                    var matches = [];
                    var match;
                    while ((match = pattern.exec(txtArea)) !== null) {
                        matches.push(match[0]);
                    }
                    return matches.join('');
                }

                function ImgAreaByCase(caseValue) {
                    var pattern = new RegExp('<!-- 이미지 컨텐츠 ' + caseValue + ' -->([\\s\\S]*?)<!--// 이미지 컨텐츠 ' + caseValue + ' -->', 'g');
                    var matches = [];
                    var match;
                    while ((match = pattern.exec(imgArea)) !== null) {
                        matches.push(match[0]);
                    }
                    return matches.join('');
                }

                function goodsAreaByCase(caseValue) {
                    var pattern = new RegExp('<!-- 상품 컨텐츠 ' + caseValue + ' -->([\\s\\S]*?)<!--// 상품 컨텐츠 ' + caseValue + ' -->', 'g');
                    var matches = [];
                    var match;
                    while ((match = pattern.exec(goodsArea)) !== null) {
                        matches.push(match[0]);
                    }
                    return matches.join('');
                }
                callback({
                    txtArea: {
                        type01HTML: TxtAreaByCase('bigTxt'),
                        type02HTML: TxtAreaByCase('smallTxt'),
                        type03HTML: TxtAreaByCase('bodyTxt')
                    },
                    imgArea: {
                        type01HTML: ImgAreaByCase('detailImg'),
                        type02HTML: ImgAreaByCase('onlyImg'),
                        type03HTML: ImgAreaByCase('titleImg')
                    },
                    videoArea: videoArea,
                    goodsArea: {
                        type01HTML: goodsAreaByCase('goodsSwiper'),
                        type02HTML: goodsAreaByCase('goodsTab')
                    },
                });
            });
        },
        
        mdBoxAddClk: function() {
            $('.btnWrap').off('click').on('click', 'a[data-type]', function(e) {
                e.preventDefault();
                var moduleId = generateUniqueId();
                
                var dataType = $(this).data('type');
                var caseValue = $(this).data('case');
                var newMd = $('<div class="md"></div>');
                newMd.addClass('md-' + dataType);
                newMd.attr('data-type', dataType);
                newMd.attr('data-case', caseValue);
                newMd.attr('data-module', moduleId);
                if (dataType === 'goods') {
                    newMd.attr('data-case', 'goodsSwiper');
                }

                cp.moduleBox.mdBoxAddCont(function(content) {
                    var newContentHTML;
                    if (dataType === 'img') {
                        switch (caseValue) {
                            case 'detailImg':
                                newContentHTML = content.imgArea.type01HTML;
                                break;
                            case 'onlyImg':
                                newContentHTML = content.imgArea.type02HTML;
                                break;
                            case 'titleImg':
                                newContentHTML = content.imgArea.type03HTML;
                                break;
                            default:
                                newContentHTML = content.imgArea.type01HTML;
                        }
                    } 
                     else if(dataType === 'txt') {
                        switch (caseValue) {
                            case 'bigTxt':
                                newContentHTML = content.txtArea.type01HTML;
                                break;
                            case 'smallTxt':
                                newContentHTML = content.txtArea.type02HTML;
                                break;
                            case 'bodyTxt':
                                newContentHTML = content.txtArea.type03HTML;
                                break;
                            default:
                                newContentHTML = content.txtArea.type01HTML;
                        }
                    }else if(dataType === 'goods') {
                         switch (caseValue) {
                             case 'goodsSwiper':
                                 newContentHTML = content.goodsArea.type01HTML;
                                 break;
                             case 'goodsTab':
                                 newContentHTML = content.goodsArea.type02HTML;
                                 break;
                             default:
                                 newContentHTML = content.goodsArea.type01HTML;
                         }
                     } else if(dataType === 'video') {
                        newContentHTML = content.videoArea;
                    } else if(dataType === 'gap') {
                        newContentHTML = '<div class="module-option"><button class="btn btn-size xs shadow deleteBtn">모듈삭제</button><button class="btn btn-size xs shadow optionBtn">설정</button></div>'
                    }
                    newMd.append(newContentHTML);
                    $('.container .section').append(newMd);
                    //COMPONENT_UI.init();
                    cp.init();
                                       
                    
                    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');

                    $('.option-box a').click(function(e) {
                        e.preventDefault();
                        
                        var optionCase = $(this).attr('goods-option');
                        var optionSwiper = $(this).attr('data-swiper');
                        console.log(optionSwiper);
                        var optiondataType = $('.option-wrap').attr('data-type');
                        
                        $('.md[data-module="' + optiondataType + '"]').attr('data-case', optionCase);
                        $('.md[data-module="' + optiondataType + '"]').attr('data-swiper', optionSwiper);
                            
                        if(dataType === 'txt') {
                            switch (optionCase) {
                                case 'bigTxt':
                                    newContentHTML = content.txtArea.type01HTML;
                                break;
                                case 'smallTxt':
                                    newContentHTML = content.txtArea.type02HTML;
                                break;
                                case 'bodyTxt':
                                    newContentHTML = content.txtArea.type03HTML;
                                break;
                                default:
                                    newContentHTML = content.txtArea.type01HTML;
                            }
                        }else if(dataType === 'img') {
                            switch (optionCase) {
                                case 'detailImg':
                                    newContentHTML = content.imgArea.type01HTML;
                                break;
                                case 'onlyImg':
                                    newContentHTML = content.imgArea.type02HTML;
                                break;
                                case 'titleImg':
                                    newContentHTML = content.imgArea.type03HTML;
                                break;
                                default:
                                    newContentHTML = content.imgArea.type01HTML;
                            }
                        }else if(dataType === 'goods') {
                            switch (optionCase) {
                                case 'goodsSwiper':
                                    newContentHTML = content.goodsArea.type01HTML;
                                    //cp.moduleBox.init();
                                break;
                                case 'goodsTab':
                                    newContentHTML = content.goodsArea.type02HTML;
                                    //cp.tab.init();
                                break;
                                default:
                                    newContentHTML = content.goodsArea.type01HTML;
                                }
                            }
                        $('.md[data-module="' + optiondataType + '"]').empty().append(newContentHTML);
                        
                    });

                });


                    
            });
        },

        initializeSwiper: function(swiperContainer) {
            
            $(swiperContainer).each(function() {
                var slidesCount = $(this).find('.swiper-slide').length;
                var slidesPerView = slidesCount > 1 ? 2 : 1; 
                var loopEnabled = slidesPerView > 1 && slidesCount >= 3;
                var loopOption = loopEnabled ? true : false;
                var swiperType = $(this).parents(".md").data('swiper');

                if (slidesCount === 1) {
                    slidesPerView = 1;
                } else {
                    if (swiperType === 'type01') {
                        slidesPerView = 2;
                    } else if (swiperType === 'type02') {
                        slidesPerView = 1.5;
                    } else if (swiperType === 'type03') {
                        slidesPerView = 1;
                    }
                }
            
                new Swiper(this, {
                    loop: loopOption,
                    slidesPerView: slidesPerView,  
                    spaceBetween: 10, 
                    autoplay: true,
                    pagination: {
                        el: '.swiper-pagination',
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
                console.log('dd');
            });

        }, 

        resetSwipers: function() {
            $(document).ready(function() {
                var initialSwipers = $('.section .swiper');
                initialSwipers.each(function() {
                    var swiperInstance = COMPONENT_UI.moduleBox.initializeSwiper(this);
                    $(this).data('swiper', swiperInstance); 
                });
            });
        },

        mdGoodsPopClose: function() {
            const productCheckboxes = $('.product-list input[type="checkbox"]');
            const registrationButton = $('.btn-registration-pop');
            
            productCheckboxes.on('change', function() {
                const checkedCount = productCheckboxes.filter(':checked').length;
                
                if (checkedCount > 0) {
                    registrationButton.addClass('btn-close-pop');
                } else {
                    registrationButton.removeClass('btn-close-pop');
                }
            });
        },

        mdGoodPopSel: function() {
            $('.btn-registration-pop').on('click', function() {
                var thisData = $(this).closest('.modalPop').attr('modal-target');
                var dataElem = $('.md').find('.goodsAddBtn[data-modal="' + thisData + '"]');
                console.log(dataElem);
                
                var existingSwiper = dataElem.closest('.md').find('.swiper')[0];
                if (existingSwiper && existingSwiper.swiper) {
                    existingSwiper.swiper.destroy();
                }
                
                dataElem.closest('.md').find('.swiper-notification').remove();
                dataElem.parent('.btnWrap').siblings('.swiper').find('.swiper-wrapper .no-img').closest('.swiper-slide').remove();
        
                $('.product-list input[type="checkbox"]:checked').each(function() {
                    var parentLi = $(this).closest('li');
                    var clonedSlide = parentLi.find('.swiper-slide').clone();
                    dataElem.closest('.md').find('.swiper-wrapper').append(clonedSlide);
                });
                
                cp.moduleBox.initializeSwiper(dataElem.closest('.md').find('.swiper'));
                cp.modalPop.closePop($(this));
        
                $('.product-list input[type="checkbox"]').prop('checked', false);
        
                setTimeout(function() {
                    $('.btn-registration-pop').removeClass('btn-close-pop');
                }, 100);
            });
        },
        
    };

    cp.tab = {
        constEl: {
            tab: '.tab > a'
        },
        init() {
            this.tabSetting();
            this.tabClick();
            this.scrollEventHandler();
            this.addTab();
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
    
            $(document).ready(function() {
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
    
            $(document).on('click', this.constEl.tab, function(e) {
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
                      _tabCont = $('<div class="tab-contents" contenteditable="true">탭컨텐츠 추가</div>');

            $(_addTab).one('click', function() {
                
                $(this).closest('li').before(_tabLi);
                $(this).parent().parent().parent().next('.tab-contents-wrap').append(_tabCont);
                cp.tab.init();
            });
        },
    };

    cp.colorEdit = {
        init: function() {
            this.spectrumColor();
            this.colorSelect();
        },
        spectrumColor: function(initialColor) {
            $(document).ready(function(){
                $("#editColor").spectrum({
                    flat: false,
                    showInput: true,
                    preferredFormat: "hex",
                    showInitial: true,
                    showPalette: true,
                    showSelectionPalette: true,
                    maxPaletteSize: 10,
                    color: initialColor,
                    change: function(color) {
                        var selectedColor = color.toHexString();
                        cp.colorEdit.fontColor(selectedColor);
                    },

                    palette: [
                        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", 
                        "rgb(204, 204, 204)", "rgb(217, 217, 217)", 
                        "rgb(255, 255, 255)"],
                        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
                        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
                        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
                        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
                        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
                        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
                        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
                        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
                    ]
                });
            });
        },
        fontColor: function(editColor) {
            var targetData = $('.edit-box').data('edit');
            var thisWrap = $('.edit-color').closest('.textEditerWrap');
            
            thisWrap.next('[contenteditable]').each(function() {
                if ($(this).attr('edit-target') === targetData) {
                    $(this).css('color', editColor);
                }
            });
        },
        spectrumBgColor: function(moduleType, bgColor, bgColor2) {
            var self = this;
            var prevBgColor;
            $(".colorInput").spectrum({
                flat: false,
                showInput: true,
                preferredFormat: "hex",
                showInitial: true,
                showPalette: true,
                showSelectionPalette: true,
                maxPaletteSize: 10,
                color: bgColor,
                change: function(color) {
                    var selectedBgColor = color.toHexString();
                    self.bgColor(selectedBgColor, bgColor2, moduleType);
                    bgColor = selectedBgColor;
                }
            });
            $(".colorInput2").spectrum({
                flat: false,
                showInput: true,
                preferredFormat: "hex",
                showInitial: true,
                showPalette: true,
                showSelectionPalette: true,
                maxPaletteSize: 10,
                color: bgColor2,
                change: function(color) {
                    var selectedBgColor2 = color.toHexString();
                    self.bgColor(bgColor, selectedBgColor2, moduleType);
                    bgColor2 = selectedBgColor2;
                }
            });
        },
        bgColor: function(selectedBgColor, selectedBgColor2, moduleType) {
            $('.section').find('.md').each(function() {
                if ($(this).data('module') === moduleType) {
                    if (selectedBgColor2 === undefined) {
                        $(this).css('background', 'linear-gradient(to top,' + selectedBgColor + ',' + selectedBgColor + ')');
                        //$(this).css('background', selectedBgColor);
                    } else {
                        $(this).css('background', 'linear-gradient(to top,' + selectedBgColor + ',' + selectedBgColor2 + ')');
                    }
                }
            });
        },
        colorSelect: function() {
            $('.color-selbox input[name="colorSelect"]').change(function() {
                var selectedOption = $(this).val();
                var dataType = $(this).closest('.option-wrap').data('type');

                $('.md[data-module="' + dataType + '"]').find('.tab a').css('color', selectedOption);
            });
        }
    };

    cp.fontEditer = {
        init: function() {
            this.fontBold();
            this.fontSize();
            this.editOpen();
        },
        fontBold: function() {
            $(document).off('click').on('click', '.editBold', function(){
                var targetData = $('.edit-box').data('edit');
                var thisWrap = $(this).closest('.textEditerWrap');
                var contentEditable = thisWrap.next('[contenteditable][edit-target="' + targetData + '"]');
    
                if (contentEditable.length) {
                    if (contentEditable.hasClass('fontBold')) {
                        contentEditable.removeClass('fontBold');
                    } else {
                        contentEditable.addClass('fontBold');
                    }
                }
            })
        },
/*         fontBold: function() {
            $('body').on('click', '.editBold', function(){
                const $optionWrap = $(this).closest('.option-wrap');
                const dataType = $optionWrap.data('type');
                const font = $(this).closest('.edit-box').data('font');
        
                $('.md[data-module="' + dataType + '"]').find('[data-text="' + font + '"]').toggleClass('fontBold');
            });
        }, */
        fontSize: function() {
            $(document).on('change', '.editSize', function(){
                var newSize = parseInt($(this).val().trim());
                var targetData = $('.edit-box').data('edit');
                var thisWrap = $(this).closest('.textEditerWrap');

                thisWrap.next('[contenteditable]').each(function() {
                    if ($(this).attr('edit-target') === targetData) {                        
                        if (!isNaN(newSize) && newSize > 0) {
                            $(this).css('font-size', newSize + 'px');
                        }
                    }
                })
            })
        },
        editOpen: function() {
            $(document).on('click', '[contenteditable]', function(event) {
                var $this = $(this);
                var thisColor = $this.css('color');

                if (event.type === 'click') {
                    $this.attr('contenteditable', 'true');
                    $this.focus();
                }

                if (!$this.has('.textEditerWrap').length) {
                    $('.textEditerWrap').remove();
                    $('<div class="textEditerWrap"></div>').insertBefore($this);
                    $this.prev('.textEditerWrap').load('text-edit.html', function(){
                        var targetData = $('.edit-box').data('edit');
                    
                        $this.attr('edit-target', targetData);
                        $(this).show();
                        cp.colorEdit.spectrumColor(thisColor);
                    })
                }
            });
            
            $(document).on('click', function(event) {
                var clickedElement = $(event.target);
                var contentEditableElement = clickedElement.closest('[contenteditable]');
                var pcrAppElement = clickedElement.closest('.pcr-app');
                var textEditerWrapElement = clickedElement.closest('.textEditerWrap');
                
                if (contentEditableElement.length > 0 || pcrAppElement.length > 0 || textEditerWrapElement.length > 0) {
                    return;
                }
            
                if (!$('.textEditerWrap').is(':focus') && !$('[contenteditable]').is(':focus')) {
                    $('[contenteditable]').removeAttr('edit-target').attr('contenteditable', 'false');
                    $('.textEditerWrap').remove();
                }
            });
        }
    };

    cp.optionEdit = {
        init: function() {
            this.optionOpen();
            this.optionClose();
            this.gapHeight();
        },
        currentModuleData: null,
        optionOpen: function() {
            cp.optionEdit.currentModuleData = null;
            $('html, body').on('click', '.optionBtn', function() {
                const $thisMd = $(this).closest('.md');
                cp.optionEdit.currentModuleData = $thisMd.data('module');
                const dataType = $thisMd.data('type');
                const background = $thisMd.css('background');
                const regex = /rgba?\([^)]+\)|#[0-9a-f]+/gi;
                const colors = background.match(regex);
                let bgColor, bgColor2;
        
                if (colors.length > 1) {
                    bgColor = colors[0];
                    bgColor2 = colors[1];
                } else {
                    bgColor = bgColor2 = colors[0];
                }
    
                $('.option-wrap').addClass('show').attr('data-type', cp.optionEdit.currentModuleData);
                $('.option-box').hide();
                $('.option-box:not([data-type])').show();
                $('.option-box[data-type="'+dataType+'"]').show();
                $('.moduel-wrap').addClass('_right');
                cp.optionEdit.resetImgColor();
                cp.colorEdit.spectrumBgColor(cp.optionEdit.currentModuleData, bgColor, bgColor2);
                cp.optionEdit.imgColor();
                cp.optionEdit.imgColorSelect(cp.optionEdit.currentModuleData);
                cp.fontEditer.init();
            });
        },
        optionClose: function() {
            $('html, body').on('click', '.optionClsBtn', function(){
                const $optionWrap = $(this).closest('.option-wrap');
                cp.optionEdit.currentModuleData = null;
                $optionWrap.attr('data-type','').removeClass('show');
                $('.moduel-wrap').removeClass('_right');
                cp.optionEdit.resetImgColor();
            });
        },
        resetImgColor: function() {
            $("#btn-upload").val("");
            $("#thumnail").removeAttr("src");
        
            // canvas 초기화 (있는 경우)
            var canvas = document.getElementById("canvas-main");
            if (canvas) {
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        
            $("#palette").empty();
        },
        imgColor: function() {
            // 파일 업로드 이벤트 바인딩
            $("#btn-upload").off('change').on('change', ex_file_upload);
    
            // 메인 이미지 변경 이벤트 바인딩
            $("#thumnail").off('load').on("load", ex_img_onload);

            function ex_file_upload() {
                var file = this.files[0];
                if (!file) return;
    
                var fileReader = new FileReader();
                fileReader.onload = function() {
                    $("#thumnail").attr("src", this.result);
                };
                fileReader.readAsDataURL(file);
            }
            function ex_img_onload() {
                // 캔버스 요소와 그래픽 컨텍스트 생성
                var cnv = document.getElementById("canvas-main");
                var ctx = cnv.getContext("2d");
            
                // 캔버스 크기를 이미지의 크기로 설정
                cnv.setAttribute("width", this.width);
                cnv.setAttribute("height", this.height);
            
                // 이미지를 캔버스에 그림
                ctx.drawImage(this, 0, 0, this.width, this.height);
            
                // 캔버스의 이미지 데이터를 가져옴
                var imgData = ctx.getImageData(0, 0, cnv.width, cnv.height);
            
                // 이미지의 색상 데이터를 저장할 배열 및 변수들 초기화
                var colors = [];
                var blocksize = 1;
                var count = 0;
                var i = -4;
            
                // 이미지의 각 픽셀을 순회하며 색상 데이터를 추출
                while ((i += blocksize * 4) < imgData.data.length) {
                    ++count;
                    var v_rgba = [imgData.data[i], imgData.data[i + 1], imgData.data[i + 2], imgData.data[i + 3]];
                    var v_hex = v_rgba.map(function(color_val) {
                        var _hex = color_val.toString(16);
                        return _hex.length == 1 ? "0" + _hex : _hex;
                    });
                    v_hex = v_hex.join("");
                    colors.push(v_hex);
                }
            
                // 색상 별로 발생한 횟수를 계산하여 객체에 저장
                var picaker = {};
                var old_color = null;
                colors.sort().forEach(function(colorhex, arrindx, arr) {
                    if (old_color != colorhex) {
                        picaker[colorhex] = 0;
                        old_color = colorhex;
                    }
                    return picaker[colorhex] = (picaker[colorhex] || 0) + 1;
                });
            
                // 색상 별로 정렬하여 배열에 저장
                colors = picaker;
                picaker = [];
                for (var color in colors) {
                    picaker.push([color, colors[color]]);
                }
                picaker.sort(function(a, b) {
                    return a[1] - b[1];
                });
                picaker.reverse();
            
                // 상위 5개의 색상 데이터만 선택
                picaker = picaker.slice(0, 5);
            
                // 그라디언트를 생성할 문자열 및 색상 팔레트 요소 초기화
                generateGradientAndPalette(picaker);
            }
            function generateGradientAndPalette(colors) {
                // 색상 별로 그라디언트 생성 및 팔레트에 추가
                var color_gradient = "";
                var palette = $("#palette").empty();
    
                colors.forEach(function(item) {
                    var _color = item[0];
                    if (color_gradient != "") color_gradient += ",";
                    color_gradient += " #" + _color;
                    var _div = $("<div></div>").css("background-color", "#" + _color);
                    palette.append(_div);
                });
            }
        },
        imgColorSelect: function(dataType) {
            var prevBgColor;
            $('body').off('click').on('click', '#palette div', function(event){
                if ($(event.target).is('div')) {
                    var rgbColor = $(event.target).css('background-color');
                    var selectedBgColor = rgbToHex(rgbColor);
                    var $p = $('<p></p>').text('Selected color: ' + selectedBgColor);
                    
                    $('#palette p').remove();
                    $('#palette').append($p);
            
                    cp.colorEdit.bgColor(selectedBgColor, prevBgColor, dataType);
                    cp.colorEdit.spectrumBgColor(dataType, selectedBgColor);
                }
                prevBgColor = selectedBgColor;
                
                event.preventDefault();
                event.stopPropagation();
            })
            function rgbToHex(rgb) {
                var rgbValues = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                
                function hex(x) {
                    return ("0" + parseInt(x).toString(16)).slice(-2);
                }
                
                return "#" + hex(rgbValues[1]) + hex(rgbValues[2]) + hex(rgbValues[3]);
            }
        },
        gapHeight: function() {
            $('.gap-height').on('input', function() {
                var newHeight = $(this).val() + 'px';
                $('.md-gap').css('height', newHeight);
            });
        }
    };

    cp.init = function () {
        cp.form.init();
        cp.imgCrop.init();
        cp.videoModule.init();
        cp.moduleBox.init();
        cp.modalPop.init();
        cp.tab.init();
        cp.colorEdit.init();
        cp.fontEditer.init();
        cp.optionEdit.init();
    };

    cp.init();
    return cp;
}(window.COMPONENT_UI || {}, jQuery));
