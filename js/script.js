$(function () {
    function local() {
        localStorage['page'] = $('#wrap').html();
    }

    /*파일정보 읽어오기*/
    function upfile(file) {
        f_type = file.type;
        if (f_type != 'image/jpeg' && f_type != 'image/png' && f_type != 'image/gif'){ //파일 타입 확인
            alert('JP(E)G, PNG, GIF 이미지 파일만 사용 가능합니다.');
            return false;
        }
        var fr = new FileReader();
        fr.readAsDataURL(file); //파일 정보 읽음
        fr.onload = function (e) {
            img_chk = false;    //정상적으로 이미지가 로드될 시 다시 이미지 선택 못함.
            img_data = e.target.result;
            in_img(img_data);
        }
    }

    function in_img(img_data) { //캔버스 생성 및 이미지 삽입
        var img = new Image();
        img.src = img_data;
        img.onload = function () {
            re = resize(img.width, img.height, 500, 300); //캔버스 사이즈에 맞게 리사이즈
            re2 = resize(img.width, img.height, 230, 200); //카드 추가 시 사이즈를 미리 여기서 받음
            $("#image_area").css({"width":+re[0]+"px","height":+re[1]+"px","border":"none"}); //이미지 영역을 캔버스 사이즈랑 맞춤

            var add_div = "<canvas id='canvas' width='"+re[0]+"' height='"+re[1]+"' style='position:absolute; left:0; top:0'></canvas>";
            $("#image_area").html(add_div);
            ctx = $("#canvas")[0].getContext("2d"); //캔버스에 접근
            ctx.drawImage(img,0,0,re[0],re[1]); //이미지 삽입
        }
    }

    function sort_ok(){
        $(".cardList").sortable({
            connectWith: ".card-area",
            cursor:'pointer',
            placeholder:"ui-state-highlight",
            revert:true,
            start: function(e,ui){ ui.item.animate({borderRadius:"25px"},{
                step: function () {
                    $(this).css("transform", "rotate(20deg)");
                },
            },100)},
            stop:  function(e,ui){ui.item.animate({borderRadius:"5px"},{
                step: function () {
                    $(this).css("transform", "rotate(0deg)");
                },
            },100)},
        });
    }

    function resize(width, height, wsize, hsize) {
        var p_width = width/wsize;
        var p_height = height/hsize;

        if (p_width > 1 || p_height > 1){
            if (p_width > p_height){
                p_height = p_height/p_width;
                p_width = 1;
            }else {
                p_width = p_width/p_height;
                p_height = 1;
            }
        }
        return [p_width*wsize, p_height*hsize];
    }

    $(".card-area").eq(0).hide(); //title-form이 포함된 .card-area 숨김
    $(document).on("click", ".list-add-btn", function () { //+add a list 버튼 클릭 시
        $(this).parent().hide(); //addBtn이 포함된 .add-list 숨김
        $(".card-area").eq(0).show(); ///title-form이 포함된 .card-area 보여줌
    });

    $(document).on("click", "#ok-btn", function () {
        var inputVal = $(".card-area").eq(0).find("#input-value").val(); //card-area>title-form>form-input 내에 input text 값 가져오기
        if($(".card-area").eq(0).find("#input-value").val() == ""){
            alert("제목을 입력하여 주세요.");
        }
        else {
            var addedList =
                '<div class="card-area">' +
                    '<div class="list-form">' +
                        '<div class="w100">' +
                            '<span class="list-title">' + inputVal + '</span>' +
                            '<input type="button" value="X" class="delete-btn">' +
                        '</div>' +
                        '<div class="w100">' +
                            '<input type="button" value="사진 이어보기" class="picview-btn" onclick="viewPicSlide(this);">' +
                        '</div>' +
                        '<div class="list-card"></div>'+
                        '<input type="button" value="+Add a card" class="card-add-btn" onclick="openPopupAddCard(this);">'+
                    '</div>'+
                '</div>';

            $("#wrap").prepend(addedList);
            $('.card-area').eq(0).hide().show("fade", 1000, function () {
                local();
            }); //title-form이 포함된 .card-area 보이게 함.

            $(".card-area").eq(0).hide(); //title-form이 포함된 .card-area 숨기고
            $(".card-area").eq(0).find("#input-value").val(''); //card-area>title-form>form-input 내에 input text 값 비우기
            $(".card-area").eq(1).show(); //add-list가 포함된 .card-area 보이게 함
        }
    });

    $(document).on("click", "#cancel-btn", function () {
        $(".card-area").eq(0).hide(); //title-form이 포함된 .card-area 숨기고
        $(".card-area").eq(0).find("#input-value").val(''); //card-area>title-form>form-input 내에 input text 값 비우기
        $(".card-area").eq(1).show(); //add-list가 포함된 .card-area 보이게 함
    });


    img_chk = true;
    brush_chk = false;
    line_chk = false;

    document.body.ondragover = function (event) {
        return false;
    };

    document.body.ondrop = function (e) { //드롭으로 이미지 넣을 때
        if(e.target.id == "image-area" && img_chk == true){ //드롭된 부분의 아이디 확인, 이미지를 넣을 수 있는 조건이 될 때만 실행
            var file = e.dataTransfer.files[0];  // 파일 정보
            upfile(file);
        }
        return false;
    }

    $(document).on("click", "#image-area", function () { //클릭해서 파일 업로드할 때
        if (img_chk == true){
            $("#add-file").click();
        }
    });

    $(document).on("change", "#add-file", function (e) { // input type = 'file'의 값이 변경될 때
        var file = e.target.files[0];
        upfile(file);
    });

    $(document).on("click","#brush",function(e){ //캔버스에 이미지가 채워진 후에 브러쉬 버튼을 클릭해야 할 수 있음
        if(img_chk == false){
            brush_chk = true;
        }
    });

    $(document).on("click", "#plus, #minus", function (e) {
        if ($(this).val() == "+"){ //값이 +일때
            $("#px").val(parseInt($("#px").val())+1) //픽셀 값을 정수로 변환하고 +1씩 증가
        }else {
            if($("#px").val() == 1){
                alert("1px 미만의 값은 입력할 수 없습니다.");
                return false;
            }
            $("#px").val(parseInt($("#px").val())-1);
        }
    });

    brushBaseColor = "#f00"; //브러쉬 기본 색상 설정
    
    $(document).on("change", "#shape", function (e) { //브러쉬 색상 변경
        brushBaseColor = $(this).val();
    });
    
    $(document).on("mousedown", "#canvas", function (e) { //캔버스에 마우스 다운 시
        if (brush_chk == true){   //브러쉬를 선택한 상태가 되야함
            line_chk = true;    //라인을 그릴 수 있는 조건이 되야함
            ctx.beginPath();
            ctx.lineWidth = $("#px").val();
            ctx.strokeStyle = color;
            ctx.moveTo(e.offsetX, e.offsetY);
        }
    });

    $(document).on("mousemove", "#canvas", function (e) { //캔버스에서 마우스 이동할 때
        if (line_chk == true){  //라인을 그릴 수 있는 조건이 되면 라인을 그림
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });

    $(document).on("mouseup mouseleave", "#canvas", function (e) {  //캔버스에서 마우스업 또는 마우스리브 시
        if (line_chk == true){  //라인을 그릴 수 있는 조건에서만
            ctx.closePath();
            line_chk = false;   //캔버스에 그리기를 긑내고 라인을 그릴 수 있는 조건을 없앰
        }
    });

    $(document).on("click", ".delete-btn", function (e) {
        $(this).parent().parent().hide("fade", 1000, function () {
            $(this).remove();
            local();
        });
    });

    function openPopupAddCard(th){
        var div = "<div title='카드 추가'>";

        div += "<div class='form-group'>";
        div += "<input type='text' class='form-control' placeholder='카드 제목' id='title'>";
        div += "</div>";

        div += "<div class='form-group'>";
        div += "<textarea class='form-control' placeholder='설명' rows='3' id='comment'></textarea>";
        div += "</div>";

        div += "<div class='form-group'>";
        div += "<div id='image-area' style='position: relative;'>사진영역</div>";
        div += "<input type='file' id='add_file' style='display: none'>";
        div += "</div>";

        div += "<div class='form-group'>";
        div += "<input type='button' value='브러시' class='btn' id='brush'> &nbsp;&nbsp;&nbsp;";
        div += "<select id='sel_shape'>";
        div += "<option value='#ff0000'>RED</option>";
        div += "<option value='#00ff00'>GREEN</option>";
        div += "<option value='#0000ff'>BLUE</option>";
        div += "<option value='#ffff00'>YELLOW</option>";
        div += "<option value='#ff00f0'>PINK</option>";
        div += "<option value='#00fff0'>SKY BLUE</option>";
        div += "</select> &nbsp;&nbsp;&nbsp;";
        div += "<input type='text' size='3' value='1' readonly='readonly' id='px'> ";
        div += "<input type='button' value='+' class='btn' id='plus'> ";
        div += "<input type='button' value='-' class='btn' id='minus'> (px)";
        div += "</div>";

        div += "</div>";

        $(div).dialog({
            resizable: false,
            modal: true,
            width: 540,
            buttons: {
                "완료": function() {
                    var title =  $("#title").val();
                    var comment = $("#comment").val();



                    if(title == "" || comment == "" || img_chk == true){
                        alert("카드제목, 설명, 사진은 필수항목입니다.");
                        return false;
                    }

                    var image = $("#canvas")[0].toDataURL();



                    var div = '<div class="list-form">\n' +
                                '<div class="w100">\n' +
                                    '<span class="title">'+title+'</span>\n' +
                                    '<input type="button" value="X" class="delete-btn">\n' +
                                '</div>\n' +
                                '<img src="'+image+'" width="'+re2[0]+'" height="'+re2[1]+'">\n' +
                                '<p>'+comment+'</p></div>';

                    /*카드추가*/
                    $(th).parent().find(".card-list").append(div);
                    $(th).parent().find(".list-form").eq(-1).hide().show("fade", 1000,function () {
                        sort_ok();
                        local();
                    });

                    img_chk = true;
                    brush_chk = false;
                    line_chk = false;
                    brushBaseColor = "#f00";

                    $(this).dialog( "close" );
                    $(this).remove();

                },
                "취소": function() {
                    img_chk = true;
                    brush_chk = false;
                    line_chk = false;
                    brushBaseColor = "#f00";

                    $(this).dialog( "close" );
                    $(this).remove();
                }
            }
        });
    }
});