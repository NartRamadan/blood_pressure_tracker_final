async function GetReport() {
    console.log('halo report');

    let startDate= document.getElementById("startDate").value;
    let endDate= document.getElementById("endDate").value;
    let url= "/Measurement/Report";
    let res = await fetch(url,{
        method:'POST',
        headers:{
            "Content-Type": 'application/json'
        },
        body:JSON.stringify({
            start_date: startDate,
            end_date: endDate,
        }),
    });

    console.log(url);
    console.log(res);


    let jsData = await res.json();
    console.log(jsData);
    console.log('Nart');
    let measurements= jsData.data;
    console.log(measurements);
    // let html = "";
    let html = `
<table>
    <thead>
        <tr>
            <th>Name  </th>
            <th>AvgLow </th>
            <th>AvgHigh</th>
            <th>AvgPulse</th>
            <th>Outliers</th>
        </tr>
    </thead>
     <tbody>
`;
    for (const measurement of measurements) {
        html += `
        <tr>

            <td>${measurement.userName}</td>
            <td>${measurement.avgLow}</td>
            <td>${measurement.avgHigh}</td>
            <td>${measurement.avgPulse}</td>
            <td>${measurement.outliersCount}</td>

        </tr>
`;
    }
    html += ` </tbody>
</table>
`;



    document.getElementById("report").innerHTML = html;
}
async function ReadUsers() {
    let url= "/User";
    let res = await fetch(url);
    console.log(url);
    console.log(res);


    let jsData = await res.json();
    console.log(jsData);
    console.log('myLuv');
    let users= jsData.data;
    console.log(users);
    let userNames = "";
    for (const user of users) {
        console.log(user.id);
        console.log(user.name);
        userNames += `<option value="${user.id}">${user.name}</option>`;
    }
    document.getElementById("userNames").innerHTML = userNames;
}
async function GetHistoryById() {
    let user_id= document.getElementById("userNames").value;
    let startDate= document.getElementById("startDate").value;
    let endDate= document.getElementById("endDate").value;
    let url= "/Measurement/History";
    let res = await fetch(url,{
        method:'POST',
        headers:{
            "Content-Type": 'application/json'
        },
        body:JSON.stringify({
            user_id: user_id,
            start_date: startDate,
            end_date: endDate,
        }),
    });

    console.log(res);


    let jsData = await res.json();
    console.log(jsData);
    console.log('Nart');
    let measurements= jsData.data;
    console.log(measurements);
    // let html = "";
    let html = `
<table>
    <thead>
        <tr>
            <th>Date</th>
            <th>Low</th>
            <th>High</th>
            <th>Pulse</th>
        </tr>
    </thead>
     <tbody>
`;
    for (const measurement of measurements) {
        html += `
        <tr>
            <td>${measurement.date}</td>
            <td>${measurement.isLowOutlier ? `<strong>${measurement.low}</strong>` : measurement.low}</td>
            <td>${measurement.isHighOutlier ? `<strong>${measurement.high}</strong>` : measurement.high}</td>
            <td>${measurement.isPulseOutlier ? `<strong>${measurement.pulse}</strong>` : measurement.pulse}</td>
        </tr>
`;
    }
    html += ` </tbody>
</table>
`;



    document.getElementById("history").innerHTML = html;
}
async function AddUserMeasurement() {
    let user_id= document.getElementById("userNames").value;
    console.log(user_id);
    let high_val = document.getElementById("high_Val").value;
    console.log(high_val);
    let low_val = document.getElementById("low_Val").value;
    console.log(low_val);
    let pulse = document.getElementById("pulse").value;
    console.log(pulse);
    let measurementDate = document.getElementById("measurementDate").value;

    if (!high_val || !low_val || !pulse) {
        alert(' fill fields');
        return;
    }
    let url= "/Measurement/AddMeasurement";
    let res = await fetch(url,{
        method:'POST',
        headers:{
            "Content-Type": 'application/json'
        },
        body:JSON.stringify({
            user_id: user_id,
            high_value: high_val,
            low_value: low_val,
            pulse: pulse,
            measurement_date: measurementDate
        }),
    });
    let data = await res.json();
    if (data.message){
        alert(data.message);
    } else {
        alert("ok!");
    }
}

