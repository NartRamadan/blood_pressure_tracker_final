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
