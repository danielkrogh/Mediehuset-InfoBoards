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
const activitiesContainer = document.querySelector('#activities'); // Container der skal indeholde vores aktiviteter
let classShorthands = ['we', 'ggr', 'agr', 'abi', 'gr', 'dm', 'mg', 'iw']; // Forkortelser i klassernes navne

const classTimes = [
    {start: 29700, end: 33599}, // Kl. 8.15 - 9.20
    {start: 33600, end: 37799}, // Kl. 9.20 - 10.30
    {start: 37800, end: 41399}, // Kl. 10.30 - 11.30
    {start: 41400, end: 43199}, // Kl. 11.30 - 12.00 - hvordan håndteres pause?
    {start: 43200, end: 46799}, // Kl. 12.00 - 13.00
    {start: 46800, end: 50399}, // Kl. 13.00 - 14.00
    {start: 50400, end: 54900} // Kl. 14.00 - 15.15
]

function setActivities() { // Opretter aktiviteter i HTML
    sortActivitiesData().then((activitiesArr) => {
        activitiesArr.forEach(activity => {
            if (new Date(activity.timestamp * 1000).getDate() == new Date().getDate() && (new Date().getHours() + 1) < 15) { // Hvis aktivitets dato er dags dato og klokken er før kl. 15 vises dagens aktiviteter           
                createActivities();
            } else if (new Date(activity.timestamp * 1000).getDate() == (new Date().getDate() + 1) && (new Date().getHours() + 1) >= 15) { // Hvis aktivitets dato er i morgen og klokken er efter kl. 15 vises morgendagens aktiviteter
                createActivities();
            }

            function createActivities() {
                let p = document.createElement('p'); // Opretter p element

                for (i = 0; i < classShorthands.length; i++) { // Looper forkortelser igennem, loop breakes ved match
                    if (activity.class.search(`${classShorthands[i]}`) >= 0) { // Vi søger i aktivitetens klassenavn efter forkortelse. Uden match vil vi få -1
                        p.setAttribute('class', `${classShorthands[i]}`); // Vi sætter forkortelse som klasse på p element
                        p.innerHTML = `${changeName(classShorthands[i])} | ${activity.classroom} | ${activity.name} | ${activity.datetime}`; // Indre HTML på p element sættes
                        break;
                    } else {
                        p.innerHTML = 'Ukendt uddannelse.' // Uden match kender vi ikke til uddannelsen
                    }
                }

                activitiesContainer.appendChild(p); // Oprettede p elemet appendes til vores container

                function changeName(shorthand) { // Funktion vi kan kalde, for at lave forkortelse om til uddannelsens navn
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