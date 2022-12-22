import { isTodayAfterOrEqualsSeptember } from "./utils"

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#groupName').value = '.+'
    document.querySelector('#groupYear').value = '-1'
})

const groupsDiv = document.querySelector(".groups");
let filterGroupName = '.+'
let filterGroupYear = '-1'

export default function registerListenersForFilter() {
    document.querySelector('#filters').addEventListener('change', event => {
        const target = event.target;
        if (target.closest('#groupYear'))
            filterGroupYear = target.value
        else
            filterGroupName = target.value

        const currentYear = parseInt(new Date().getFullYear().toString().slice(2))

        let regex
        if (isTodayAfterOrEqualsSeptember())
            regex = new RegExp(`^${filterGroupName} \\d-${filterGroupYear != -1 ? currentYear - filterGroupYear : '\\d{2}'}$`)
        else
            regex = new RegExp(`^${filterGroupName} \\d-${filterGroupYear != -1 ? currentYear - filterGroupYear - 1 : '\\d{2}'}$`)

        console.debug(regex);
        Array.from(groupsDiv.children).forEach(it => {
            const text = it.firstElementChild.innerText
            regex.test(text) ? it.style.display = 'block' : it.style.display = 'none'
            regex.lastIndex = 0
        })
    })
}


