$(function () {

    $(".card-area").eq(-2).hide(); //title-form이 포함된 .card-area 숨김
    $(document).on("click", ".add-btn", function () { //+add a list 버튼 클릭 시
        e.preventDefault();
        $(this).parent().hide(); //addBtn이 포함된 .add-list 숨김
        $(".card-area").eq(-2).show(); ///title-form이 포함된 .card-area 보여줌
    })

    $(document).on("click", "#cancel-btn", function () {
        $(".card-area").eq(0).hide(); //title-form이 포함된 .card-area 숨기고
        $(".card-area").eq(0).find("#input-value").val(''); //card-area>title-form>form-input 내에 input text 값 비우기
        $(".card-area").eq(1).show(); //add-list가 포함된 .card-area 보이게 함
    })
});