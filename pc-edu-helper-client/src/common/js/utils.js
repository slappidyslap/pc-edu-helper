import { Modal } from 'bootstrap'

const FAIL_LOAD_TIME_TABLE = 'Вы пытаетесь загрузить замену'
const FAIL_LOAD_ZAMENA = 'Вы пытаетесь загрузить расписание'
const groupsDiv = document.querySelector(".groups");

export function isTodayAfterOrEqualsSeptember() {
    return new Date().getMonth() > 9
}

export function getYearByGroupName(groupName) {
    return groupName.split(" ")[1].split("-")[1]
}

export function getGroupTemplate(groupName) {
    return `
        <div>
            <div class="group__name" group-name="${groupName}">${groupName}</div>
            <div class="weeks">
                <div class="week-time-table">
                </div>
                <div class="week-time-table">
                </div>
                <div class="week-time-table">
                </div>
                <div class="week-time-table">
                </div>
                <div class="week-time-table">
                </div>
            </div>
        </div>`
}
export function getDataInputsTemplate(isNew) {
    return `
        <div class="data-inputs" data-id="${isNew ? 1 : 0}">
            <input type="text" list="datalistSubjects" class="subject-field"/>
            <input type="text" list="to-variants" class="to-field"/>
            <input type="text" list="datalistTeachers" class="teacher-field"/>
            <input type="text" class="audience-field"/>
        </div>
        `
}
export function getTimeTableListTemplate(weekName) {
    return `
        <div class="week">${weekName}</div>
        <div class="time-table__list">
        </div>
    `
}

const weeks = {
    0: "ПН",
    1: "ВТ",
    2: "СР",
    3: "ЧТ",
    4: "ПТ",
}
export function getWeekNameByNum(num) {
    return weeks[num]
}

export function getTimeTableItemTemplate(lessonNum) {
    return `
        <div class="time-table__item">
            <div class="time-table__item-num">
                <button class="btn-add-data-inputs1" lessonnum="${lessonNum}" data-lesson-num="${lessonNum}"></button>
            </div>
            <div>
                ${getDataInputsTemplate()}
            </div>
        </div>
        `
}

/* export function isValidAudience(audienceField) {
    return audienceField.value == "" ||
        audienceField.value in [...Array(64).keys()] ||
        audienceField.value.match(REGEX_VALID_SPECIFIC_AUDIENCE)
} */

export function setEmptyDataFields(element) {
    const children = element.parentElement.children
    for (let child of children) {
        child.style.border = 'none'
    }
    element.style.borderLeft = '1px solid #c04f4f69'
}
export function resetDataFields(element) {
    const children = element.parentElement.children
    for (let child of children) {
        child.style.border = '1px solid #c04f4f69'
    }
}

export function getLessonNumByElement(element) {
    return element.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.dataset.lessonNum
}

export function getWeekNameByInput(element) {
    return element.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerText
}

export function getDataInputIdByInput(input) {
    return input.parentElement.dataset.id;
}

export function isNotSameInput(input1, input2) {
    return input1 != input2
}

export function isNotBlank(element) {
    return element && element.value && element.value != "НЕТ"
}

export function isInputInSameLesson(input1, input2) {
    return (isTwoInputInSamePlace(input1, input2) &&
        getGroupNameByInput(input1) == getGroupNameByInput(input2) &&
        getDataInputIdByInput(input1) != getDataInputIdByInput(input2) &&
        isTwoDataInputElementSameLengthOfClassList(input1, input2))
        ||
        (isTwoInputInSamePlace(input1, input2) &&
            getGroupNameByInput(input1) != getGroupNameByInput(input2) &&
            isTwoDataInputElementSameLengthOfClassList(input1, input2))
}

function isTwoInputInSamePlace(input1, input2) {
    return getWeekNameByInput(input1) == getWeekNameByInput(input2) &&
        getLessonNumByElement(input1) == getLessonNumByElement(input2)
}

export function getGroupNameByInput(element) {
    return element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerText
}

function getDataInputElementByInput(input) {
    return input.parentElement;
}
function isTwoDataInputElementSameLengthOfClassList(input1, input2) {
    return getDataInputElementByInput(input1).classList.length === getDataInputElementByInput(input2).classList.length
}

function getDataInputsValues(dataInput) {
    const subject = dataInput.children[0].value ?? ""
    const to = dataInput.children[1].value ?? ""
    const teacher = dataInput.children[2].value ?? ""
    const audience = dataInput.children[3].value ?? ""
    if (subject || to || teacher || audience)
        return { subject, to, teacher, audience }
    else
        return null;
}

const weekNumbers = {
    "ПН": 0,
    "ВТ": 1,
    "СР": 2,
    "ЧТ": 3,
    "ПТ": 4,
}
function getNumByWeekName(weekName) {
    return weekNumbers[weekName]
}

function mergeToObject(map, data) {
    if (data)
        if (!(map[data]))
            map[data] = 1
        else map[data] = map[data] + 1
}

const formattedWeeks = {
    0: "ПОНЕДЕЛЬНИК",
    1: "ВТОРНИК",
    2: "СРЕДУ",
    3: "ЧЕТВЕРГ",
    4: "ПЯТНИЦА",
    5: "СУББОТУ",
}
const formattedMonths = {
    0: "ЯНВАРЯ",
    1: "ФЕВРАЛЯ",
    2: "МАРТА",
    3: "АПРЕЛЯ",
    4: "МАЯ",
    5: "ИЮНЯ",
    6: "ИЮЛЯ",
    7: "АВГУСТА",
    8: "СЕНТЯБРЯ",
    9: "ОКТЯБРЯ",
    10: "НОЯБРЯ",
    11: "ДЕКАБРЯ",
}
export function getFormattedHeader() {
    const date = new Date(document.querySelector('#setDateZamenaInput').value);
    return `ЗАМЕНА НА ${formattedWeeks[date.getDay() - 1]} - ${date.getDate()} ${formattedMonths[date.getMonth()]} ${date.getFullYear()} г.`;
}

export function showServerErrorModal(text) {
    new Modal(document.querySelector('#serverErrorModal')).show()
    document.querySelector('#serverErrorModalContent').innerHTML = text;
}

export function downloadBlob(blob, filename) {
    const a = document.createElement('a')
    a.addEventListener('click', () => {
        a.href = URL.createObjectURL(blob)
        a.download = `${filename}.pdf`
    })
    a.click()
}

/*
Необходимо просто отсечь день недели (потому что это замена)
*/
export function timeTableToZamena(timeTable) {
    for (let groupName of Object.keys(timeTable)) {
        const zamenaTable = timeTable[groupName]["undefined"]
        delete timeTable[groupName]["undefined"]
        Object.assign(timeTable[groupName], zamenaTable)
    }
    return timeTable;
}


export function saveTimeTableAsJsonFile(object) {
    const a = document.createElement('a')
    a.addEventListener('click', () => {
        a.href = URL.createObjectURL(new Blob([JSON.stringify(object)]))
        a.download = `расписание-${new Date().toLocaleString()}.json`
    })
    a.click()
}

export function saveZamenaAsJsonFile(object) {
    const zamenaObject = timeTableToZamena(object);
    const a = document.createElement('a')
    a.addEventListener('click', () => {
        a.href = URL.createObjectURL(new Blob([JSON.stringify(zamenaObject)]))
        a.download = `замена-${new Date().toLocaleString()}.json`
    })
    a.click()
}

export function timeTableDataToObject() {
    const result = {
        stats: {
            avgNumberLessonsByGroup: {}
        },
        data: {

        }
    }
    const groupsElements = groupsDiv.children;
    let numberBlackLessons = 0;
    const numberOfLessonsByTeachers = {}

    for (let groupElement of groupsElements) {
        const groupName = groupElement.firstElementChild.innerText
        result.data[groupName] = {}
        let numberLessons = 0

        const weeksElements = groupElement.lastElementChild.children
        for (let weekElement of weeksElements) {
            const weekNum = getNumByWeekName(weekElement.firstElementChild.innerText);
            result.data[groupName][weekNum] = {}

            const timeTablesElements = weekElement.lastElementChild.children

            for (let timeTablesElement of timeTablesElements) {
                const lessonNum = timeTablesElement.firstElementChild.firstElementChild.dataset.lessonNum - 1
                const lessons = []
                const subTimeTablesElements = timeTablesElement.lastElementChild.children

                for (let subTimeTablesElement of subTimeTablesElements) {
                    const dataInputsValues = getDataInputsValues(subTimeTablesElement);
                    if (dataInputsValues) {
                        if (subTimeTablesElement.classList.contains("black")) { // TODO
                            dataInputsValues.type = "black"
                            lessons.push(dataInputsValues)
                            numberLessons++
                            numberBlackLessons++
                        }
                        else {
                            dataInputsValues.type = "white"
                            lessons.push(dataInputsValues)
                            numberLessons++
                        }
                        // Считает сколько раз встречался той или иной препод
                        mergeToObject(numberOfLessonsByTeachers, dataInputsValues.teacher)
                    }
                }

                if (lessons.length == 2)
                    if (lessons.some(it => it.type == "black") && lessons.some(it => it.type == "white"))
                        numberLessons--

                result.data[groupName][weekNum][lessonNum] = [...lessons]

                if (Object.keys(result.data[groupName][weekNum][lessonNum]).length == 0)
                    delete result.data[groupName][weekNum][lessonNum]
            }
            if (Object.keys(result.data[groupName][weekNum]).length == 0)
                delete result.data[groupName][weekNum]
        }
        if (Object.keys(result.data[groupName]).length == 0)
            delete result.data[groupName]
        if (result.data[groupName])
            result.stats.avgNumberLessonsByGroup[groupName] = numberLessons / 5
    }
    result.stats.numberBlackLessons = numberBlackLessons
    result.stats.numberOfLessonsByTeachers = numberOfLessonsByTeachers

    return result;
}

export function showToast(text, showSpinner) {
    const toastElement = document.querySelector('#mainToast') // Мне необходимо, чтобы оно была показана сколько надо (иначе автоматически скрывается)
    toastElement.classList.add('show')
    if (showSpinner) toastElement.querySelector('.spinner-border').classList.remove('d-none');
    else toastElement.querySelector('.spinner-border').classList.add('d-none');
    toastElement.querySelector('#mainToastContent').innerText = text;
}

export function hideToast() {
    const toastElement = document.querySelector('#mainToast')
    toastElement.classList.remove('show')
}

export function hideWeeks(arrayOfElement) {
    arrayOfElement.forEach(el => el.style.display = 'none')
}
export function showWeeks(arrayOfElement) {
    arrayOfElement.forEach(el => el.style.display = 'flex')
}

export function isExistErrors() {
    return Boolean(document.querySelector('.error-input'))
}

export function resetTimeTable() {
    document.querySelectorAll('input:not([type="file"])').forEach(input => input.value = "") // TODO паралелльено
    document.querySelectorAll('.black').forEach(x => x.classList.remove('black'));
    document.querySelectorAll('.error').forEach(x => x.classList.remove('error'));
}

function clickLessonNumButton(groupName, weekNum, lessonNum) {
    const button = document.querySelector(`[group-name="${groupName}"`)
        .parentElement.lastElementChild.children[weekNum]
        .lastElementChild.children[lessonNum]
        .firstElementChild.firstElementChild
    if (button.classList.contains('btn-add-data-inputs1'))
        button.click()
}

function fillDataInputsFields(dataInputs, data) {
    const fields = dataInputs.children
    fields[0].value = data.subject
    fields[1].value = data.to
    fields[2].value = data.teacher
    fields[3].value = data.audience
}

export function loadZamenaFromJson(loadedData) {
    try {
        for (let groupName of Object.keys(loadedData)) {
            const weeksElements = document.querySelector(`[group-name="${groupName}"]`).parentElement.lastElementChild.children
            const lessonsElements = weeksElements[0]
            for (let lessonNum of Object.keys(loadedData[groupName])) {
                const timeTablesData = loadedData[groupName][lessonNum]
                const timeTablesElements = lessonsElements.lastElementChild.children[lessonNum]
                const dataInputFields = timeTablesElements.lastElementChild.children
                if (timeTablesData.length == 2) {
                    clickLessonNumButton(groupName, 0, lessonNum)
                    timeTablesData.forEach((data, idx) => {
                        if (data.type == "white")
                            fillDataInputsFields(dataInputFields[idx], data)
                        else {
                            fillDataInputsFields(dataInputFields[idx], data)
                            addClassBlack(dataInputFields[idx])
                        }
                    })
                } else {
                    if (timeTablesData[0].type == "white")
                        fillDataInputsFields(dataInputFields[0], timeTablesData[0])
                    else {
                        fillDataInputsFields(dataInputFields[0], timeTablesData[0])
                        addClassBlack(dataInputFields[0])
                    }
                }
            }
        }
    } catch (error) {
        showToast(FAIL_LOAD_ZAMENA);
        setTimeout(() => { hideToast() }, 3000)
    }
}

export function loadTimeTableFromJson(loadedTimeTable) {
    try {
        for (let groupName of Object.keys(loadedTimeTable)) {
            const weeksElements = document.querySelector(`[group-name="${groupName}"]`).parentElement.lastElementChild.children
            for (let weekNum of Object.keys(loadedTimeTable[groupName])) {
                const lessonsElements = weeksElements[weekNum].lastElementChild.children
                for (let lessonNum of Object.keys(loadedTimeTable[groupName][weekNum])) {
                    const timeTablesData = loadedTimeTable[groupName][weekNum][lessonNum]
                    const timeTablesElements = lessonsElements[lessonNum]
                    const dataInputFields = timeTablesElements.lastElementChild.children
                    if (timeTablesData.length == 2) {
                        clickLessonNumButton(groupName, weekNum, lessonNum)
                        timeTablesData.forEach((data, idx) => {
                            if (data.type == "white")
                                fillDataInputsFields(dataInputFields[idx], data)
                            else {
                                fillDataInputsFields(dataInputFields[idx], data)
                                dataInputFields[idx].classList.add('black')
                            }
                        })
                    } else {
                        if (timeTablesData[0].type == "white")
                            fillDataInputsFields(dataInputFields[0], timeTablesData[0])
                        else {
                            fillDataInputsFields(dataInputFields[0], timeTablesData[0])
                            dataInputFields[0].classList.add('black')
                        }
                    }
                }
            }
        }
    } catch (error) {
        showToast(FAIL_LOAD_TIME_TABLE)
        setTimeout(() => { hideToast() }, 3000)
    }
}

export function isClientOrServerError(status) {
    return (status <= 499 && status >= 400) || (status <= 599 && status >= 500)
}

/* export function onReady(func) {
    document.addEventListener("DOMContentLoaded", () => {
        func();
    })
} */