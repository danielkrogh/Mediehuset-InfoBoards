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
const activityWidget = document.querySelector('#activity-widget'); // Container der skal indeholde vores aktiviteter
let classShorthands = ['we', 'ggr', 'agr', 'abi', 'gr', 'dm', 'mg', 'iw']; // Forkortelser i klassernes navne

let infoLi = `
    <li class="card">
        <div class="time">Tid</div>
        <div class="location">Lokale</div>
        <div class="class">Hold</div>
        <div class="subject">Fag</div>
    </li>`;

activityWidget.insertAdjacentHTML('beforeend', infoLi); // Opretter overskrift

const classTimes = [
    {start: 29700, end: 33599}, // Kl. 8.15 - 9.20
    {start: 33600, end: 37199}, // Kl. 9.20 - 10.20
    {start: 37200, end: 41399}, // Kl. 10.20 - 11.30
    {start: 41400, end: 43199}, // Kl. 11.30 - 12.00 - hvordan håndteres pause?
    {start: 43200, end: 46799}, // Kl. 12.00 - 13.00
    {start: 46800, end: 50399}, // Kl. 13.00 - 14.00
    {start: 50400, end: 54900} // Kl. 14.00 - 15.15
]

const dinnerBreak = {start: 41400, end: 43199};

//
// TIL AT TESTE ANDRE TIDSPUNKTER
//
let antalTimer = 0;
let antalMinutter = 0;
let antalSekunder = ((new Date().setHours(`${antalTimer}`,`${antalMinutter}`,0,0) - new Date().setHours(0,0,0,0)) / 1000);

function setActivities() { // Opretter aktiviteter i HTML
    sortActivitiesData().then((activitiesArr) => {
        activitiesArr.forEach(activity => {

            let currentTime = ((new Date().getTime() - new Date().setHours(0,0,0,0)) / 1000) + antalSekunder; // Nuværende tid i sekunder siden midnat
            let classStartTime = (activity.timestamp - (new Date().setHours(0,0,0,0) / 1000)); // Klassensstarttidspunkt i sekunder siden midnat

            classTimes.forEach(classTime => {
                if (currentTime >= classTime.start && currentTime <= classTime.end) { // Er tidspunkt nu mellem classTime.start & classTime.end
                    if (classStartTime >= classTime.start && classStartTime <= classTime.end) { // Er klasse starttidspunkt mellem classTime.start & classTime.end
                        createActivities();
                    }                     
                }
            })

            if (currentTime >= dinnerBreak.start && currentTime <= dinnerBreak.end) {
                if (classStartTime >= dinnerBreak.end && classStartTime <= 46799) {
                    createActivities();
                }
            }

            if (currentTime > classTimes[classTimes.length - 1].end) { // Er tidspunkt efter sidste classTime.end
                let nextTimestamp = activitiesArr[0].timestamp;

                if (nextTimestamp == activity.timestamp) { // Hvis aktivitets timestamp er samme som første aktivitets timestamp
                    createActivities();
                }
            }

            if (currentTime < (activitiesArr[0].timestamp - (new Date().setHours(0,0,0,0) / 1000))) { // Er tidspunkt før første aktivitets timestamp
                let nextTimestamp = activitiesArr[0].timestamp;

                if (nextTimestamp == activity.timestamp) { // Hvis aktivitets timestamp er samme som første aktivitets timestamp
                    createActivities();
                }
            }

            function createActivities() {
                let li = document.createElement('li');

                for (i = 0; i < classShorthands.length; i++) { // Looper forkortelser igennem, loop breakes ved match
                    if (activity.class.search(`${classShorthands[i]}`) >= 0) { // Vi søger i aktivitetens klassenavn efter forkortelse. Uden match vil vi få -1
                        let date = new Date(activity.datetime);
                        
                        li.setAttribute('class', 'card');

                        let divTime = document.createElement('div');
                        divTime.setAttribute('class', `time ${classShorthands[i]}`);
                        divTime.innerHTML = `${date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`

                        let divLocation = document.createElement('div');
                        divLocation.setAttribute('class', 'location');
                        divLocation.innerHTML = `${activity.classroom}`

                        let divClass = document.createElement('div');
                        divClass.setAttribute('class', 'class');
                        divClass.innerHTML = `${activity.class}`

                        let divSubject = document.createElement('div');
                        divSubject.setAttribute('class', 'subject');
                        divSubject.innerHTML = `${activity.name}`

                        li.appendChild(divTime);
                        li.appendChild(divLocation);
                        li.appendChild(divClass);
                        li.appendChild(divSubject);

                        break;
                    } else {

                    }
                }
                activityWidget.appendChild(li)

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