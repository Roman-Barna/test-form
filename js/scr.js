// jQuery
$(() => {

    // fuctions
    const valid = (input, pattern) => {
        const valid = pattern.test(input.val())
        disabledSubmit()
        changeNumber()
        valid ? input.removeClass("error") : input.addClass("error")
        valid ? input.next().slideUp(200) : input.next().slideDown(200)
        return valid ? true : false
    }

    const disabledSubmit = () => {
        const disabledBtn = inputs.every(el => el.pattern.test(el.element.val()))
        const auditAllField = disabledBtn && formConsent.is(":checked") && PhoneField.isValidNumber()
        formBtnSubmit.attr("disabled", !auditAllField)
    }

    const inputBlur = (input, pattern) => {
        input.on('blur', () => valid(input, pattern))
    }

    const initializeTheForm = (callback) => {
        inputs.forEach(el => callback(el.element, el.pattern))
        formConsent.on("change", disabledSubmit)
        formNumberInput.on("input", changeNumber)
    }

    const changeNumber = () => {
        PhoneField.isValidNumber() ? formNumberInput.removeClass("error") : formNumberInput.addClass("error")
        PhoneField.isValidNumber() ? formNumberInput.parent().next().slideUp(200) : formNumberInput.parent().next().slideDown(200)
        disabledSubmit()
    }

    const optionPhoneField = () => {
        return window.intlTelInput(document.querySelector("#form-number"), {
            separateDialCode: true,
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.0/build/js/utils.js",
            initialCountry: "auto",
            responsiveDropdown: true,
            geoIpLookup: function (callback) {
                axios.get("https://ipapi.co/json")
                    .then(res => callback(res.data.country_code))
                    .catch(() => callback("us"));
            }
        });
    }

    const sendMessage = () => {
        const params = {
            name: formNameInput.val(),
            email: formEmailInput.val(),
            phone: PhoneField.getNumber()
        }

        alertify.set('notifier', 'position', 'bottom-right');
        // loading
        loading.css("display", "flex")
        emailjs.send(serviceID, templateID, params)
            .then(res => {
                alertify.success("Повідомлення відправлено");
                loading.css("display", "none")
                inputs.forEach(el => el.element.val(""))
                formNumberInput.val("")
            })
            .catch(err => alertify.error("Сталась помилка"))
    }

    const submit = () => {
        formBtnSubmit.on('click', (event) => {
            event.preventDefault()
            const validation = inputs.every(el => el.pattern.test(el.element.val()))
            validation ? sendMessage() : initializeTheForm(valid)
        })
    }

    // create variables

    // form field
    const formEmailInput = $('#form-email');
    const formNameInput = $('#form-name');
    const formNumberInput = $("#form-number")
    const formBtnSubmit = $('#form-submit')
    const formConsent = $('#form-consent')
    const PhoneField = optionPhoneField()

    // loading
    const loading = $(".wrapper-loading")

    // email service
    const serviceID = "service_a7aqpmm"
    const templateID = "template_tqswlo8"
    // activate key
    emailjs.init("AYtb0b3JbjcL9spuh")

    const inputs = [
        {
            element: formNameInput,
            pattern: new RegExp(/^[a-zA-Zа-яА-Я ]{8,30}$/)
        },
        {
            element: formEmailInput,
            pattern: new RegExp(/^[a-zA-Z][a-z0-9]+@[a-z]+\.[a-z]{2,3}$/)
        },
    ]

    // call functions once

    initializeTheForm(inputBlur)
    submit()
})