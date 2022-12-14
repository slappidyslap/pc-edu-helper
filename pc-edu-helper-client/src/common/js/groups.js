import { 
    isTodayAfterOrEqualsSeptember, 
    repeat, 
    getGroupTemplate, 
    getTimeTableListTemplate, 
    getWeekNameByNum, 
    getTimeTableItemTemplate,
} from './utils'
import { groupsDiv } from './singletons'

export function fill() {
    const currentYear = parseInt(new Date().getFullYear().toString().slice(2))
    const isTodayAfterSep = isTodayAfterOrEqualsSeptember()

    const ekssAndSsskGroups = []
    const pksAndKsGroups = []
    const esssGroups = []
    function generateEkssAndSssk() {
        for (let i = 0; i < 3; i++) {
            let number = `1-${isTodayAfterSep ? currentYear - i : currentYear - i - 1}`
            ekssAndSsskGroups.push(`ЭкСС ${number}`)
            ekssAndSsskGroups.push(`СССК ${number}`)
        }
    }
    function generateKs() {
        for (let i = 1; i <= 3; i++) { // TODO
            for (let j = 0; j < 3; j++) {
                const number = `${i}-${isTodayAfterSep ? currentYear - j : currentYear - j - 1}`
                pksAndKsGroups.push(`КС ${number}`)
            }
        }
    }
    function generatePks() {
        for (let i = 1; i <= 3; i++) {
            for (let j = 0; j < 3; j++) {
                const number = `${i}-${isTodayAfterSep ? currentYear - j : currentYear - j - 1}`
                pksAndKsGroups.push(`ПКС ${number}`)
            }
        }
    }
    function generateEsss() {
        for (let i = 1; i <= 4; i++) {
            for (let j = 0; j < 3; j++) {
                const number = `${i}-${isTodayAfterSep ? currentYear - j : currentYear - j - 1}`
                esssGroups.push(`ЭССС ${number}`)
            }
        }
    }
    generateEkssAndSssk()
    generatePks()
    generateKs()
    generateEsss()

    const allGroupsArray = [...pksAndKsGroups]

    allGroupsArray.forEach(groupName => {
        groupsDiv.insertAdjacentHTML('beforeend', getGroupTemplate(groupName))
    })
}

export function fillTimeTableOnStart() {
    const weekTimeTableArray = document.querySelectorAll('.week-time-table')
    let weekNum = 0
    let i = 0
    while (i < weekTimeTableArray.length && weekNum < 5) {
        weekTimeTableArray[i].insertAdjacentHTML('afterbegin', getTimeTableListTemplate(getWeekNameByNum(weekNum)));
        i++
        if (weekNum != 4) weekNum++
        else weekNum = 0
    }
    for (let weekTimeTableElement of weekTimeTableArray)
        for (let lessonNum = 0; lessonNum < 7; lessonNum++)
            weekTimeTableElement.lastElementChild.insertAdjacentHTML('beforeend', getTimeTableItemTemplate(lessonNum + 1))
}