const postBox = document.getElementById('post-box')
const back_id = document.getElementById('back-btn')
const deleteBtn = document.getElementById('delete-btn')
const updateBtn = document.getElementById('update-btn')

// urls
const url = window.location.href +"data/"
const updateUrl = window.location.href +"update/"
const deleteUrl = window.location.href +"delete/"

// grab csrf_tocken
const csrf = document.getElementsByName('csrfmiddlewaretoken')

// Grab forms
const updateForm = document.getElementById('update-form')
const deleteForm = document.getElementById('delete-form')

const spinner = document.getElementById('spinner-box')
const inputtitle = document.getElementById('id_title')
const inputbody = document.getElementById('id_body')


// back with JS
// back_id.addEventListener('click', ()=>{
//     history.back()
// })



$.ajax({
    type: 'GET',
    url: url,
    success: function(response){
        console.log(response)
        const data = response.data

        // delete and update button are accually invisible
        // those code check if the the logged_in user is the same as author and make visible the button once is equal
        if(response.data.logged_in !== response.data.author){
            console.log("different ")
        } else {
            console.log("the same")
            deleteBtn.classList.remove('not-visible')
            updateBtn.classList.remove('not-visible')
        }

        const titleEl = document.createElement('h3')
        titleEl.setAttribute('class', 'mt-3')
        titleEl.setAttribute('id', 'title')

        const bodyEl = document.createElement('p')
        bodyEl.setAttribute('class', 'mt-1')
        bodyEl.setAttribute('id', 'body')

        titleEl.textContent = data.title 
        bodyEl.textContent = data.body

        postBox.appendChild(titleEl)
        postBox.appendChild(bodyEl)

        // add text to form
        inputtitle.value = data.title
        inputbody.value = data.body



        spinner.classList.add('not-visible')

    },
    error: function(error){
        console.log(error)
    }
})


// update 

updateForm.addEventListener('submit', e=>{
    e.preventDefault()

    const title = document.getElementById('title')
    const body = document.getElementById('body')

    $.ajax({
        type: 'POST',
        url: updateUrl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': inputtitle.value,
            'body': inputbody.value,
        },
        success: function(response){
            console.log(response)
            // handleAlerts('success', 'Post added')
            title.textContent = response.title 
            body.textContent = response.body

            // hide the model after post using JQuery within bootstrapp 
            $('#updatePostModal').modal('hide')

        },
        error: function(error){
            console.log(error)
        }
    })

})


// delete
deleteForm.addEventListener('submit' , e=>{
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: deleteUrl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
        },
        success: function(response){
            // redirect to the home page
            window.location.href = window.location.origin
            localStorage.setItem('title', inputtitle.value)

        },
        error: function(error){
            console.log(error)
        }
    })

})

