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
    return getActivitiesData().then((data) => {
        return data;
    })
}


/*
    View
*/
function setActivities() {
    sortActivitiesData().then((data) => {
        console.log(data);
    })
}

setActivities();