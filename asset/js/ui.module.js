var COMPONENT_MD = (function (cp, $) {
    
    /* module option control */
    cp.optionEdit = {
        init: function() {
            this.optionOpen();
            this.optionClose();
            this.resizeable();
            this.gapHeight();
            this.inpTxtLocation();
            this.txtBgHeight();
            this.anchorTab();
            this.moreBtn();
        },
        currentModuleData: null,
        optionOpen: function() {
            cp.optionEdit.currentModuleData = null;
            $('html, body').on('click', '.optionBtn', function() {
                const $thisMd = $(this).closest('.md');
                cp.optionEdit.currentModuleData = $thisMd.data('module');
                const dataType = $thisMd.data('type');
                const dataCase = $thisMd.data('case');
                const bgColor = $thisMd.css('background-color');
                const mdHeight = parseInt($thisMd.css('height'), 10);
                const grHeight = parseInt($thisMd.find('.txtEditBg').css('height'), 10);
    
                $('.md').removeClass('_is-active');
                $thisMd.addClass('_is-active');
                $('.option-wrap').addClass('show').attr('data-type', cp.optionEdit.currentModuleData);
                $('.option-box').hide();
                $('.option-box:not([data-type])').show();
                $('.option-box[data-type="'+dataType+'"]').show();
                $('.module-wrap').addClass('_right');
                $('.gap-height').val(mdHeight);
                $('.txtBgHeight').val(grHeight);
                
                cp.colorEdit.resetImgColor();
                cp.colorEdit.spectrumBgColor(cp.optionEdit.currentModuleData, bgColor);
                cp.colorEdit.imgColor();
                cp.colorEdit.imgColorSelect(cp.optionEdit.currentModuleData);
                cp.fontEditer.init();
                cp.optionEdit.gapHeight(cp.optionEdit.currentModuleData);
                cp.optionEdit.inpTxtLocation(cp.optionEdit.currentModuleData);
                cp.imgCrop.openCropImg(cp.optionEdit.currentModuleData);

                if (dataCase) {
                    $('.option-box[data-case]').hide();
                    $('.option-box[data-type="' + dataType + '"][data-case="' + dataCase + '"]').show();
                }
            });
        },
        optionClose: function() {
            this.closeOptionWrap = function() {
                const $optionWrap = $('.option-wrap');
                cp.optionEdit.currentModuleData = null;
                $optionWrap.attr('data-type','').removeClass('show');
                $('.module-wrap').removeClass('_right');
                cp.colorEdit.resetImgColor();
                $('.md').removeClass('_is-active');
            };
        
            $('html, body').on('click', '.optionClsBtn', this.closeOptionWrap);
        },
        resizeable: function() {
            $(".md-gap").resizable({
                handles: 's',
                minWidth: 373,
                maxWidth: 373,
                minHeight: 10,
                stop: function(event, ui) {
                    var newHeight = ui.size.height;
                    const dataType = $(this).data('module');
                    $('.option-wrap[data-type="' + dataType + '"]').find('.gap-height').val(newHeight);
                }
            });
        },
        gapHeight: function(dataType) {
            $('.gap-height').off('change').on('change', function() {
                var newHeight = $(this).val();
                $('.md-gap[data-module="' + dataType + '"]').css('height', newHeight);
            });
        },
        inpTxtLocation: function(dataType) {
            var $txtEdit = $('.md[data-module="' + dataType + '"]').find('.txtEdit');

            $txtEdit.each(function() {
                var classes = $(this).attr('class').split(' '); 
                for (var i = 0; i < classes.length; i++) {
                    if (classes[i] !== 'txtEdit') {
                        $('input[name="location"]').filter(function() {
                            return $(this).val() === classes[i];
                        }).prop('checked', true);
                        break;
                    }
                }
            });
            $('input[name="location"]').off('change').on('change', function() {
                var locationValue = $(this).val();
                //var $txtEdit = $('.md[data-module="' + dataType + '"]').find('.txtEdit');

                $txtEdit.removeClass();
                $txtEdit.addClass('txtEdit ' + locationValue);
            });
        },
        txtBgHeight:function() {
            $('.txtBgHeight').on('change', function() {
                var heightValue = $(this).val();
                var dataType = $(this).closest('.option-wrap').data('type');
                var $txtEditBg = $('.md[data-module="' + dataType + '"]').find('.txtEditBg');

                $txtEditBg.css('height', heightValue);
            });
        },
        anchorTab:function() {
            $('input[name="anchorTab"]').on('change', function() {
                var anchorTabValue = $(this).val();
                var dataType = $(this).closest('.option-wrap').data('type');
                var $anchorTab = $('.md[data-module="' + dataType + '"]').find('.tab-list');

                $anchorTab.removeClass();
                $anchorTab.addClass('tab-list ' + anchorTabValue);
            });
        },
        moreBtn:function() {
            $('input[name="moreBtn"]').on('change', function() {
                var moreBtnValue = $(this).val();
                var moreBtnValue02 = $(this).parent('label').siblings().find('input[name="moreBtn"]').val();
                var dataType = $(this).closest('.option-wrap').data('type');
                var $moreBtnSwiper = $('.md[data-module="' + dataType + '"]').children('.swiper-inner');

                $moreBtnSwiper.removeClass(moreBtnValue02);
                $moreBtnSwiper.addClass('swiper-inner ' + moreBtnValue);
            });
        }
    };
    /* module option */
    cp.moduleBox = {
        init: function() {
            this.dragFn();
            this.mdBoxDel();
            this.mdBoxAddClk();
            this.mdGoodsAdd();
            this.mdGoodsPopClose();
            this.mdGoodPopSel();
            this.initializeSwiper();
            this.resetSwipers();
            //this.mdBoxOption();
        },
        
        dragFn: function () {
            $(".module-edit").sortable({
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

        mdGoodsAdd:function() {
            $('body, html').on('click', '.goodsAddBtn', function() {
                var targetModal = $(this).data('modal');
                $('.modalPop.goodsPop').attr('modal-target', targetModal);
                COMPONENT_UI.modalPop.showModal($(this));
            });
        },

        mdBoxAddCont: function(callback) {
            Promise.all([
                fetch('../../asset/_module/module_txt.html').then(response => response.text()),
                fetch('../../asset/_module/module_img.html').then(response => response.text()),
                fetch('../../asset/_module/module_video.html').then(response => response.text()),
                fetch('../../asset/_module/module_goods.html').then(response => response.text()),
                fetch('../../asset/_module/module_banner.html').then(response => response.text()),
                fetch('../../asset/_module/module_button.html').then(response => response.text())
            ]).then(([txtArea, imgArea, videoArea, goodsArea, bannerArea, buttonArea]) => {
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

                function goodsAreaByCase(caseValue) {
                    var pattern = new RegExp('<!-- 상품 컨텐츠 ' + caseValue + ' -->([\\s\\S]*?)<!--// 상품 컨텐츠 ' + caseValue + ' -->', 'g');
                    var matches = [];
                    var match;
                    while ((match = pattern.exec(goodsArea)) !== null) {
                        matches.push(match[0]);
                    }
                    return matches.join('');
                }

                function bannerAreaByCase(caseValue) {
                    var pattern = new RegExp('<!-- 배너 컨텐츠 ' + caseValue + ' -->([\\s\\S]*?)<!--// 배너 컨텐츠 ' + caseValue + ' -->', 'g');
                    var matches = [];
                    var match;
                    while ((match = pattern.exec(bannerArea)) !== null) {
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
                    imgArea: imgArea,
                    videoArea: videoArea,
                    goodsArea: {
                        type01HTML: goodsAreaByCase('goodsSwiper'), 
                        type02HTML: goodsAreaByCase('goodsTab')
                    },
                    bannerArea: {
                        type01HTML: bannerAreaByCase('bannerList'),
                        type02HTML: bannerAreaByCase('bannerSwiper')
                    },
                    buttonArea: buttonArea,
                });
                COMPONENT_UI.tab.init();
            });
        },
        
        mdBoxAddClk: function() {
            $('.btnWrap').off('click').on('click', 'a[data-type]', function(e) {
                e.preventDefault();
                var moduleId = generateUniqueId();
                
                var dataType = $(this).data('type');
                var caseValue = $(this).data('case');
                var swiperCase = $(this).attr('swiper-case')
                var tabCase = $(this).attr('tab-case')
                var newMd = $('<div class="md"></div>');
                newMd.addClass('md-' + dataType);
                newMd.attr('data-type', dataType);
                newMd.attr('data-case', caseValue);
                newMd.attr('swiper-case', swiperCase);
                newMd.attr('tab-case', tabCase);
                newMd.attr('data-module', moduleId);

                cp.moduleBox.mdBoxAddCont(function(content) {
                    var newContentHTML;
                    if (dataType === 'img') {
                        newContentHTML = content.imgArea;
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
                    }else if(dataType === 'banner') {
                        switch (caseValue) {
                            case 'bannerList':
                                newContentHTML = content.bannerArea.type01HTML;
                                break;
                            case 'bannerSwiper':
                                newContentHTML = content.bannerArea.type02HTML;
                                break;
                            default:
                                newContentHTML = content.bannerArea.type01HTML;
                        }
                    } else if(dataType === 'video') {
                        newContentHTML = content.videoArea;
                    } else if(dataType === 'gap') {
                        newContentHTML = '<div class="module-option"><button class="btn btn-size xs shadow deleteBtn">모듈삭제</button><button class="btn btn-size xs shadow optionBtn">설정</button></div>'
                    } else if(dataType === 'button') {
                        newContentHTML = content.buttonArea;
                    }
                    newMd.append(newContentHTML);
                    $('.container .section').append(newMd);
                    //COMPONENT_MD.init();
                    cp.init();
                    
                    //cp.moduleBox.mdBoxOption();
                    
                    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');

                });

                cp.optionEdit.closeOptionWrap();
                    
            });

            
        },

        // mdBoxOption: function() {
        //     $('.option-box a[goods-option="txt"]').click(function(e) {

        //     });
            
        //     $('.option-box a[data-option]').click(function(e) {
        //         // e.preventDefault();
        //         var optionDataType = $(this).parents('.option-wrap').attr('data-type');
        //         var optionGoodsOption = $(this).attr('data-option');
        //         var optionDataSwiper = $(this).attr('data-swiper')
        //         var dataCase = $('.md[data-module="' + optionDataType + '"]').attr('data-case');
        //         var dataModule = $('.md[data-module="' + optionDataType + '"]').attr('data-module');
        //         $('.md[data-module="' + optionDataType + '"]').attr('data-swiper', optionDataSwiper);

               
        //     });
                
        // },

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
                var thisData = $(this).closest('.modalPop.goodsPop').attr('modal-target');
                var dataElem = $('.md').find('.goodsAddBtn[data-modal="' + thisData + '"]');
                
                var existingSwiper = dataElem.closest('.md').find('.swiper')[0];
                if (existingSwiper && existingSwiper.swiper) {
                    existingSwiper.swiper.destroy();
                }
                
                dataElem.closest('.md').find('.swiper-notification').remove();
                if ($('.product-list input[type="checkbox"]:checked').length > 0) {
                    dataElem.parent('.btnWrap').siblings('.swiper-inner').find('.swiper-wrapper .no-img').closest('.swiper-slide').remove();
                }
        
                $('.product-list input[type="checkbox"]:checked').each(function() {
                    var parentLi = $(this).closest('li');
                    var clonedSlide = parentLi.find('.swiper-slide').clone();
                    dataElem.closest('.md').find('.swiper-wrapper').append(clonedSlide);
                    dataElem.closest('.md').children('.swiper-inner').removeClass('swiperIsEnd');
                });
                
                cp.moduleBox.initializeSwiper(dataElem.closest('.md').find('.swiper'));
                // cp.modalPop.closePop($(this));
        
                $('.product-list input[type="checkbox"]').prop('checked', false);
        
                setTimeout(function() {
                    $('.btn-registration-pop').removeClass('btn-close-pop');
                }, 100);
            });
        },

        initializeSwiper: function(swiperContainer) {
            
            $(swiperContainer).each(function() {
                var slidesCount = $(this).find('.swiper-slide').length;
                var slidesPerView = slidesCount > 1 ? 2 : 1; 
                // var loopEnabled = slidesPerView > 1 && slidesCount >= 3;
                // var loopOption = loopEnabled ? true : false;
                var swiperCase = $(this).parents('.md').attr('swiper-case');
            
                if (swiperCase === 'PerView2') {
                    slidesPerView = 2;
                } else if (swiperCase === 'PerView1.5') {
                    slidesPerView = 1.5;
                } else if (swiperCase === 'PerView1') {
                    slidesPerView = 1;
                }

                var swiperInstance = new Swiper(this, {
                    loop: false,
                    slidesPerView: slidesPerView,  
                    spaceBetween: 10, 
                    //autoplay: true,
                    pagination: {
                        el: '.swiper-pagination',
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });

                swiperInstance.on('slideChange', function () {
                    var swiperInner = $(swiperInstance.el).parent('.swiper-inner');

                    if (swiperInstance.isEnd) {
                        swiperInner.addClass('swiperIsEnd');
                    } else {
                        swiperInner.removeClass('swiperIsEnd');
                    }
                });
            });
            
        }, 


        resetSwipers: function() {
            $(document).ready(function() {
                var initialSwipers = $('.section .swiper');
                initialSwipers.each(function() {
                    if (!$(this).hasClass('swiper-initialized')) {
                        var swiperInstance = COMPONENT_MD.moduleBox.initializeSwiper(this);
                        $(this).addClass('swiper-initialized').data('swiper', swiperInstance); 
                    }
                });
            });
        },
        
        
    };
    /* imgCrop plugin */
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    cp.generateUniqueId = generateUniqueId;

    cp.imgCrop = {
        init: function () {
            this.openCropImg();
        },
        openCropImg: function (dataType) {
            function loadCropModal($imgWrap) {
                $('.cropModalWrap').load('../../asset/_module/modal.html', function () {
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
            }
        
            $('.imgWrap').on('click', function(){
                var $imgWrap = $(this);

                if (!$imgWrap.is('.img-background')) {
                    loadCropModal($imgWrap);
                }
            });
        
            $('.btnAddImg').off('click').on('click', function(){
                //var dataType = $(this).closest('.option-wrap').data('type');
                var $md = $('.md[data-module="' + dataType + '"]');
                var $imgWraps = $md.children('.imgWrap');
                console.log(dataType)
            
                $imgWraps.each(function() {
                    var $imgWrap = $(this);
                    loadCropModal($imgWrap);
                });
            });
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
    /* module : video */
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
    /* FONT UI : color picker */
    cp.colorEdit = {
        init: function() {
            this.spectrumColor();
            this.colorSelect();
            this.spectrumGrColor();
        },
        spectrumColor: function(initialColor) {
            var self = this;
            $(".editColor").spectrum({
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
                    self.fontColor(selectedColor);
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
            var self = this;
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
                    self.bgColor(selectedBgColor, moduleType);
                }
            });
        },
        bgColor: function(selectedBgColor, moduleType) {
            $('.section').find('.md').each(function() {
                if ($(this).data('module') === moduleType) {
                    $(this).css('background-color', selectedBgColor);
                }
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
                $("#thumnail").show();
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
                setTimeout(function(){
                    $("#thumnail").hide();
                })
            }
        },
        imgColorSelect: function(dataType) {
            $('body').off('click').on('click', '#palette div', function(event){
                if ($(event.target).is('div')) {
                    var rgbColor = $(event.target).css('background-color');
                    var selectedBgColor = rgbToHex(rgbColor);
                    var $p = $('<p></p>').text('Selected color: ' + selectedBgColor);
                    
                    $('#palette p').remove();
                    $('#palette').append($p);

                    cp.colorEdit.bgColor(selectedBgColor, dataType);
                    cp.colorEdit.spectrumBgColor(dataType, selectedBgColor);
                }
                
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
        colorSelect: function() {
            $('.color-selbox input[name="colorSelect"]').change(function() {
                var selectedOption = $(this).val();
                var dataType = $(this).closest('.option-wrap').data('type');

                $('.md[data-module="' + dataType + '"]').find('.tab a').css('color', selectedOption);
            });
        },
        spectrumGrColor: function(initialColor) {
            $(document).ready(function(){
                $(".txtBgColor").spectrum("destroy");
                $(".txtBgColor").spectrum({
                    flat: false,
                    showInput: true,
                    preferredFormat: "hex",
                    showInitial: true,
                    showPalette: true,
                    showSelectionPalette: true,
                    maxPaletteSize: 10,
                    color: initialColor,
                    showAlpha: true,
                    showAlphaPalette: true,
                    change: function(color) {
                        var selectedColor = color.toRgbString();
                        cp.colorEdit.txtBgColor(selectedColor);
                    }
                });
            });
        },
        txtBgColor:function(selectedColor) {
            $('.txtBgColor').off('change').each(function() {
                $(this).on('change', function() {
                    var dataType = $(this).closest('.option-wrap').data('type');
                    console.log('dataType:', dataType);
                    var $txtEditBg = $('.md[data-module="' + dataType + '"]').find('.txtEditBg');
                    
                    if ($txtEditBg.length > 0) {
                        $txtEditBg.css('background', 'linear-gradient(to top, ' + selectedColor + ', transparent)');
                    }
                });
            });
        }
    };
    /* FONT UI : Text */
    cp.fontEditer = {
        init: function() {
            //this.fontBold();
            //this.fontSize();
            this.editOpen();
            this.textHide();
        },
/*         fontBold: function() {
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
        }, */
/*         fontSize: function() {
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
        }, */
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
                    $this.prev('.textEditerWrap').load('../../asset/_module/text-edit.html', function(){
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
        },
        textHide: function() {
            $('.inpUse input').change(function() {
                var radioValue = $(this).val();
                var radioName = $(this).attr('name');
                var dataType = $(this).closest('.option-wrap').data('type');
                var $txtEdit = $('.md[data-module="' + dataType + '"]').find('.txtEdit');
                
                if (radioValue === "disuse") {
                    $txtEdit.each(function(){
                        $(this).find('[data-text="' + radioName + '"]').each(function() {
                            $(this).hide();
                        });
                    })
                } else {
                    $txtEdit.each(function(){
                        $(this).find('[data-text="' + radioName + '"]').each(function() {
                            $(this).show();
                        });
                    })
                }
            });
        }
    };
    /* module : countdown */
    cp.countdownEdit = {
        init: function() {
            this.bindEvents();
        },
        bindEvents: function() {
            $('#countdownDate').change(this.startCountdown);
            $('#countdownTime').change(this.startCountdown);
        },
        startCountdown: function() {
            var inputDate = $('#countdownDate').val();
            var inputTime = $('#countdownTime').val();
            
            if (inputDate) {
                var targetDate = new Date(inputDate);
                var targetTime = targetDate.setHours(0, 0, 0, 0); // 날짜만 설정된 경우 0시로 설정
    
                if (inputTime) {
                    var timeParts = inputTime.split(":");
                    targetTime += parseInt(timeParts[0]) * 60 * 60 * 1000;
                    targetTime += parseInt(timeParts[1]) * 60 * 1000;
                }
                
                cp.countdownEdit.updateCountdown(targetTime);
            } else {
                alert("날짜를 입력하세요.");
            }
        },
        updateCountdown: function(targetTime) {
            clearInterval(cp.countdownInterval); // 기존의 카운트다운 인터벌 제거
            cp.countdownInterval = setInterval(function() {
                var currentTime = new Date().getTime();
                var distance = targetTime - currentTime;
    
                if (distance <= 0) {
                    clearInterval(cp.countdownInterval);
                    $('#countdown').text("카운트다운 종료");
                } else {
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    //var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    var daysStr = days.toString().padStart(2, '0');
                    var hoursStr = hours.toString().padStart(2, '0');
                    var minutesStr = minutes.toString().padStart(2, '0');
                    //var secondsStr = seconds.toString().padStart(2, '0');
                    $('#countdown .cdDate').html(daysStr);
                    $('#countdown .cdTime').html(hoursStr);
                    $('#countdown .cdMinute').html(minutesStr);
                }
            }, 1000); // 1초마다 갱신
        }
    };
    
    

    cp.init = function () {
        cp.optionEdit.init();
        cp.moduleBox.init();
        cp.imgCrop.init(); // img crop
        cp.videoModule.init(); // video insert    
        cp.colorEdit.init();
        cp.fontEditer.init();
        cp.countdownEdit.init();
    };

    cp.init();
    return cp;
}(window.COMPONENT_MD || {}, jQuery));
