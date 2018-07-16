var dropdowntimer

$(function(){
    $(".young-dropdown-select .entry").mouseover(function(){
        $(".young-dropdown-select .list").css("display", "block")
    })
    $(".young-dropdown-select .entry").mouseleave(function(){
        dropdown_timer = setTimeout(() => {
            $(".young-dropdown-select .list").css("display", "none")
        }, 500);
    })
    $(".young-dropdown-select .list").mouseover(function(){
        console.log(1)
        clearTimeout(dropdown_timer)
    })
    $(".young-dropdown-select .list").mouseleave(function(){
        console.log(2)
        $(".young-dropdown-select .list").css("display", "none")
    })
})