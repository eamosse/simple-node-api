const express = require('express');
const todos = require("./todos");
const data = require("./data")

const router = express.Router();

router.get("/todos", function(req, res) {
  data.all((data)=>{
    res.json(data);
  }, (err)=> {
    res.status(500).json(err)
  })
});

router.post("/todos", function(req, res) {
  data.save(req.body, (result)=>{
    res.json(result);
  })
});

router.put("/todos/:id/status/:status", function(req, res) {
  data.complete(req.params.id, req.params.status, (result)=>{
    res.json(result);
  })
});

router.delete("/todos/:id", function(req, res) {
  data.delete(req.params.id, (data)=>{
    res.json({
      'status': 'OK'
    });
  })
});


module.exports = router;
