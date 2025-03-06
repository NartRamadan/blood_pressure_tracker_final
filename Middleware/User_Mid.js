async function AddUser(req,res,next){
    let name   = req.body.name;

    const Query = `INSERT INTO Users (name) VALUES('${name}')`;
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
async function ReadUsers(req,res,next){
    const Query = `SELECT * FROM users `;
    // console.log(Query);
    const promisePool = db_pool.promise();
    let users=[];
    // req.id=[];
    try {
        const [rows] = await promisePool.query(Query);
        for(const row of rows)
        {
            console.log(row.name);
            let user={
                name:row.name,
                id:row.id
            }
            users.push(user);
        }
        req.success=true;
        req.Users_data=users;
    } catch (err) {
        req.success=false;
        console.log(err);
    }
    next();
}

module.exports = {
    AddUser: AddUser,
    ReadUsers: ReadUsers ,

}