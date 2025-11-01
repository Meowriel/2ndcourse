let apply = function(form) {

    let data = {
        company: form.elements.company.value,
        fio: form.elements.fio.value,
        position: form.elements.position.value,
        phone: form.elements.phone.value,
        email: form.elements.email.value,
        secondphone: form.elements.secondphone.value,
        address: form.elements.address.value,
    }

    document.getElementById('result-company').innerHTML = data.company;
    document.getElementById('result-fio').innerHTML = data.fio;
    document.getElementById('result-position').innerHTML = data.position;
    document.getElementById('result-phone').innerHTML = data.phone;
    document.getElementById('result-second-phone').innerHTML = data.secondphone;
    document.getElementById('result-email').innerHTML = data.email;
    document.getElementById('result-address').innerHTML = data.address;

    let emailCheck = document.getElementById("emailCheckbox")
    let addressCheck = document.getElementById("addressCheckbox")
    let addressResult = document.getElementById("result-address")
    let emailResult = document.getElementById("result-email")

    if (emailCheck.checked) {
        emailResult.style.display = "block";
    } else {
        emailResult.style.display = "none";
    }

    if (addressCheck.checked) {
        addressResult.style.display = "block";
    } else {
        addressResult.style.display = "none";
    }

    let fioResult = document.getElementById('result-fio');
    let fioAlign = form.elements.fio_align.value;
    fioResult.style.textAlign = fioAlign;
    let fioSize = form.elements.fio_size.value;
    fioResult.style.fontSize = fioSize;

    let positionResult = document.getElementById('result-position');
    let positionAlign = form.elements.position_align.value;
    positionResult.style.textAlign = positionAlign;
    let positionSize = form.elements.position_size.value;
    positionResult.style.fontSize = positionSize;

    let fioColor = form.elements.fio_color.value;
    let fioColorResult = document.getElementById('result-fio');
    fioColorResult.style.color = fioColor;

    let positionColor = form.elements.position_color.value;
    let positionColorResult = document.getElementById('result-position');
    positionColorResult.style.color = positionColor;

    let chk = document.getElementById("chk");
    if (chk && chk.checked) {
        document.getElementById('result-second-phone').style.display = "block";
    } else {
        document.getElementById('result-second-phone').style.display = "none";
    }
}