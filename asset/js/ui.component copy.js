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
                    canvas.toBlob(function (blob) {
                        var formData = new FormData();

                        formData.append('avatar', blob, 'avatar.jpg');
                        /*
                        서버전송관련
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
                        */
                        cropper = new Cropper($image);
                    });
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
        cp.moduleDrag.init();
        cp.txtEdit.init(); 
        cp.moduleAdd.init();
        cp.moduleDelete.init();
    };

    cp.init();
    return cp;
}(window.COMPONENT_UI || {}, jQuery));
