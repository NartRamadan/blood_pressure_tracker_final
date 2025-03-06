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

module.exports = {
    GetMeasurement: GetMeasurement
}