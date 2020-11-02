/*
    Controller
*/
function getActivitiesData() { // Henter data fra API
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

function sortActivitiesData() { // Behandler data fra API
    let activitiesArr = [];

    return getActivitiesData().then((data) => {
        data.result.forEach(element => {
            activitiesArr.push(element)
        });

        return activitiesArr;
    })
}


/*
    View
*/
const activitiesContainer = document.querySelector('#activities');
let classShorthands = ['we', 'ggr', 'agr', 'abi', 'gr', 'dm', 'mg', 'iw'];

function setActivities() { // Opretter aktiviteter
    sortActivitiesData().then((activitiesArr) => {
        activitiesArr.forEach(activity => {
            if (new Date(activity.timestamp * 1000).getDate() == new Date().getDate() && (new Date().getHours() + 1) < 15) { // Hvis aktivitets dato er = dags dato og klokken er før kl. 15 vises dagens aktiviteter           
                createActivities();
            } else if (new Date(activity.timestamp * 1000).getDate() == (new Date().getDate() + 1) && (new Date().getHours() + 1) >= 15) { // Hvis aktivitets dato er i morgen og klokken er efter kl. 15 vises morgendagens aktiviteter
                createActivities();
            }

            function createActivities() {
                let p = document.createElement('p');

                for (i = 0; i < classShorthands.length; i++) {
                    if (activity.class.search(`${classShorthands[i]}`) >= 0) {
                        p.setAttribute('class', `${classShorthands[i]}`)
                        p.innerHTML = `${changeName(classShorthands[i])} | ${activity.classroom} | ${activity.name} | ${activity.datetime}`;
                        break;
                    } else {
                        p.innerHTML = 'Ukendt uddannelse.'
                    }
                }

                activitiesContainer.appendChild(p);

                function changeName(shorthand) {
                    let text;
                    switch (shorthand) {
                        case 'we':
                            text = 'Webudvikler';
                            return text;
                            break;
                        case 'ggr':
                            text = 'Grafisk Tekniker Grundforløb 2';
                            return text;
                            break;
                        case 'agr':
                            text = 'AMU - Billedbehandling';
                            return text;
                            break;
                        case 'abi':
                            text = 'AMU - Grafisk';
                            return text;
                            break;
                        case 'gr':
                            text = 'Grafisk Tekniker';
                            return text;
                            break;
                        case 'dm':
                            text = 'Digital Medier';
                            return text;
                            break;
                        case 'mg':
                            text = 'Mediegrafiker';
                            return text;
                            break;
                        case 'iw':
                            text = 'It, web og medier';
                            return text;
                    }
                }
            }
        })
    })
}

setActivities();