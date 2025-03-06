async function GetMeasurement(req,res,next){
    const Query = `SELECT * FROM measurements `;
    // console.log(Query);
    const promisePool = db_pool.promise();
    let rows=[];
    req.id=[];
    try {
        [rows] = await promisePool.query(Query);
        req.success=true;
        req.measurements=rows;
    } catch (err) {
        req.success=false;
        console.log(err);
    }
    next();
}
function average(arr) {
    if (!arr || arr.length === 0) return 0;
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
}
async function GetReport(req,res,next){
    try {    const promisePool = db_pool.promise();

        let start = req.body.start_date;
        let end = req.body.end_date;
        console.log(start);
        console.log(end);
        if (!start || !end) {
            req.reportData=null
            console.log('start or end missing');
            return;
        }
        console.log('building sql');

        const sql = `
        SELECT m.*, u.name AS userName
        FROM measurements m
        JOIN users u ON m.user_id = u.id
        WHERE measurement_date BETWEEN '${req.body.start_date}' AND '${req.body.end_date}'
        ORDER BY m.user_id
    `;
        console.log('running qurrey');
        console.log(sql);


        const [rows] = await promisePool.query(sql);
        console.log('finished qurrey');
        console.log(rows.length);



        if (rows.length === 0) {
            req.reportData=[]
            return;
        }

        const usersData = {};

        for (const row of rows) {
            const userId = row.user_id;
            if (!usersData[userId]) {
                console.log(`adding ${userId}`);
                usersData[userId] = {
                    userName: row.userName,
                    lowValues: [],
                    highValues: [],
                    pulseValues: []
                };
            }
            console.log(`pushing ${row.low_value}`);

            usersData[userId].lowValues.push(row.low_value);
            console.log(`pushing ${row.high_value}`);

            usersData[userId].highValues.push(row.high_value);
            console.log(`pushing ${row.pulse}`);

            usersData[userId].pulseValues.push(row.pulse);
        }

        const reportData = [];

        for (const userId in usersData) {
            console.log(`cal avg of user ${userId}`);

            const user = usersData[userId];
            const avgLow = average(user.lowValues);
            console.log(`cal avg 1 ${avgLow}`);

            const avgHigh = average(user.highValues);
            console.log(`cal avg 2 ${avgHigh}`);

            const avgPulse = average(user.pulseValues);
            console.log(`cal avg 3 ${avgPulse}`);


            let outliersCount = 0;

            for (let i = 0; i < user.lowValues.length; i++) {
                const lowVal = user.lowValues[i];
                console.log(`low val[${i}] ${lowVal}`);

                const highVal = user.highValues[i];
                console.log(`high val[${i}] ${highVal}`);

                const pulseVal = user.pulseValues[i];
                console.log(`pulse val[${i}] ${pulseVal}`);

                if (lowVal > avgLow * 1.2)
                {
                    outliersCount++;
                    console.log(`${outliersCount}`);
                }
                if(highVal > avgHigh * 1.2)
                {
                    outliersCount++;
                    console.log(`${outliersCount}`);
                }
                if(pulseVal > avgPulse * 1.2)
                {
                    outliersCount++;
                    console.log(`${outliersCount}`);
                }
            }
            console.log(`pussing following data: ${user.userName},${avgLow},${avgHigh},${avgPulse},${outliersCount}`);
            reportData.push({
                userName: user.userName,
                avgLow,
                avgHigh,
                avgPulse,
                outliersCount
            });
        }
        console.log(`pushed ${reportData.length}`);


        req.reportData=reportData;
        req.success=true;
    } catch (err) {
        req.success=false;
        console.log(err);
    }
    next();
}
async function GetHistoryById(req,res,next){
    const Query = `SELECT * FROM measurements WHERE user_id=${req.body.user_id} AND measurement_date BETWEEN '${req.body.start_date}' AND '${req.body.end_date}' `;
    console.log(Query);
    const promisePool = db_pool.promise();
    let rows=[];
    req.id=[];
    try {
        [rows] = await promisePool.query(Query);


        let userData    =[];
        let lowValues   =[];
        let highValues  =[];
        let pulseValues =[];

        for (const row of rows)
        {
            let data =
                {
                    date:row.measurement_date,

                    low:row.low_value,
                    isLowOutlier:false,

                    high:row.high_value,
                    isHighOutlier:false,

                    pulse:row.pulse,
                    isPulseOutliers:false,
                };
            userData.push(data);

            lowValues.push(row.low_value);

            highValues.push(row.high_value);

            pulseValues.push(row.pulse);
        }

        const avgLow = average(lowValues);
        console.log(`cal avg 1 ${avgLow}`);

        const avgHigh = average(highValues);
        console.log(`cal avg 2 ${avgHigh}`);

        const avgPulse = average(pulseValues);
        console.log(`cal avg 3 ${avgPulse}`);

        for (let userMeasures of userData)
        {
            console.log(`cal avg of user ${userMeasures}`);

            if (userMeasures.low > avgLow * 1.2)
            {
                userMeasures.isLowOutlier=true;
            }
            if(userMeasures.high > avgHigh * 1.2)
            {
                userMeasures.isHighOutlier=true;

            }
            if(userMeasures.pulse > avgPulse * 1.2)
            {
                userMeasures.isPulseOutlier=true;

            }
        }
        req.success=true;
        req.userData=userData;
    } catch (err) {
        req.success=false;
        console.log(err);
    }
    next();
}
async function AddMeasurement(req,res,next){
    let user_id             = req.body.user_id;
    let measurement_date    = req.body.measurement_date ;
    let low_value           = req.body.low_value;
    let  	high_value      = req.body.high_value;
    let  	pulse           = req.body.pulse;


    const Query = `INSERT INTO measurements (user_id,measurement_date,low_value,high_value,pulse) VALUES(${user_id},'${measurement_date}',${low_value},${high_value},${pulse})`;
    // console.log(Query);
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
        req.success=true;
        req.insertId=rows.insertId;
    } catch (err) {
        console.log(err);
        req.success=false;
        req.insertId=-1;
    }

    next();
}

module.exports = {
    GetMeasurement: GetMeasurement,
    GetReport:      GetReport,
    GetHistoryById: GetHistoryById,
    AddMeasurement: AddMeasurement
}