
const disBox = document.getElementById('box')
const spinner = document.getElementById('spinner-box')
const load_more = document.getElementById('load-btn')
const endBox = document.getElementById('endBox')

// to submit a form
const postform = document.getElementById('post-form')
const title = document.getElementById('id_title')
const body = document.getElementById('id_body')

// alert box
const alertBox = document.getElementById('alert-box')
// grab csrf_tocken
const csrf = document.getElementsByName('csrfmiddlewaretoken')

// grab the current url
const url = window.location.href


// variables to control the visibilite of dropzone
const dropozone = document.getElementById('my-dropzone')
const addBtn = document.getElementById('add-btn')
const closeBtns = [...document.getElementsByClassName('add-modal-close')]




const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');









// unlike and like function
const likeUnlikePosts = () => {
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')]
    // console.log(likeUnlikeForms)

    likeUnlikeForms.forEach(form => form.addEventListener('submit', e=>{
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id')
        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)

        $.ajax({
            type: 'POST',
            url: '/like-unlike/',
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickedId,
            },
            success: function(response){
                console.log(response)

                clickedBtn.textContent = response.liked ? `Unlike ${response.count}` : `Like ${response.count}`
            },
            error: function(error){
                console.log(error)
            }
        })

    }))

}









// 
let visible = 4

// function to get data
const getData = () => { 
$.ajax ({
    type: 'GET',
    url : `/data/${visible}`,
    success : function(response){  
    console.log('success', response)

    setTimeout( ()=>{
        spinner.classList.add('not-visible')
        const data = response.data
        console.log(data)
        data.forEach(el => {
    
            disBox.innerHTML += `
            <div class="card col-md-4" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${el.title}</h5>
                <p class="card-text">${el.body}</p>

                </div>
                
                <div class="card-footer">
                <div class="row">

                <div class="col-6">
                <a href="${url}${el.id}" class="card-link btn btn-primary">Details</a>
                </div>

                <div class="col-6">
                <form class = "like-unlike-forms" data-form-id="${el.id}">
                
                <button  class=" btn btn-primary" id="like-unlike-${el.id}">${el.liked ? `Unlike ${el.count}` : `Like ${el.count}`} </button>
                </form>
                </div>
                </div>
                </div>      
            </div>
            `
        });
        // like and unlike function
        likeUnlikePosts()
    }, 1000 )

    // check if there is more to load or not
    console.log(response.size)
    if (response.size === 0){
        endBox.textContent = 'No posts added yet ...'
    }else if (response.size <= visible){
        load_more.classList.add('not-visible')
        endBox.textContent = 'No posts added yet ...'
    }
       
    },
    error: function(error){
        console.log('error',error)
    }
})
}


// call get data
getData()

// create  listener to the load more button
load_more.addEventListener('click', ()=>{
    spinner.classList.remove('not-visible')
    visible += 4
    getData()
})



// variable to work with dropzone
let newPostId = null




// add listener on the form
postform.addEventListener('submit', e=>{
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': title.value,
            'body': body.value
        },
        success:function(response){
            // console.log(response)
            newPostId = response.id
            disBox.insertAdjacentHTML('afterbegin', `
                            <div class="card col-md-4" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">${response.title}</h5>
                                <p class="card-text">${response.body}</p>
                                </div>
                                <div class="card-footer">
                                <div class="row">

                                <div class="col-6">
                                <a href="${url}${response.id}" class="card-link btn btn-primary">Details</a>
                                </div>

                                <div class="col-6">
                                <form class = "like-unlike-forms" data-form-id="${response.id}">
                                
                                <button  class=" btn btn-primary" id="like-unlike-${response.id}">Like (0) </button>
                                </form>
                                </div>
                                </div>
                                </div>      
                            </div>

            `)

        // like and unlike function
        likeUnlikePosts()

        // hide the model after post using JQuery within bootstrapp 
        // $('#addPostModal').modal('hide')

        // add alert
        handleAlerts('success', 'Post added')

        // reset form
        // postform.reset()

        },
        error:function(error){
            console.log(error)
            handleAlerts('danger', 'opps ..... something went rwong')
        }
    })
})







// alert if the iterm deleted through loca massages
const deleted = localStorage.getItem('title')
if (deleted){
    handleAlerts('danger', `deleted "${deleted}"`)
    localStorage.clear()
}


// definition of function when the button is clicked make visible
// the dropzone
addBtn.addEventListener('click', ()=>{
    dropozone.classList.remove('not-visible')
})

// reset the form when click on close or when submit the form
closeBtns.forEach(btn=> btn.addEventListener('click', ()=>{
    postform.reset()
    if(!dropozone.classList.contains('not-visible')){
        dropozone.classList.add('not-visible')
    }
    // reset our dropzone
    const myDropzone = Dropzone.forElement("#my-dropzone")
    myDropzone.removeAllFiles(true)
}))

// confg dropozone
Dropzone.autoDiscover = false
const myDropzone = new Dropzone('#my-dropzone', {
    url: 'upload/',
    init: function(){
        this.on('sending', function(file, xhr, formData){
            formData.append('csrfmiddlewaretoken', csrftoken)
            formData.append('new_post_id', newPostId)
        })
    },
    maxfiles: 5,
    maxFilesize: 4,
    acceptedfiles: '.png'

})



