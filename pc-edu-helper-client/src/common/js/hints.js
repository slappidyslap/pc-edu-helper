import { ipcRenderer } from "electron";

const modalBody = document.querySelector('#configureHintsModal').querySelector('.modal-body');
const formControlSubjectBody = modalBody.children[0];
const formControlTeacherBody = modalBody.children[1];
let datalistSubject;
let datalistTeacher;

ipcRenderer.once('datalist', (evt, message) => {
    datalistSubject = message.subjects;
    datalistTeacher = message.teachers;
    const datalistSubjectElement = document.querySelector('#datalistSubjects');
    datalistSubject.forEach(s => {
        datalistSubjectElement.insertAdjacentHTML('afterbegin', `<option value="${s}" />`);
    })
    const datalistTeachersElement = document.querySelector('#datalistTeachers');
    datalistTeacher.forEach(t => {
        datalistTeachersElement.insertAdjacentHTML('afterbegin', `<option value="${t}" />`);
    })
})

document.querySelector('#configureHintsModal').addEventListener('click', (event) => {
    if (event.target.closest('.btn-sm'))
        event.target.closest('.btn-sm').insertAdjacentHTML('beforebegin', formControlTemplate(""))
    if (event.altKey && event.target.closest('.form-control'))
        event.target.closest('.form-control').remove();
})

document.querySelector('#saveHintsBtn').addEventListener('click', () => {
    datalistSubject = fetchValuesFromFormControls(formControlSubjectBody.children)
    const datalistSubjectElement = document.querySelector('#datalistSubjects');
    datalistSubjectElement.innerHTML = '<option value="НЕТ" />'; // оно по умол. имеет этот элемент
    datalistSubject.forEach(s => {
        datalistSubjectElement.insertAdjacentHTML('afterbegin', `<option value="${s}" />`);
        formControlSubjectBody.insertAdjacentHTML('afterbegin', formControlTemplate(s));
    })

    datalistTeacher = fetchValuesFromFormControls(formControlTeacherBody.children)
    const datalistTeachersElement = document.querySelector('#datalistTeachers');
    datalistTeachersElement.innerText = '';
    datalistTeacher.forEach(t => {
        datalistTeachersElement.insertAdjacentHTML('afterbegin', `<option value="${t}" />`);
    })

    sendDataToMain({subjects: datalistSubject, teachers: datalistTeacher})
})

document.querySelector('#configureHintsBtn').addEventListener('click', (event) => {
    formControlSubjectBody.innerHTML = '<button type="button" class="btn btn-danger btn-sm">Добавить</button>';
    formControlTeacherBody.innerHTML = '<button type="button" class="btn btn-danger btn-sm">Добавить</button>';
    
    datalistSubject.forEach(s => {
        formControlSubjectBody.insertAdjacentHTML('afterbegin', formControlTemplate(s));
    })

    datalistTeacher.forEach(t => {
        formControlTeacherBody.insertAdjacentHTML('afterbegin', formControlTemplate(t));
    })
})

function sendDataToMain(data) {
    ipcRenderer.send("new-datalist", data)
}

function fetchValuesFromFormControls(formControls) {
    const values = [];
    for (let i = formControls.length - 1; i > 0; i--) { // Надо так, чтобы прежний порядок остался
        if (formControls[i].closest('button')) continue;
        values.push(formControls[i].value);
    }
    return values;
}

function formControlTemplate(value) {
    return `<input class="form-control form-control-sm" type="text" value="${value}"/>`;
}