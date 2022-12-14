export const groupsDiv = document.querySelector(".groups");
export let allTeacherInputs;
export let allAudienceInputs;

/* export function getGroupsDivElement() {
    return groupsDiv;
}

export function getAllTeacherInputs() {
    // onReady(() => {
        if (!allTeacherInputs)
            allTeacherInputs = ;
    // })
    return allTeacherInputs;
}

export function getAllAudienceInputs() {
    // onReady(() => {
        if (!allAudienceInputs)
            allAudienceInputs = ;
    // })
    return allAudienceInputs;
} */

export function setAllVariables() {
    allTeacherInputs = new Set(document.querySelectorAll(".teacher-field"));
    allAudienceInputs = new Set(document.querySelectorAll(".audience-field"));
}