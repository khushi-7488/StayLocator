(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

//  auto fade flash
document.addEventListener("DOMContentLoaded", () => {
    const flashMessages = document.querySelectorAll(".alert")
    flashMessages.forEach((message) => {
        setTimeout(() => {
            message.classList.add("fade-out");
            message.remove();
        }, 2000)
    })
})
