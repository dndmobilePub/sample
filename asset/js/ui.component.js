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

    cp.txtEdit = {
        init: function () {
            this.editable();
        },
        editable: function() {
            var self = this; 
        
            $(document).on('click focusout', '[contenteditable]', function(event) {
                if (event.type === 'click') {
                    $(this).attr('contenteditable', 'true');
                    $(this).focus();
                } else if (event.type === 'focusout') {
                    $(this).attr('contenteditable', 'false');
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
            $(document).on('click', btnModal, function() {
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
        
        closePop: function() {
            const self = this;
            $(document).on('click', '.modalPop .btn-close-pop', function() {
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
    
    cp.moduleBox = {
        init: function() {
            this.dragFn();
            this.mdBoxDel();
            this.mdBoxAddClk();
            this.initializeSwiper();
            this.resetSwipers();
            this.mdGoodsAdd();
            this.mdGoodsPopClose();
            this.mdGoodPopSel();
        },
        dragFn: function () {
            $(".section").sortable({
                tolerance: 'pointer', 
                distance: 20,
            });
        },
        mdBoxDel:function() {
            $(document).on('click', '.deleteBtn', function() {
                $(this).closest('.md').remove();
            });
        },
        mdBoxAddCont: function() {
            var uniqueData = generateUniqueId();
            var swiperDataModal = 'swiper_' + uniqueData;
            var content = {
                textAreaHTML: `
                    <div class="txtEdit" contenteditable="false">
                        <p>텍스트 영역</p>
                    </div>
                `,
                imgAreaHTML: `
                    <div class="imgWrap no-img"><img src=""></div>
                `,
                videoAreaHTML: `
                    <div class="videoWrap no-video"></div>
                    <div class="btnWrap">
                        <button class="btn btn-size s bg type2 addVideo-file">파일 업로드</button>
                        <button class="btn btn-size s bg type3 addVideo-utube">유투브 파일추가</button>
                    </div>
                `,
                swiperAreaHTML: `
                    <div class="txtEdit">
                        <h1 contenteditable="true">대제목</h1>
                    </div>
                    <div class="btn btn-size xs shadow dragBtn">드래그</div>
                    <button class="btn btn-size xs shadow swiperAddBtn bg _modalBtn" data-modal="${swiperDataModal}">상품 항목추가</button></button>
                    <div class="swiper">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide">
                                <div class="swiper-box">
                                    <div class="no-img"><img src="" alt=""></div>
                                </div>
                                <div class="swiper-box">
                                    <div class="txtEdit">
                                        <p>브랜드명</p>
                                    </div>
                                </div>
                                <div class="swiper-box">
                                    <div class="txtEdit">
                                        <p>가격</p>
                                    </div>
                                </div>
                            </div>
                            <div class="swiper-slide">
                                <div class="swiper-box">
                                    <div class="no-img"><img src="" alt=""></div>
                                </div>
                                <div class="swiper-box">
                                    <div class="txtEdit">
                                        <p>브랜드명</p>
                                    </div>
                                </div>
                                <div class="swiper-box">
                                    <div class="txtEdit">
                                        <p>가격</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="swiper-button-next"></div>
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-pagination"></div>
                    </div>
                `
            };
        
            return content;
        },

        mdBoxAddClk: function() {
            $('.btnWrap').one('click', 'a', function(e) {
                e.preventDefault();
                var dataType = $(this).data('type');
                var newMd = $('<div class="md"><button class="btn btn-size xs shadow deleteBtn">모듈삭제</button></div>');
                newMd.addClass('md-' + dataType);
                newMd.attr('data-type', dataType);
        
                var contentHTML = cp.moduleBox.mdBoxAddCont();
        
                var newContentHTML;
                if(dataType === 'img') {
                    newContentHTML = contentHTML.imgAreaHTML;
                } else if(dataType === 'goods') {
                    newContentHTML = contentHTML.swiperAreaHTML;
                } else if(dataType === 'txt') {
                    newContentHTML = contentHTML.textAreaHTML;
                } else if(dataType === 'video') {
                    newContentHTML = contentHTML.videoAreaHTML;
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

        mdGoodsAdd:function() {
            $('body').on('click', '.swiperAddBtn', function() {
                var targetModal = $(this).data('modal');
                $('.modalPop').attr('modal-target', targetModal);
                cp.modalPop.showModal($(this));
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
                dataElem.siblings('.swiper').find('.swiper-wrapper .no-img').closest('.swiper-slide').remove();

                $('.product-list input[type="checkbox"]:checked').each(function() {
                    var parentLi = $(this).closest('li');
                    var clonedSlide = parentLi.find('.swiper-slide').clone();
                    dataElem.closest('.md').find('.swiper-wrapper').append(clonedSlide);
                });
                cp.moduleBox.initializeSwiper('.swiper');
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

    cp.init = function () {
        cp.imgCrop.init();
        cp.videoModule.init();
        cp.txtEdit.init();
        cp.moduleBox.init();
        cp.modalPop.init();
        cp.tab.init();
    };

    cp.init();
    return cp;
}(window.COMPONENT_UI || {}, jQuery));
