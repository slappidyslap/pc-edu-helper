import { ipcRenderer } from "electron";

const modalBody = document.querySelector('#configureHintsModal').querySelector('.modal-body');
const formControlSubjectBody = modalBody.children[0];
const formControlTeacherBody = modalBody.children[1];
let datalistSubject;
let datalistTeacher;

ipcRenderer.on('datalist', (evt, message) => {
    datalistSubject = message.subjects;
    datalistTeacher = message.teachers;
    const datalistSubjectElement = document.querySelector('#datalistSubjects');
    datalistSubject.forEach(s => {
        datalistSubjectElement.insertAdjacentHTML('afterbegin', `<option value="${s}" />`);
        formControlSubjectBody.insertAdjacentHTML('afterbegin', formControlTemplate(s));
    })
    const datalistTeachersElement = document.querySelector('#datalistTeachers');
    datalistTeacher.forEach(t => {
        datalistTeachersElement.insertAdjacentHTML('afterbegin', `<option value="${t}" />`);
        formControlTeacherBody.insertAdjacentHTML('afterbegin', formControlTemplate(t));
    })
})

const removes = {0: [], 1: []};
document.querySelector('#configureHintsModal').addEventListener('click', (event) => {
    if (event.target.closest('.btn-sm'))
        event.target.closest('.btn-sm').insertAdjacentHTML('beforebegin', formControlTemplate(""))
    if (event.altKey && event.target.closest('.form-control')) {
        const formControl = event.target.closest('.form-control');
        formControl.classList.add('d-none');
        removes[formControl.parentElement.dataset.col].push(formControl)
    }
})

document.querySelector('#configureHintsBtn').addEventListener('click', () => showFormControls(removes));

document.querySelector('#saveHintsBtn').addEventListener('click', () => {
    datalistSubject = fetchValuesFromFormControls(formControlSubjectBody.children)
    datalistTeacher = fetchValuesFromFormControls(formControlTeacherBody.children)
    ipcRenderer.send('new-datalist', {subjects: datalistSubject, teachers: datalistTeacher})
})

function fetchValuesFromFormControls(formControls) {
    const values = new Set();
    for (let i = formControls.length - 1; i >= 0; i--) {
        if (formControls[i].closest('button') || formControls[i].classList.contains('d-none')) continue;
        values.add(formControls[i].value);
    }
    return Array.from(values);
}

function formControlTemplate(value) {
    return `<input class="form-control form-control-sm" type="text" value="${value}"/>`;
}

function showFormControls(objectOfForms) {
    objectOfForms[0].forEach(f => f.classList.remove('d-none'))
    objectOfForms[1].forEach(f => f.classList.remove('d-none'))
}