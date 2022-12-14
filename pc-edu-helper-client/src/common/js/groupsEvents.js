import {
    isValidAudience,
    setEmptyDataFields,
    resetDataFields,
    isInputInSameLesson,
    isNotBlank,
    isNotSameInput,
    getLessonNumByElement,
    getWeekNameByInput,
    getGroupNameByInput,
    getDataInputsTemplate,
    timeTableDataToObject,
    isExistErrors,
    saveTimeTableAsJsonFile,
    newToast,
    hideWeeks,
    showWeeks,
    saveZamenaAsJsonFile,
    loadTimeTableFromJson,
    loadZamenaFromJson,
    timeTableToZamena,
    getFormattedHeader,
    resetTimeTable,
    downloadBlob,
    isTodayAfterOrEqualsSeptember,
    getYearByGroupName,
    showServerErrorModal,
} from "./utils"

import { groupsDiv, allAudienceInputs, allTeacherInputs } from "./singletons"

const IF_EXISTS_ERROR_TEXT = 'Исправьте ошибки';
const API_URL = process.env.PC_EDU_HELPER_API_URL;

export function registerMainListeners() {
    groupsDiv.addEventListener("change", onChangeInput)

    groupsDiv.addEventListener("click", (event) => {
        const target = event.target;
        if (target.closest(".data-inputs")) onPressAltAndClick(event)
        else if (target.closest(".time-table__item-num")) onClickLessonButton(event)
    })

    document.querySelector('.dropdown-menu').addEventListener('click', (event) => {
        const target = event.target;
        if (target.closest('#generateAnalyzeBtn')) onClickGenerateAnalyzeBtn(event)
        else if (target.closest('#saveBtn')) onClickSaveBtn();
        else if (target.closest('#preShowZamenaBtn')) onClickPreShowZamenaBtn()
        else if (target.closest('#exportTimeTableBtn')) onClickExportTimeTableBtn()
        else if (event.altKey) {
            if (target.closest('#exportTimeTableBtn')) onClickExportTimeTableBtn()
            else if (target.closest('#changeModeBtn')) onClickChangeModeBtn()
            else if (target.closest('#exportZamenaBtn')) onClickExportZamenaBtn()
        }
    })

    document.querySelector('#loadInput').addEventListener('change', (event) => onСhangeLoadInput(event))
}

const onClickExportZamenaBtn = async () => {
    const timeTableObject = timeTableDataToObject(); // todo сразу в замену
    const zamenaObject = timeTableToZamena(timeTableObject.data)
    const name = getFormattedHeader()
    if (name.includes('undefined')) {
        newToast('Выберете дату');
        return;
    }
    const response = await fetch(`${API_URL}/zamena`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, data: zamenaObject })
    })
    if (response.status <= 499 && response.status >= 400) {
        const json = await response.json();
        console.error(json.trace);
        showServerErrorModal(json.trace);
    }
}

const onClickExportTimeTableBtn = async () => {
    const data = timeTableDataToObject().data;
    const isTodayAfterOrEqualsSep = isTodayAfterOrEqualsSeptember();
    const currentYear = new Date().getFullYear() % 100;
    [0, 1, 2].forEach(async (i) => {

        const groupData = Object.fromEntries(
            Object.entries(data).filter(([key]) => {
                const groupYear = getYearByGroupName(key)
                if (isTodayAfterOrEqualsSep) return currentYear - groupYear == i;
                else return currentYear - groupYear == i + 1;
            })
        )
        const name = `Расписание ${i + 1} курс`
        const response = await fetch(`${API_URL}/documents/time-table`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ data: groupData, name })
        })
        if (response.status == 200) {
            const blob = await response.blob();
            downloadBlob(blob, name);
        } else {
            const json = await response.json();
            console.error(json.trace);
            showServerErrorModal(json.trace);
        }
    })
}

const onClickPreShowZamenaBtn = async () => {
    const timeTableObject = timeTableDataToObject(); // todo сразу в замену
    const zamenaObject = timeTableToZamena(timeTableObject.data)
    const name = getFormattedHeader()
    if (name.includes('undefined')) {
        newToast('Выберете дату');
        return;
    }
    const response = await fetch(`${API_URL}/documents/zamena`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, data: zamenaObject })
    })
    if (response.status == 200) {
        const blob = await response.blob();
        downloadBlob(blob, name);
    } else {
        const json = await response.json();
        console.error(json.trace);
        showServerErrorModal(json.trace);
    }
}

const onClickChangeModeBtn = (event) => {
    const weeks = Array.from(document.querySelectorAll('.weeks'))
        .map(weekEl => {
            const children = weekEl.children
            const mondayElement = children[0].firstElementChild
            if (mondayElement.innerText == 'ПН')
                mondayElement.innerText = ''
            else
                mondayElement.innerText = 'ПН'
            return Array.from(children).slice(1)
        })
        .flatMap(el => el)
    const target = event.target
    if (target.innerText == 'В "Замена" режим') {
        hideWeeks(weeks)
        target.innerText = 'В "Обычный" режим'
    } else {
        showWeeks(weeks)
        target.innerText = 'В "Замена" режим'
    }
}

const onСhangeLoadInput = (event) => {
    resetTimeTable() // todo
    const reader = new FileReader();
    reader.onload = (event) => {
        const loadedTimeTable = JSON.parse(event.target.result)
        const changeModeBtn = document.querySelector('#changeModeBtn');
        console.log(changeModeBtn.innerText == 'В "Замена" режим')
        console.debug('Загружаем...')
        if (changeModeBtn.innerText == 'В "Замена" режим')
            loadTimeTableFromJson(loadedTimeTable)
        else
            loadZamenaFromJson(loadedTimeTable)
    }
    reader.onerror = (error) => {
        newToast(error)
    }
    reader.readAsText(event.target.files[0])
    event.target.value = null

}

const onClickSaveBtn = () => {
    if (isExistErrors()) {
        console.debug('Найдены дубликаты')
        newToast(IF_EXISTS_ERROR_TEXT)
        return;
    }
    const timeTableObject = timeTableDataToObject();
    console.debug('Сохраняем...')
    console.dir(timeTableObject)
    if (changeModeBtn.innerText == 'В "Замена" режим')
        saveTimeTableAsJsonFile(timeTableObject.data)
    else
        saveZamenaAsJsonFile(timeTableObject.data)
}
// todo checksum
const onClickGenerateAnalyzeBtn = () => {
    const timeTableObject = timeTableDataToObject();
    let avgNumberLessonsByGroupString = ''
    for (let [group, avg] of Object.entries(timeTableObject.stats.avgNumberLessonsByGroup)) {
        avgNumberLessonsByGroupString +=
            `
        <div class="col">
            <div>${group}</div>
        </div>
        <div class="col">
            <div>${avg}</div>
        </div>
        `
    }
    let numberOfLessonsByTeachersString = ''
    for (let [teacher, amount] of Object.entries(timeTableObject.stats.numberOfLessonsByTeachers)) {
        numberOfLessonsByTeachersString +=
            `
        <div class="col">
            <div>${teacher}</div>
        </div>
        <div class="col">
            <div>${amount}</div>
        </div>
        `
    }
    let resultText = `
        Общее кол-во серых пар: ${timeTableObject.stats.numberBlackLessons} \n
        <hr>
        Среднее кол-во пар за неделю:
        <div class="row row-cols-2 g-2">
            ${avgNumberLessonsByGroupString}
        </div>
        <hr>
        Кол-во пар проводимых учителями:
        <div class="row row-cols-2 g-2">
            ${numberOfLessonsByTeachersString}
        </div>
    `

    document.querySelector('#analyzeModalContent').innerHTML = resultText
}

const onClickLessonButton = (event) => {
    const target = event.target;

    if (target && event.target.closest(".btn-add-data-inputs1")) {
        target.parentElement.nextElementSibling.insertAdjacentHTML('beforeend', getDataInputsTemplate(true));
        target.classList.remove("btn-add-data-inputs1")
        target.classList.add("btn-add-data-inputs2")
        allTeacherInputs.add(target.parentElement.parentElement.lastElementChild.lastElementChild.children[2])
        allAudienceInputs.add(target.parentElement.parentElement.lastElementChild.lastElementChild.children[3])

    } else if (target && target.closest(".btn-add-data-inputs2")) {
        allTeacherInputs.delete(target.parentElement.parentElement.lastElementChild.lastElementChild.children[2])
        allAudienceInputs.delete(target.parentElement.parentElement.lastElementChild.lastElementChild.children[3])
        target.parentElement.nextElementSibling.lastElementChild.children[2].dispatchEvent(new Event('change', { bubbles: true })); // TODO
        target.parentElement.nextElementSibling.lastElementChild.children[3].dispatchEvent(new Event('change', { bubbles: true }));
        target.parentElement.nextElementSibling.lastElementChild.style.backgroundColor = "hotpink"
        setTimeout(() => {
            target.parentElement.nextElementSibling.lastElementChild.remove();
        }, 500)
        target.classList.remove("btn-add-data-inputs2")
        target.classList.add("btn-add-data-inputs1")
    }
}

const onPressAltAndClick = (event) => {
    const target = event.target
    if (event.altKey) {
        target.closest(".data-inputs").classList.toggle('black')
        target.closest(".data-inputs").children[2].dispatchEvent(new Event('change', { bubbles: true })); //todo
        target.closest(".data-inputs").children[3].dispatchEvent(new Event('change', { bubbles: true }));
    }
}

const onChangeInput = (event) => {
    const target = event.target;

    if (target.closest("input")) {
        // Если поле, где указывают номер аудитории, то сначала проверка на валидность
        if (target.closest('.audience-field input')) {
            if (!isValidAudience(target))
                // target.title += `Не валидное значение`
                // target.classList.add("error")
                target.value = "1";
        }
        else if (target.closest('input.subject-field')) {
            if (target.value == 'НЕТ')
                setEmptyDataFields(target);
            else
                resetDataFields(target);
        }
        const lessonNum = getLessonNumByElement(target);
        const weekName = getWeekNameByInput(target);
        /* const id = getDataInputIdByInput(target); */
        const allRespectiveInputs = target.closest('.teacher-field') ? allTeacherInputs : allAudienceInputs;
        const filteredAllInput = [...allRespectiveInputs].filter(input => {
            const isParallelInput = getLessonNumByElement(input) == lessonNum
                && getWeekNameByInput(input) == weekName;
            if (isParallelInput) {
                input.classList.remove('error-input');
                input.title = "";
            }
            return isParallelInput;
        });
        for (let input of filteredAllInput) {
            for (let checkingInput of filteredAllInput) {
                // Выводить ошибку если: 
                // первый и второй не один и тот же инстанс input (других будет винить);
                // первый и второй находятся в одно время:
                //      своей группе
                //      паралелььное группе
                // только если
                if (isNotBlank(checkingInput) && isNotBlank(input) &&
                    isNotSameInput(input, checkingInput) &&
                    checkingInput.value.toLowerCase().trim() == input.value.toLowerCase().trim() &&
                    isInputInSameLesson(input, checkingInput)
                ) {
                    if (!input.title) {
                        input.title = "Совпадения найдены в:\n";
                    }
                    input.title += `${getGroupNameByInput(checkingInput)}\n`;
                    checkingInput.classList.add("error-input");
                }
            }
        }
    }
}
