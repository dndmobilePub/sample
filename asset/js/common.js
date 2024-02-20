
function cropperOpen() {
    $('.md-img label').click(function() {
        var $mdImg = $(this).closest('.md-img');
        var uniqueId = generateUniqueId(); // 고유한 ID 생성

        var avatarId = 'avatar_' + uniqueId;
        var inputId = 'input_' + uniqueId;
        var modalId = 'modal_' + uniqueId;
        var imgId = 'img_' + uniqueId;
        var cropId = 'crop_' + uniqueId;
        
        // 각 요소에 ID 부여
        $mdImg.find('.label img').attr('id', avatarId);
        $mdImg.find('.sr-only').attr('id', inputId);
        $mdImg.find('.modal').attr('id', modalId);
        $mdImg.find('.img-container img').attr('id', imgId);
        $mdImg.find('.crop').attr('id', cropId);

        iterateMdImg(avatarId, inputId, modalId, imgId, cropId, $mdImg);
    });

    // 고유한 ID 생성 함수
    function generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
        
    function iterateMdImg(avatarId, inputId, modalId, imgId, cropId, $mdImg) {
        var avatar = document.getElementById(avatarId);
        var $image = $('#' + imgId)[0];
        var $input = $('#' + inputId)[0];
        var $alert = $mdImg.find('.alert');
        var $modal = $('#' + modalId);
        var cropper;

        $('[data-toggle="tooltip"]').tooltip();

        $('#' + inputId).change(function (e) {
            var files = e.target.files;
            var done = function (url) {
                $input.value = '';
                $image.src = url;
                $alert.hide();
                $modal.show();
                cropper = new Cropper($image);
            };
            var reader;
            var file;
            var url;

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

        $modal.on('shown', function () {
            cropper = new Cropper($image);
        });
        $modal.on('hide', function () {
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
        });

        $('#' + cropId).on('click', function () {
            var initialAvatarURL;
            var canvas;

            $modal.hide();

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
                    $.ajax('https://jsonplaceholder.typicode.com/posts', {
                        method: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,

                        success: function () {
                            $alert.show().addClass('alert-success').text('Upload success');
                            setTimeout( function(){
                                $('.alert').hide();
                            }, 2000);
                            $('.imgWrap').removeClass('no-img');
                        },

                        error: function () {
                            avatar.src = initialAvatarURL;
                            $alert.show().addClass('alert-warning').text('Upload error');
                            setTimeout( function(){
                                $('.alert').hide();
                            }, 2000);
                            $('.imgWrap').removeClass('no-img');
                        },
                    });
                    cropper.destroy();
                    cropper = null;
                });
            }
        });
        $('.btn-secondary, .close').on('click', function () {
            $modal.hide();
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
        });
    };
};
cropperOpen();   