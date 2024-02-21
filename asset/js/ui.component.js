var COMPONENT_UI = (function (cp, $) {

    // 고유한 ID 생성 함수
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    cp.module = {
        init: function () {
            $('.md').not(':last').append('<hr class="devide" />');
        },
    }

    cp.imgCrop = {
        init: function () {
            $('.imgWrap').click(this.openCropImg);
        },
        openCropImg: function () {
            var $imgWrap = $(this);

            $('.modalWrap').load('modal.html', function () {
                var uniqueId = generateUniqueId(); // 고유한 ID 생성

                var avatarId = 'avatar_' + uniqueId;
                var inputId = 'input_' + uniqueId;
                var modalId = 'modal_' + uniqueId;
                var imgId = 'img_' + uniqueId;
                var cropId = 'crop_' + uniqueId;

                // 각 요소에 ID 부여
                $imgWrap.children('img').attr('id', avatarId);
                $('.sr-only').attr('id', inputId);
                $('.cropModal').attr('id', modalId);
                $('.img-container img').attr('id', imgId);
                $('.crop').attr('id', cropId);

                cp.imgCrop.iterateMdImg(avatarId, inputId, modalId, imgId, cropId, $imgWrap);
            });
        },
        iterateMdImg: function (avatarId, inputId, modalId, imgId, cropId, $mdImg) {
            var avatar = $('#' + avatarId)[0];
            var $image = $('#' + imgId)[0];
            var $input = $('#' + inputId)[0];
            var $alert = $mdImg.siblings('.alert');
            var $modal = $('#' + modalId);
            var cropper;

            $modal.show();

            if ($(avatar).attr('src') != '') {
                $image.onload = function () {
                    initializeCropper();
                };
                $image.src = $(avatar).attr('src');
            } else {
                $('.modalWrap .img-container').addClass("no-img");
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

                $('.modalWrap .img-container').removeClass("no-img");

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
                
                $('.imgWrap').removeClass("no-img");

                if (cropper) {
                    var cropWidth = $('#cropWidth').val();
                    var cropHeight = $('#cropHeight').val();
                    canvas = cropper.getCroppedCanvas({
                        width: cropWidth,
                        height: cropHeight
                    });
                    initialAvatarURL = avatar.src;
                    avatar.src = canvas.toDataURL();
                    $alert.removeClass('alert-success alert-warning');
                    /*
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
                                $mdImg.removeClass('no-img');
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
            $('.btn-secondary, .close').on('click', function () {
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
                $('.cropModal').remove();
            }
        }
    };

    cp.videoModule = {
        init: function () {
            $('.videoWrap').each(function () {
                var $videoWrap = $(this);
                cp.videoModule.checkVideo($videoWrap);
            });
    
            // Delegate click event for dynamically added .btn-addVideo buttons
            $(document).on('click', '.btn-addVideo', function () {
                var $videoWrap = $(this).parent();
                cp.videoModule.videoAdd($videoWrap);
            });
        },
        checkVideo: function ($videoWrap) {
            if ($videoWrap.find('video').length > 0) {
                // If video tag exists, add .btn-addVideo button
                $videoWrap.find('.btn-addVideo').remove(); // Remove existing .btn-addVideo button
                $videoWrap.append('<button class="btn-addVideo">Add Video</button>');
    
                // Remove click event from .videoWrap
                $videoWrap.off('click');
            } else {
                // If video tag doesn't exist, bind click event to open file input
                $videoWrap.click(function () {
                    cp.videoModule.videoAdd($videoWrap);
                });
            }
        },
        videoAdd: function ($container) {
            var inputURL = prompt("Please enter YouTube video URL:");
            if (inputURL && inputURL.includes("youtube.com")) {
                var videoId = inputURL.split('v=')[1];
                var iframe = $('<iframe width="100" frameborder="0" allowfullscreen></iframe>');
                iframe.attr('src', 'https://www.youtube.com/embed/' + videoId);
                $container.html(iframe);
                $container.removeClass('no-video');
                cp.videoModule.checkVideo($container);
            } else {
                alert("Invalid YouTube video URL.");
            }
        }
    };
    // cp.videoModule.init();

    cp.moduleDrag = {
        init: function () {
            // 드래그앤드롭 초기화
            $(".section").sortable({
                tolerance: 'pointer', 
                distance: 20,
            });
        },
        dragFn: function () {
            // dragFn 함수 코드 작성
        }
    };

    cp.txtEdit = {
        init: function () {
            // 마우스 왼쪽 버튼 클릭 시 contenteditable 속성을 활성화합니다.
            $(document).on('click', '.txtEdit', function(e) {
                $(this).attr('contenteditable', 'true');
                $(this).focus(); 
            });

            // 텍스트 영역을 벗어날 때 contenteditable 속성을 비활성화합니다.
            $(document).on('focusout', '.txtEdit', function() {
                $(this).attr('contenteditable', 'false');
            });
        }
    };
    
    // cp.moduleAdd = {
    //     textAreaHTML: `
    //         <div class="txtEdit" contenteditable="false">
    //             <p>텍스트입력</p>
    //         </div>
    //     `,
    //     imgAreaHTML: `
    //         <div class="imgWrap no-img"><img src=""></div>
    //         <div class="alert" role="alert"></div>
    //     `,
    //     videoAreaHTML: `<div class="videoWrap no-video" id="avatar"></div>`,
    //     swiperAreaHTML: `
    //         <div class="swiper">
    //             <ul class="swiper-wrapper">
    //                 <li class="swiper-slide">
    //                     <div class="swiper-box">
    //                         <div class="imgWrap no-img"><img src="" alt=""></div>
    //                         <div class="alert" role="alert"></div>
    //                     </div>
    //                     <div class="swiper-box">
    //                         <div class="txtEdit" contenteditable="false">
    //                             <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio eveniet rerum accusantium, iusto tempore similique? Iusto vel inventore pariatur totam soluta voluptas suscipit minima, incidunt culpa, doloremque dicta laboriosam libero.</p>
    //                         </div>
    //                     </div>
    //                 </li>
    //                 <li class="swiper-slide">
    //                     <div class="swiper-box">
    //                         <div class="imgWrap no-img"><img src="" alt=""></div>
    //                         <div class="alert" role="alert"></div>
    //                     </div>
    //                     <div class="swiper-box">
    //                         <div class="txtEdit" contenteditable="false">
    //                             <p>텍스트 입력</p>
    //                         </div>
    //                     </div>
    //                 </li>
    //             </ul>
    //             <div class="swiper-button-next"></div>
    //             <div class="swiper-button-prev"></div>
    //             <div class="swiper-pagination"></div>
    //         </div>
    //         <button type="button" class="swiperAddBtn">추가</button>
    //     `,
    //     init: function () {
    //         // 이벤트 핸들러 바인딩 전에 이전에 바인딩된 핸들러를 제거
    //     $('.btnWrap').off('click', 'a');
    //         // 버튼 클릭 이벤트 핸들러
    //         $('.btnWrap').on('click', 'a', function (e) {
    //             e.preventDefault();
    //             var dataType = $(this).data('type');
    //             var newMd = $('<div class="md"><button type="button" class="deleteBtn">삭제</button></div>');
    //             newMd.addClass('md-' + dataType);
    //             newMd.attr('data-type', dataType);
    
    //             var newContentHTML;
    //             if (dataType === 'img') {
    //                 newContentHTML = cp.moduleAdd.imgAreaHTML;
    //             } else if (dataType === 'goods') {
    //                 newContentHTML = cp.moduleAdd.swiperAreaHTML;
    //             } else if (dataType === 'txt') {
    //                 newContentHTML = cp.moduleAdd.textAreaHTML;
    //             } else if (dataType === 'video') {
    //                 newContentHTML = cp.moduleAdd.videoAreaHTML;
    //             }
    //             newMd.append(newContentHTML);
    //             $('.container .section').append(newMd);
    //             // cropperOpen();
    //              COMPONENT_UI.init();
    
    //             // 새로 생성된 스와이퍼에 대한 초기화
    //             if (dataType === 'goods') {
    //                 var newSwiperContainer = newMd.find('.swiper')[0];
    //                 var newSwiperInstance = initializeSwiper(newSwiperContainer);
    //                 $(newSwiperContainer).data('swiper', newSwiperInstance);
    //             }
    
    //             // 페이지 하단으로 스크롤
    //             $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    
    //         });
    
    //         // 동적으로 생성된 스와이퍼에 대한 초기화 함수
    //         function initializeSwiper(swiperContainer) {
    //             var newSwiper = new Swiper(swiperContainer, {
    //                 loop: false,
    //                 slidesPerView: 2,
    //                 spaceBetween: 10,
    //                 pagination: {
    //                     el: '.swiper-pagination',
    //                 },
    //                 navigation: {
    //                     nextEl: '.swiper-button-next',
    //                     prevEl: '.swiper-button-prev',
    //                 },
    //             });
    //             return newSwiper;
    //         }
    
    //         // 슬라이드 추가 함수
    //         function addSlide(swiperInstance) {
    //             var newSlideHTML = `<li class='swiper-slide'>` + cp.moduleAdd.imgAreaHTML + cp.moduleAdd.textAreaHTML + `</li>`;
    //             swiperInstance.appendSlide(newSlideHTML);
    //         }
    
    //         // 버튼 클릭 이벤트 핸들러
    //         $('.container .section').on('click', '.swiperAddBtn', function () {
    //             var swiperContainer = $(this).siblings('.swiper');
    //             var swiperInstance = swiperContainer.data('swiper');
    //             addSlide(swiperInstance);
    //             //cropperOpen();
    //             COMPONENT_UI.init();
    //         });
    
    //         // 초기화
    //         $(document).ready(function () {
    //             // 초기에 존재하는 스와이퍼 객체에 대해서 초기화
    //             var initialSwipers = $('.section .swiper');
    //             initialSwipers.each(function () {
    //                 var swiperInstance = initializeSwiper(this);
    //                 $(this).data('swiper', swiperInstance);
    //             });
    //         });
    //     }
    // };
    

    cp.moduleDelete = {
        init: function() {
            // 삭제버튼
            $(document).on('click', '.deleteBtn', function() {
                $(this).closest('.md').remove();
            });
        }
    };
    

    cp.init = function () {
        cp.imgCrop.init();
        cp.videoModule.init();
        cp.moduleDrag.init();
        cp.txtEdit.init();
        cp.module.init();
        // cp.moduleAdd.init();
        cp.moduleDelete.init();
    };

    cp.init();
    return cp;
}(window.COMPONENT_UI || {}, jQuery));
