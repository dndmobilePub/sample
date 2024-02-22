var COMPONENT_UI = (function (cp, $) {

    // 고유한 ID 생성 함수
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    cp.imgCrop = {
        init: function () {
            $('.imgWrap').click(this.openCropImg);
        },
        openCropImg: function () {
            var $imgWrap = $(this);

            $('.cropModalWrap').load('modal.html', function () {
                var uniqueId = generateUniqueId(); // 고유한 ID 생성

                var avatarId = 'avatar_' + uniqueId;
                var inputId = 'input_' + uniqueId;
                var modalId = 'modal_' + uniqueId;
                var imgId = 'img_' + uniqueId;
                var cropId = 'crop_' + uniqueId;

                // 각 요소에 ID 부여
                $imgWrap.children('img').attr('id', avatarId);
                $('.cropInput').attr('id', inputId);
                $('.cropModalWrap').children('.modalPop').attr('id', modalId);
                $('.img-container img').attr('id', imgId);
                $('.btnCrop').attr('id', cropId);

                cp.imgCrop.iterateMdImg(avatarId, inputId, modalId, imgId, cropId, $imgWrap);
            });
        },
        iterateMdImg: function (avatarId, inputId, modalId, imgId, cropId, $imgWrap) {
            var avatar = $('#' + avatarId)[0];
            var $image = $('#' + imgId)[0];
            var $input = $('#' + inputId)[0];
            //var $alert = $mdImg.siblings('.alert');
            var $modal = $('#' + modalId);
            var cropper;

            $modal.show();

            if ($(avatar).attr('src') != '') {
                $image.src = $(avatar).attr('src');
                $image.onload = function () {
                    initializeCropper();
                };
            } else {
                $('.cropModalWrap .img-container').addClass("no-img");
            }

            // Cropper를 초기화하는 함수
            function initializeCropper() {
                if (cropper) {
                    cropper.destroy();
                    cropper = null;
                }
                cropper = new Cropper($image);
            }

            // input 변경 시 새 이미지 로드 및 cropper 재실행
            $(document).off('change', $input).on('change', $input, function (e) {
                var files = e.target.files;
                var done = function (url) {
                    $image.src = url;
                    initializeCropper();
                };
                var reader;
                var file;
                var url;

                $('.cropModalWrap .img-container').removeClass("no-img");

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

            // 모달 동작시 cropper 실행/초기화
            $modal.on('show', function () {
                cropper = new Cropper($image);
            });
            $modal.on('hide', function () {
                cropRemove();
            });

            // cropper 실행 후(crop 버튼 클릭 후)
            $('#' + cropId).on('click', function () {
                var imgIndex =  $('#modal').attr('img-index');
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

            // 모달 닫기 cropper 초기화
            $('.btn-close-pop').on('click', function () {
                $modal.hide();
                cropRemove();
            });

            // cropper, modal 제거
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
        init: function () {
            // 파일 업로드 버튼 클릭 시
            $(document).off('click', '.addVideo-file').on('click', '.addVideo-file', function () {
                var $videoWrap = $(this).closest('.md-video').find('.videoWrap');
                cp.videoModule.addVideo($videoWrap);
            });

            // 유투브 파일 추가 버튼 클릭 시
            $(document).off('click', '.addVideo-utube').on('click', '.addVideo-utube', function () {
                var $videoWrap = $(this).closest('.md-video').find('.videoWrap');
                cp.videoModule.addYuetube($videoWrap);
            });
        },
        addVideo: function ($videoWrap) {
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

            // 파일 업로드 input을 document body에 추가하기 전에 제거하는 코드
            $('input[type="file"]').remove(); 

            document.body.appendChild(input);
            input.click();
        },
        addYuetube: function ($container) {
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
                $container.html(iframe);
                $container.removeClass('no-video');
            } else {
                alert("Invalid YouTube video URL.");
            }
        }
    };

    cp.txtEdit = {
        init: function () {
            // 마우스 왼쪽 버튼 클릭 시 contenteditable 속성을 활성화합니다.
            $(document).on('click', '[contenteditable]', function(e) {
                // .editDone 클래스가 존재하면 실행 중단
                if ($(this).hasClass('editDone')) {
                    return;
                }
    
                $(this).attr('contenteditable', 'true');
                $(this).focus(); 
            });
    
            // 텍스트 영역을 벗어날 때 contenteditable 속성을 비활성화합니다.
            $(document).on('focusout', '[contenteditable]', function() {
                // .editDone 클래스가 존재하면 실행 중단
                if ($(this).hasClass('editDone')) {
                    return;
                }
    
                $(this).attr('contenteditable', 'false');
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
                    // $modalWrap.css({'height': 100 + '%'});
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
                
                // 팝업 요소의 위치를 조정한다.
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
                // 팝업 요소의 위치를 조정한다.
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
            // 생성된 $dimmed 제거 후 다시 추가
            dimmedEl.remove(); 
            $('body').addClass('no-scroll').append(dimmedEl);

            
        },

        // 탭으로 포커스 이동 시 팝업이 열린상태에서 팝업 내부해서만 돌도록 제어하는 함수
        layerFocusControl: function ($btn) {
            // var target = $btn.attr('data-modal');
            // var $modal = $('.modalPop[modal-target="' + target + '"]');
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
            this.mdGoodsAdd();
            this.mdGoodsChoice();
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
                    <button class="btn btn-size xs shadow swiperAddBtn bg _modalBtn" data-modal="modal">상품 항목추가</button>
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
                                    <div class="txtEdit editDone">
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
                                    <div class="txtEdit editDone">
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
            $('.btnWrap').one('click', 'a', function(e) { // .on() 메소드를 사용하여 클릭할 때마다 이벤트 실행
                e.preventDefault();
                var dataType = $(this).data('type');
                var newMd = $('<div class="md"><button class="btn btn-size xs shadow deleteBtn">모듈삭제</button></div>');
                newMd.addClass('md-' + dataType);
                newMd.attr('data-type', dataType);
        
                var contentHTML = cp.moduleBox.mdBoxAddCont(); // 수정된 부분
        
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
                // cropperOpen();
                COMPONENT_UI.init();
        
                // 새로 생성된 스와이퍼에 대한 초기화
                if (dataType === 'goods') {
                    var newSwiperContainer = newMd.find('.swiper')[0];
                    var newSwiperInstance = initializeSwiper(newSwiperContainer);
                    $(newSwiperContainer).data('swiper', newSwiperInstance);
                }
        
                // 페이지 하단으로 스크롤
                $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
                
            });
        },

        // 상품
        initializeSwiper: function(swiperContainer) {
        var newSwiper = new Swiper(swiperContainer, {
            loop: true,
            slidesPerView: 2, 
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
            return newSwiper;
        },
        mdGoodsAdd:function() {
            $('body').on('click', '.swiperAddBtn', function() {
                var targetModal = $(this).data('modal'); // 버튼의 data-modal 속성 값 가져오기
                $('.modalPop').attr('modal-target', targetModal); // modal-target 속성 업데이트
                
                cp.modalPop.showModal($(this)); // 모달을 열도록 modalPop 호출
                cp.module.checkedCount = 0;                
            });

            $('.modalPop').change('hide', function () {
                $('.btn-registration-pop').removeClass('btn-close-pop');
            });
        },
        
       // mdGoodsPopClose 함수 정의
        mdGoodsChoice: function() {
            const productCheckboxes = $('.product-list input[type="checkbox"]');
            const registrationButton = $('.btn-registration-pop');
            $('.product-list input[type="checkbox"]').prop('checked', false);
            
            // 체크박스 상태 변경 이벤트 핸들러 등록
            productCheckboxes.on('change', function() {
                const checkedCount = productCheckboxes.filter(':checked').length;

                // 체크된 체크박스가 하나 이상인 경우
                if (checkedCount > 0) {
                    registrationButton.addClass('btn-close-pop');
                } else { // 체크된 체크박스가 없는 경우
                    registrationButton.removeClass('btn-close-pop');
                }
            });
        },

        mdGoodPopSel:function(){
        
            $('.btn-registration-pop').on('click', function() {  
                $('.product-list input[type="checkbox"]:checked').each(function() {
                    var parentLi = $(this).closest('li');
                    var clonedSlide = parentLi.find('.swiper-slide').clone();
                    $('.swiper-wrapper').append(clonedSlide);
                });                
                
                cp.moduleBox.initializeSwiper('.swiper');
                cp.modalPop.closePop($(this));
        
                // $('.product-list input[type="checkbox"]').prop('checked', false);
                cp.module.checkedCount = 0;
            });
        },
        
    };

    cp.init = function () {
        cp.imgCrop.init();
        cp.videoModule.init();
        cp.txtEdit.init();
        cp.moduleBox.init();
        cp.modalPop.init();
    };

    cp.init();
    return cp;
}(window.COMPONENT_UI || {}, jQuery));