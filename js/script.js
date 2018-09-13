$(function () {
    function local() {
        localStorage['page'] = $('#wrap').html();
    }
    $(".card-area").eq(0).hide(); //title-form이 포함된 .card-area 숨김
    $(document).on("click", ".list-add-btn", function () { //+add a list 버튼 클릭 시
        $(this).parent().hide(); //addBtn이 포함된 .add-list 숨김
        $(".card-area").eq(0).show(); ///title-form이 포함된 .card-area 보여줌
    })

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
            }) ///title-form이 포함된 .card-area 보이게 함
        }
    })

    $(document).on("click", "#cancel-btn", function () {
        $(".card-area").eq(0).hide(); //title-form이 포함된 .card-area 숨기고
        $(".card-area").eq(0).find("#input-value").val(''); //card-area>title-form>form-input 내에 input text 값 비우기
        $(".card-area").eq(1).show(); //add-list가 포함된 .card-area 보이게 함
    })

});