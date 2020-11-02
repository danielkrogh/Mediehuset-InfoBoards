/*
    Controller
*/
function getActivitiesData() {
    return fetch('https://api.mediehuset.net/infoboard/activities')
        .then((resp) => {
            return resp.json()
                .then((data) => {
                    return data;
                })
                .catch((err) => {

                })
        })
}

function sortActivitiesData() {
    let classNameArr = [];

    return getActivitiesData().then((data) => {
        data.result.forEach(element => {
            classNameArr.push(element.class)
        });

        return classNameArr;
    })
}


/*
    View
*/
const activitiesContainer = document.querySelector('#activities');

function setActivities() {
    sortActivitiesData().then((classNameArr) => {
        classNameArr.forEach(className => {
            let p = document.createElement('p');

            if (className.search('we') >= 0) {
                p.setAttribute('class', 'we')
                p.innerHTML = 'Webudvikler'
            } else if (className.search('ggr') >= 0) {
                p.setAttribute('class', 'gr')
                p.innerHTML = 'Grafisk Tekniker Grundforløb 2'
            } else if (className.search('agr') >= 0) {
                p.setAttribute('class', 'amu')
                p.innerHTML = 'AMU - Billedbehandling'
            } else if (className.search('abi') >= 0) {
                p.setAttribute('class', 'amu')
                p.innerHTML = 'AMU - Grafisk'
            } else if (className.search('gr') >= 0) {
                p.setAttribute('class', 'gr')
                p.innerHTML = 'Grafisk Tekniker'
            } else if (className.search('dm') >= 0) {
                p.setAttribute('class', 'dm')
                p.innerHTML = 'Digital Medier'
            } else if (className.search('mg') >= 0) {
                p.setAttribute('class', 'mg')
                p.innerHTML = 'Mediegrafiker'
            } else if (className.search('iw') >= 0) {
                p.setAttribute('class', 'iw')
                p.innerHTML = 'It, web og medier'
            } else {
                p.innerHTML = 'noget andet'
            }

            activitiesContainer.appendChild(p);
        })
    })
}

setActivities();