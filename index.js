const express		=require("express"),
      methodOverride    =require("method-override"),
      app	        =express(),
      bodyParser	=require("body-parser"),
      mongoose		=require("mongoose");

//APP CONGFIG
mongoose.connect('mongodb://localhost:27017/admin_portal', {useNewUrlParser: true ,useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG
const workerSchema = new mongoose.Schema(
{
	name: String,
	contact: String,
	mail: String
});
const Worker=mongoose.model("Woker", workerSchema);

//RESTful ROUTES

app.get("/",function(req,res)
	   {
	res.redirect("/workers");
});

//INDEX: show all workers
app.get("/workers",function(req,res)
	   {
	//Get workers from DB
	Worker.find({},function(err,allWorkers)
				   {
		res.render("workers",{campgrounds:allWorkers});
	});
});

//NEW ROUTE
app.get("/workers/new",function(req,res){
	res.render("new");
});

//CREATE ROUTE
app.post("/workers",function(req,res)
		{
	//create a new worker and save to DB
	Worker.create(req.body.worker,function(err,newlyCreated)
					 {
		if(err)
			{
				console.log(err);
			}
		else{
			res.redirect("/workers");
		}
	});
});

//EDIT ROUTE
app.get("/workers/:id/edit",function(req,res)
	   {
	Worker.findById(req.params.id,function(err,foundWorker)
				   {
		if(err)
			{
				res.redirect("/workers");
			}
		else
		{
			res.render("edit",{worker:foundWorker});
		}
	});
});

//UPDATE ROUTE
app.put("/workers/:id",function(req,res)
	   {
	Worker.findByIdAndUpdate(req.params.id,req.body.worker,{new: true},function(err,updatedWorker)
							{
		if(err)
			{
				res.redirect("/");
			}
		else{
			res.redirect("/workers");
		}
	});
});

//DELETE ROUTE
app.delete("/workers/:id",function(req,res)
		  {
	//destroy worker
	Worker.findByIdAndRemove(req.params.id,function(err)
							{
		if(err)
			{
				res.redirect("/workers");
			}
		else
			{
				res.redirect("/workers");
			}
	});
});


app.listen(process.env.PORT || 3000,function()
		  {
	console.log("The Admin_Portal Server has Started!!!");
});
