const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;
const pool = new Pool({
    user: 'PostgreSQL',
    host: 'localhost',
    database: 'taskdb',
    password: '1234',
    port: 5432


})

app.use(express.json());


//Get all Task Details


app.get('/task',(req,res)=>{
    pool.query('SELECT * FROM tasks',(errror,result)=>{
        if(errror)
        {
            throw errror;
        }
        res.status(200).json(result.rows);
    });
});



//Get a single task by id
app.get('/task/:id',(req,res)=>{
    const taskId=req.params.id;
    pool.query('SELECT * FROM tasks WHERE id=$1',[taskId],(errror,result)=>{

        
        if(errror)
        {
            throw errror;
        }
        res.status(200).json(result.rows[0]);
    });
});


//Post Create new tasks

app.post('/tasks',(req,res)=>{
const {title,description,status}=req.body;
pool.query('INSERT INTO tasks(title,description,status)VALUES($1,$2,$3)'),
[title,description,status],(errror,result)=>{
        
    if(errror)
    {
        throw errror;
    }
    res.status(200).send(`task as been created by id:${result.insertId}`);
};
});

//PUT:update an existing task by id

app.put('/tasks/:id',(req,res)=>{

    const taskID=req.params.id;
    const {title,description,status}=req.body;
    pool.query('UPDATE tasks SET title =$1,description=$2,status=$3,updated_at=current_timestamp where id=$4'),
    [title,description,status,taskID],(errror,result)=>{
            
        if(errror)
        {
            throw errror;
        }
        res.status(200).send(`task as updated with the id :${taskID}`);
    };
    });

    //DELETE :Delete a task By Id

    app.delete('/tasks/:id',(req,res)=>{

        const taskID=req.params.id;
        pool.query('DELETE FROM tasks where id=$1',
        [taskID],(errror)=>{
                
            if(errror)
            {
                throw errror;
            }
            res.status(200).send(`Task deleted Sucessfully with th id :${taskID}`);
        });
        });


        function validateTask(req,res,next){
            const {title,status}=req.body;
            if(!title ||!status)
            {
                return res.status(400).json({message:'Title and status are required'});
            }
            if(!['to do','in progress','completed'].includes(status)){
                return res.status(400).json({message:'Invalid status....'})
            }

            next();
        }


        app.post('/tasks',validateTask);
        app.put('/tasks/:id',validateTask);


        app.use((err,req,res,next)=>{
            console.error(err.stack);
            res.status(500).json({message:'Something  went wrong'})
        })

        app.listen(port,()=>{
            console.log(`Server is Runningon port ${port}`)
        })