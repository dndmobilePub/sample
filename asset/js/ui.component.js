var COMPONENT_UI = (function (cp, $) {
    
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
                fetch('textArea.html').then(response => response.text()),
                fetch('imgArea.html').then(response => response.text()),
                fetch('videoArea.html').then(response => response.text()),
                fetch('swiperArea.html').then(response => response.text())
            ]).then(([textArea, imgAreaHTML, videoArea, swiperArea]) => {
                var uniqueData = generateUniqueId();
                var swiperDataModal = 'swiper_' + uniqueData;
                swiperArea = swiperArea.replace('data-modal="swiper_uniqueData"', 'data-modal="' + swiperDataModal + '"');

                function TxtAreaByCase(caseValue) {
                    var pattern = new RegExp('<!-- 텍스트 컨텐츠 ' + caseValue + ' -->([\\s\\S]*?)<!--// 텍스트 컨텐츠 ' + caseValue + ' -->', 'g');
                    var matches = [];
                    var match;
                    while ((match = pattern.exec(textArea)) !== null) {
                        matches.push(match[0]);
                    }
                    return matches.join('');
                }

                function ImgAreaByCase(caseValue) {
                    var pattern = new RegExp('<!-- 이미지 컨텐츠 ' + caseValue + ' -->([\\s\\S]*?)<!--// 이미지 컨텐츠 ' + caseValue + ' -->', 'g');
                    var matches = [];
                    var match;
                    while ((match = pattern.exec(imgAreaHTML)) !== null) {
                        matches.push(match[0]);
                    }
                    return matches.join('');
                }
                console.log(TxtAreaByCase('type01'));
                callback({
                    txtArea: {
                        type01HTML: TxtAreaByCase('type01'),
                        type02HTML: TxtAreaByCase('type02')
                    },
                    imgArea: {
                        type01HTML: ImgAreaByCase('type01'),
                        type02HTML: ImgAreaByCase('type02'),
                        type03HTML: ImgAreaByCase('type03')
                    },
                    videoArea: videoArea,
                    swiperArea: swiperArea
                });
            });
        },
        
        mdBoxAddClk: function() {
            //console.log("mdBoxAddClk 함수 호출됨");
            $('.btnWrap').off('click').on('click', 'a', function(e) {
                e.preventDefault();
                var dataType = $(this).data('type');
                var caseValue = $(this).data('case');
                var newMd = $('<div class="md"><button class="btn btn-size xs shadow deleteBtn">모듈삭제</button></div>');
                newMd.addClass('md-' + dataType);
                newMd.attr('data-type', dataType);
                newMd.attr('data-case', caseValue);
                cp.moduleBox.mdBoxAddCont(function(content) {
                    var newContentHTML;
                    if (dataType === 'img') {
                        var imgAreaContent;
                        switch (caseValue) {
                            case 'type01':
                                imgAreaContent = content.imgArea.type01HTML;
                                break;
                            case 'type02':
                                imgAreaContent = content.imgArea.type02HTML;
                                break;
                            case 'type03':
                                imgAreaContent = content.imgArea.type03HTML;
                                break;
                            default:
                                imgAreaContent = '';
                        }
                        newContentHTML = imgAreaContent;
                    } else if(dataType === 'goods') {
                        newContentHTML = content.swiperArea;
                    } else if(dataType === 'txt') {
                        switch (caseValue) {
                            case 'type01':
                                newContentHTML = content.txtArea.type01HTML;
                                break;
                            case 'type02':
                                newContentHTML = content.txtArea.type02HTML;
                                break;
                            default:
                                newContentHTML = '';
                        }
                    } else if(dataType === 'video') {
                        newContentHTML = content.videoArea;
                    }
                    newMd.append(newContentHTML);
                    $('.container .section').append(newMd);
                    //COMPONENT_UI.init();
                    cp.init();
                    
                    if (dataType === 'goods') {
                        var newSwiperContainer = newMd.find('.swiper')[0];
                        var newSwiperInstance = cp.moduleBox.initializeSwiper(newSwiperContainer);
                        $(newSwiperContainer).data('swiper', newSwiperInstance);
                    }
                    
                    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
                });
            });
        },

        initializeSwiper: function(swiperContainer) {
            $(swiperContainer).each(function() {
                var slidesCount = $(this).find('.swiper-slide').length;
                var slidesPerView = slidesCount > 1 ? 2 : 1; 
                var loopEnabled = slidesPerView > 1 && slidesCount >= 3;
                var loopOption = loopEnabled ? true : false;
            
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
                var dataElem = $('.md').find('.swiperAddBtn[data-modal="' + thisData + '"]');
                
                var existingSwiper = dataElem.closest('.md').find('.swiper')[0];
                if (existingSwiper && existingSwiper.swiper) {
                    existingSwiper.swiper.destroy();
                }
                
                dataElem.closest('.md').find('.swiper-notification').remove();
                dataElem.siblings('.swiper').find('.swiper-wrapper .no-img').closest('.swiper-slide').remove();
        
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
        spectrumBgColor: function(moduleType, bgColor) {
            $(document).ready(function(){
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
                        cp.colorEdit.bgColor(selectedBgColor, moduleType);
                    }
                });
            });
        },
        bgColor: function(selectedBgColor, moduleType) {
            $('.section').find('.md').each(function() {
                if ($(this).data('module') === moduleType) {
                    $(this).css('background-color', selectedBgColor);
                }
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
                var optionWrap = $('.option-wrap');

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
        },
        optionOpen: function() {
            $(document).on('click', '.optionBtn', function() {
                const $thisMd = $(this).closest('.md');
                const moduleData = $thisMd.data('module');
                const bgColor = $thisMd.css('background-color');

                $('.option-wrap').show();
                $('.option-wrap').attr('data-type', moduleData);
                cp.colorEdit.spectrumBgColor(moduleData, bgColor);
            })
        }
    }

    cp.init = function () {
        cp.imgCrop.init();
        cp.videoModule.init();
        // cp.txtEdit.init();
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
