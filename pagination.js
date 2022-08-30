// generate pagination buttons
export function pageButtons(pages, state) {
    const btnWrapper = document.querySelector('.pagination');
    btnWrapper.innerHTML = '';

    let maxLeft = (state.page - Math.floor(state.window/2))
    let maxRight = (state.page + Math.floor(state.window/2))

    if(maxLeft < 1){
        maxLeft = 1
        maxRight = state.window
    }
    if(maxRight > pages){
        maxLeft = pages - (state.window - 1)

        maxRight = pages

        if(maxLeft<1){
            maxLeft = 1
        }
    }
 
     for (let page = maxLeft; page<=maxRight; page++) {
        if(state.page === page) {
         btnWrapper.innerHTML += `<button value="${page}" class="page pagination__number activeNumber me-5">${page}</button>`
        } else {
         btnWrapper.innerHTML += `<button value="${page}" class="page pagination__number me-5">${page}</button>`  
        }
     }

     if(state.page !=1){
        btnWrapper.innerHTML = `<button value="${1}" class="page pagination__start me-5">First</button>` + btnWrapper.innerHTML
     }

     if(state.page !=pages){
        btnWrapper.innerHTML += `<button value="${pages}" class="page pagination__end">Last</button>`
     }


 } 


//  paginate dataset 
export function pagination(dataset, page, rows) {
    const trimStart = (page -1) * rows
    const trimEnd = trimStart + rows
    const pages = Math.ceil(dataset.length /rows)

    const trimmedData = dataset.slice(trimStart, trimEnd)

    return {
        trimmedData,
        pages
    }

}